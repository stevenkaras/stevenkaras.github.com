---
title: Background work with AMQP
layout: post
---
Asynchronous processing is important in many systems. My introduction to working with such systems was a trial by fire. I had never worked with background processing, yet was faced with both designing and implementing it. This left me with the latitude to select the best tool for the job. After comparing several options, I settled on using RabbitMQ with [Sneakers](http://sneakers.io).

# The quickest intro to AMQP ever

AMQP is the Advanced Message Queue Protocol. It provides us with the consumer/producer abstraction in a client/server fashion. In this way, we can produce messages and consume them on different servers, using a message broker as an in-between (usually the setup is much more complicated, with many producers, many consumers, and a scalable broker).

RabbitMQ implements the AMQP protocol, which represents producers as "exchanges", which accept published messages, and place them into "queues". Routing of messages can be 1:1, 1:n, n:m, or somewhere in the fuzzy whitespace between those.

RabbitMQ's site has a better explanation than I could ever give on [AMQP](http://www.rabbitmq.com/tutorials/amqp-concepts.html)

# Worker types

## Processing worker

A processing worker takes messages off a queue, and processes them. If it finishes off all the messages in its queue, it will wait for more to arrive. This is the classic "background worker" pattern that I've used Sneakers to solve.

## One-off worker

This worker type reads all the messages off a queue until it's empty. This worker is great for building reports, doing some one-off work that you know isn't high priority, etc. Here's some starter code that I use for this worker type:

{% highlight ruby %}
task "error_report" do
  require 'bunny'

  conn = Bunny.new(ENV["AMQP_URL"])
  conn.start

  channel = conn.create_channel
  queue = channel.queue("errors", durable: true)

  #TODO: add some boilerplate to the report hash
  report = {}

  loop do
    delivery_info, properties, payload = queue.pop
    break if payload.nil?

    #TODO: add some content to the report hash here
  end
  conn.close

  #TODO: render the report from the hash here (using templates, etc)
end
{% endhighlight %}

# Some tips for working with Sneakers

## Syntax errors

If you have a syntax error, Sneakers/Rails will eat the message and you won't necessarily see it.

## Catching errors

When an error is thrown, Sneakers doesn't log it, so it's up to you to log it in your worker. Method-level rescue is a great fit here:

{% highlight ruby %}
class MyWorker
  include Sneakers::Worker
  from_queue "worker"

  def work(jobspec)
    # do the work
  rescue => e
    logger.error { "Fatal error in #{self.class.name}: #{e.message}" }
    raise e
  end
end
{% endhighlight %}

## Error Queue

I have grown fond of creating a dedicated queue for reporting errors. I have a one-off worker generate reports from this queue periodically. The format I use for messages in this is quite simple:

- worker classname
- error message
- timestamp

I've also found it useful to maintain a separate error queue parallel to each worker queue. I usually only do this for workers that make network requests, and use the error queue to reschedule using a backoff strategy.

## Scheduled delivery

I haven't had time to work through this one completely, but RabbitMQ has a workaround using message expiration dates and a dead message exchange. I'll follow up on this when I get a chance to investigate it further.

## Connection bug/workaround

At the moment, Sneakers has a [bug](http://github.com/jondot/sneakers/issues/17) when connecting to AMQP servers with a vhost. Typically, when you see this, it will be an "authentication failed" error in the logs. Here's the boilerplate code I use to work around this issue:

{% highlight ruby %}
require 'sneakers'
require 'uri'
amqp_url = ENV["AMQP_URL"] || "amqp://guest:guest@localhost:5672/"
begin
  amqp_vhost = URI.parse(amqp_url).path[1..-1]
  amqp_vhost = "/" if amqp_vhost.empty?
rescue
  amqp_vhost = "/"
end
begin
  uri = URI.parse(amqp_url)
  uri.path = ""
  amqp_url = uri.to_s
rescue
end
Sneakers.configure amqp: amqp_url, vhost: amqp_vhost
{% endhighlight %}
---
layout: post
title: Distributed Web Crawling
---
One of my project has a very large and complex workflow, which includes at several stages network requests. As a result of our horizontally scalable architecture, we are forced to solve the problem of distributed web crawling, including coordination of network requests to comply with the crawl delay in a given server's robots.txt. Here, I'll share how we solved this issue, including some tips on how to improve on our solution.

# The overall architecture

The general architecture we use for our system is Sneakers worker processes consuming tasks off AMQP queues. Several of these workers receive URLs to crawl. In general, a single request is usually processed, which returns a list of other links to be crawled by another class of worker (we do not have a recursive architecture, so we don't need to worry about hitting the same page twice)

# Robots.txt, and how to be polite

A common misconception is that to write a polite crawler, all you need to do is sleep 10 seconds after the previous request started. However, not only do you need to wait after the previous request finished, but the delay period is configurable per site. To support this feature, I wrote a quick robots.txt parser that isn't magic, and supports cached versions of the robots file, along with sane defaults.

I've posted the code for [parsing robots.txt](https://gist.github.com/stevenkaras/a07a99bc66b7becf51b2) for your convenience, licensed under MIT.

# Our first solution

Our first solution used a global map of servers to track when the last request was made. We also store some metadata regarding the request, such as the last time a successful (i.e. status 2xx or 3xx) request was made. This started to show cracks when we scaled our worker to several VMs, and fell apart completely when we increased the number of worker processes.

# A better solution

Since we had already scaled to multiple machine instances, we need a shared resource to coordinate between them. The minimum of information that needs to be shared is this:

* Per server (hostname)
  * Last time a reqeust was completed
  * Mutex for ensuring single access to a particular server
  * Cache of the robots.txt file, if any was found

For our application, we chose to store this data in a Redis instance. We used the redis-lock ruby gem to provide the mutex primitive, and store the rest as simple key-value entries.

# Into the future

This is a sufficient solution for the time being, but we'll be extending it with new capabilities:

* HTTP/S, FTP abstraction library
* Storing etags for specific URLs
* Tracing redirect chains

---
layout: post
title: Managing local services
tags: []
---
As a travelling developer, I've found that battery life is pretty important. As such, I don't really want to be on the road and find out that postgres is sucking the battery. Especially when you have 1 project that needs postgres, redis, rabbitmq, and another that needs postgres, memcached, and rabbitmq. I started out by writing a script to run postgres on demand, and that evolved into running redis also. A few days ago, I finally rewrote it to take a list of services to run from the command line (or a .services file in the pwd) and run them until it gets ^C'ed.

Of course, now that I've seen how this works, I'm starting to understand why it's been written that you shouldn't write your server to daemonize itself, but rather let the init system/service management to run it. Rather than bore you with details, I'm just going to link the [gist][0].

[0]: https://gist.github.com/stevenkaras/a731e7c956e8139f4eaf

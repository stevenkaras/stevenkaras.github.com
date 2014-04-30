---
layout: post
title: Building URLs for Rails in Background Workers
---
Most systems that I work on have a need for background workers. Anything that deals with email, or crawling external sites, or just expensive, yet infrequent operations that produce artifacts. Almost all of the time, these also require building URLs that point to my Rails application. Now, there are a few ways to go about this. One is to hardcode everything. Another would be to hack in a ton of environment variables. Another, that I've seen in some horrible trainwrecks of codebases, is to duplicate the entire routing engine. I came up with one that works off two environment variables, and allows the use of all the normal URL helpers.

tl;dr - the code is [here](https://gist.github.com/stevenkaras/cd7d72ec2d91783dd418)

The root of the problem is that the normal url_helpers mixin uses a controller, which doesn't exactly work in a background worker without a request object. So I started by mocking this object, and seeing how little I could provide before it would work. There were a couple of things I tried to make it easier to work with. First, I tried to have it detect the hostname of the machine. Works great when it's my local machine. But with EC2 or Heroku, that approach just doesn't work. Worse, once you put your app behind a reverse proxy, or use Heroku, you can't even rely on the port number you're server process is listening on.

So I decided to take the 12 factor route. If the PUBLIC_HOSTNAME environment variable is defined, then I use that. Otherwise, it defaults to localhost (makes bootstrapping a dev env quicker/easier/PoLS). Similarly, the PUBLIC_PORT defines the port (I have seen production servers run on oddball ports, rather than using CNAME domains).

Once we've set this information, we can build our mock object. It simply provides the absolute minimum that a request object can, and then provides the actual environment (with sane defaults).

If the gist gets popular, I'll turn this into a gem, but otherwise, feel free to use the code (WTFPL terms apply).
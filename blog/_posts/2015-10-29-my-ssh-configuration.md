---
layout: post
title: My SSH configuration
tags: []
---
For the last few weeks, I've become more and more obsessed with getting my dev environment working ever smoother. Part of that is ensuring that I can ssh into any of my servers quickly and painlessly. Unfortunately, that means dealing with the ugly beast that is security best practices. Namely, the problem of key rotation. So I sat down and wrote some scripts for client key rotation.

You'll notice that I also set my SSH to use a per-server client key. The reasoning is that if you want to rotate a key, you won't necessarily have instaneous access to all your servers/images at the same time. Perhaps more importantly, you can segregate work/personal keys and even start moving towards some more advanced solutions (such as managing all your keys centrally, and auditing who has access to a server).

I've uploaded all the relevant files into my bashfiles [repo](https://github.com/stevenkaras/bashfiles/tree/master/.ssh), so feel free to git clone and use!

---
title: Announcing Brigand
layout: post
---
I'm proud to announce the first public release of Brigand, the opportunistic bastard of Android communication libraries. Mobile apps consume data in ways that can easily chew through a battery. Brigand provides you with highly asynchronous HTTP requests, where you can get the response after hours or days, while allowing you to set a policy to determine when to send the request.

Brigand allows you to set a complex priority policy, contingent on factors such as charging state, battery levels, connectivity state, and radio power modes. For those of us who can't be bothered to set up complex policies, we include some canned defaults, but you can develop your own.

I'll be following up in a short while with more posts on the internals and how they save precious mobile power.

Get the sources [here](http://stevenkaras.github.io/brigand) here. License is MIT.
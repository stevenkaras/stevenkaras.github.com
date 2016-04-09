---
title: Horizontal and Vertical Logging
layout: post
---
At work, we have a large system with extensive logging requirements, and various reusable components (for example external services that we work with in two distinct modes). We've found, among other things, that we are passing in extra parameters to object solely for logging them. In other cases, we have noisy debug logs, but only need them for a new feature we're debugging, or an external service API that is failing in new and impressive ways. I'd like to discuss the concept of vertical logging, how we can monkey patch it into existing systems, and how logging systems could be better designed to support this.

# Horizontal logging

The traditionally preferred approach of logging is to set the logger name as the name of the class or module. This allows you to turn up the logging level for a specific component when you're debugging it, or reducing it when you feel that the component is stable enough. The problem is that it encourages passing loggers in and out of components, which makes it difficult to turn on logs for an unstable component. It also creates an incentive to not consolidate code due to concerns about log noise. Ultimately, though, this is the form of logging generally supported by most logging libraries today.

# Vertical logging

Some approaches to logging will use what I call vertical logging. In this approach, loggers are passed down on function call, or more often, on object creation. This is basically using the tools built for horizontal logging and applying them to change the behavior of the logger based on the current call stack. The problem with existing tools is that it often means interfering with the normal operation of horizontal logging (by passing loggers down, rather than using one related to the code itself).

# How to fix this

In order to build a vertical logging system that doesn't interfere with horizontal logging, we need the ability to override the logging level for a specific channel, and to add extra context for specific (or all) channels. More than that, we need for the override to only affect the current thread of execution.

On a practical level, this means storing a stack of overrides for each thread with such an override. For extra context, it means storing a stack of contexts, and collapsing them into a unified set of context when rendering the log messages (although this can be cached for efficiency).

# What I built

I built a solution for this in python, that handles all the nasty edge cases of threads stepping on each others feet. In order to do this, I also built a simple ThreadPool that allows me to test specific multithreading scenarios by advancing threads in lockstep (accomplished using function decorators).

It should be trivial to discover the extension points for your own logging library and build the equivalent.

# How to support this natively

I doubt that this functionality will become standard behavior of every logging system in the world, but we can discuss ways to make it easier to support logging extensions like this. In general, you should include 2 extension points:

1. For overriding whether or not to accept a log record (typically done early on to skip string processing costs)
2. For overriding rendering of a log record

It's useful to include the threadid in the log record, and the originating log channel.

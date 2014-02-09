---
title: Polling vs. Eventing
layout: post
---
Let's talk synchronization. There are two approaches here: polling and eventing. These basic approaches are suprisingly common throughout the world, but let's discuss just the applications within computing. Those applications can vary from handling video game input to handling network connections. I'm writing this because I've been asked several times in the past to explain this concept. Hopefully, this post will serve as a guide to others who are interested in fundamental computer science concepts and issues.

## The problem in a nutshell

The basic problem that both polling and eventing solve is setting up sequential interactions between two components. Press a button; a light turns on. That sort of thing.

## Polling

The polling approach is to ask every time whether the condition is true. I remember taking this approach with my parents on long car trips: "Are we there yet? Are we there yet? Are we there yet?". When we would arrive, they would stop the car, turn around, and say to us in the calmest voice: "Yes, we are there".

Similarly, there is a basic synchronization construct called a spinlock, which "spins" the CPU until a lock is released. It can be made more friendly to the rest of the system by putting in a very short delay (or a yield instruction), but in general it has performance, power, and ego issues.

However, polling can have an upside. If we expect the changes to happen much more often than we are concerned with them, or if we know we want to throttle the rate of polling, then polling is far more efficient than eventing, and easier to grasp, conceptually.

## Eventing

Eventing is an application of the Observer pattern. It basically says "wake me up when we get there". It's so efficient that it is the preferred approach to thread synchronization in almost every platform that exists.

Eventing shines when the time passed between events is orders of magnitude larger than the number of polls that would take place inside that time. The more infrequent changes are, the better it is than polling.

## A polling interface to an evented system

We can easily convert between polling and evented systems. Typically by storing a little bit of state: the last/currently observed state of the system.

In this, we register our interest in the events, and update the current system state. When polled, we simply return this value.

## An evented interface to a polling system

It may be useful to build an abstraction that allows using an evented system as a polling system. In this case, we need to keep track of the last observed state of the system, and a list of observers.

Our adapter constantly polls the underlying system. When it detects that the current value is different from the previously observed value, it fires off events and updates the last observed value.

## The ideal path

The best approach is to extend each of these adapters to provide both interfaces, where it behaves as a transparent interface for underlying systems that support it. In this way, we reduce the likelyhood of someone placing an adapter on an adapter on an adapter. We don't want a system of turtles all the way down.

> Are we there yet?
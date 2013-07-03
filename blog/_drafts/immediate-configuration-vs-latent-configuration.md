---
title: Immediate Configuration vs. Latent Configuration
layout: post
---
Yet another post in my series on software architecture and development philosophy.

One of the most common components in any decently sized software project is a configuration system. Basically, a group of options that can be turned on and off. There are several ways to architect these systems, and I'm going to analyze and discuss the advantages and disadvantages of these approaches.

Before we get started, let's define the goals and responsibilities of any good configuration system. The first way to look at it is as a key value store. You can store the actual values in files, or in an inmemory database, or use caching and synchronize it over a server. But the actual storage mechanism, while potentially interesting, is irrelevant. Another feature is that we want to make changes to this configuration (an immutable configuration may as well be constant literals in your code). Once changes are made, we want the program's behavior to change.

Assuming that we can create a good configuration system that allows for pluggable storage engines, it makes sense that we should give it an interface that allows for painless, efficient, atomic retrieval of values. For example, a binary value should be read out with both the data and the length, without any external synchronization needed. Each storage engine should ensure efficiency, which can be acheived through in-memory caching of values that are persisted elsewhere. It's important to remember that the "persisted" values may be changed externally, and as such, we should use efficient mechanisms for watching the persistence mechanism to be informed of any updated. But this is only valid for values that are cached for efficiency.

Notifying other components of the system that the configuration has changed can be done in several ways. One of which is to instruct them to "reload" their own cached values from the configuration. This approach seems like the simplest, but has us building listeners and a complex architecture just to handle these changes. If we take the approach to read values from the configuration immediately prior to using them, we can start moving towards a RCU style of synchronization model.

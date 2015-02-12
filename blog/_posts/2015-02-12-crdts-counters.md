---
title: "CRDTs: Counters"
tags: crdt
---
In this post, I'll discuss two theoretical CRDTs and walk through the implementation details of one of them. In this case, we'll be talking about counters. In general, there are two types of counters: those that grow monotonically, and those that can go both directions. Some counters, such as positive ones, are impossible to implement using CRDTs (the global condition cannot be verified locally).

# Grow only counter

A grow only counter tracks the amount added by each node. The idea being that because each node is only "allowed" to touch its own internal counter, you can use the MAX operation as the LUB of this CRDT. When you're implementing this, it means you'll need to track the node identity.

When you're implementing this, it's often easier to lazily initialize a node's counter to 0, so you can allow nodes to join the cluster in the future. Older nodes can be folded into a "base value" if they become obsolete, but this is an advanced concept that I'll only be touching on at the end of this series.

I didn't implement this, given the operational overhead of allowing subtraction is negligible (maybe a few hundred constant bytes)

# Positive Negative Counter (PNCounter)

This counter type uses two counters per node, allowing them to both add and subtract from their current counts. Note that you can't enforce a global constraint such as "this counter must be positive", because global constraints can't be verified locally. This is a common restriction of CRDTs and will cause us a few headaches down the road.

## Node identity

When implementing this, you'll need a way to track node identity. Personally, I use the thread id of the node when creating the counter, and then persist this as the "node identity". However, this is not a perfect solution, since thread IDs aren't globally unique, and two different devices may assign the same thread id by coincidence.

Mostly, how to assign a good node identity is out of the scope of this post, since it relies on cluster management.

## Garbage Collection

There isn't much garbage generated from counters, but if you expect nodes to both join and leave the cluster, there is the opportunity to remove unneeded counters and roll them into a "base value". However, this requires synchronization, and often user input on whether a node has left the cluster permanently, or not. Cluster membership is an interesting topic, and I'll write a followup to this series on the topic.

## Implementation notes

Effectively what we need to store is a set of pairs (the node identity and the counter value). Given that the most interesting operations are "update" and "get", we can keep a pointer to the current node's counter to make updates fast. When I implemented this in Ruby, I opted instead to use a Hash, since I wasn't aiming for memory efficiency at this stage.

We also keep a cached computed count, which we keep current on every operation.

### Counter list storage

At the moment, I'm using a Ruby Hash to store the counters. I would prefer to use a closed hash table for this, especially if combined with numeric node identities. Alternatively, for those who are skittish about using closed hash tables, you can keep the pair list sorted, which provides most of the same guarantees, but with a slight time-memory tradeoff.

### Capacity warnings

In Ruby, this isn't an issue since Ruby scales numeric variables to store any number (within reason), but if you're implementing this with 32-bit integers, you'll want to warn the user if they increment something past `INT_MAX / number of nodes`.

### Syntax

Immutable structures are popular at the moment. However, in the case of a CRDT, the cost of keeping multiple copies in memory rises very quickly, so I opted to use a stateful implementation. Of course, since ease of use is important, I opted to implement a mutating `+` operator, so it would allow the user to write code such as this:

{% highlight ruby %}
counter = PNCounter.new
counter += 4
{% endhighlight %}

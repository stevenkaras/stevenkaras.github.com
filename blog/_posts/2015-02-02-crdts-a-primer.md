---
title: "CRDTs: A Primer"
---
I had some extra time a few weekends ago, and sat down to start implementing CRDTs in Ruby. The idea being that I wanted to have practice implementing them. My plan is to eventually reimplement them for both Postgres as new column types and in C. I'll do a series of posts on different CRDTs, and the differences between the theoretical models and practical implementations. In this post, I'll be going over the general theory that backs CRDTs.

Convergent Replicated Data Types are various data type primitives that can be composed to build distributed systems. In terms of CAP theorem, these fall solidly on the AP side. However, they exhibit something called Strong Eventual Consistency, which means that at any given moment, there are no conflicts in the system and each node has a coherent view of the data stored. This is an important property, since it means that a device can be disconnected, allow changes, and when reconnected to the cluster, will synchronize seamlessly.

# LUB

The least upper bound is an important concept, since generally speaking, this is how conflicts are resolved when merging changes from one node to another. Mathematically speaking, this is the least value that is at least as large as the inputs. Once you've defined a LUB operation for your data type, it will exhibit strong eventual consistency so long as you don't violate some basic principles.

I'm not going to go into the proofs, or what those principles are, since this series will focus on implementation details.

# Op-based vs. State-based

Op based CRDTs track all the operations that have been applied, typically in tandem with a vector clock to help with garbage collection of old operations. They are more efficient in terms of communication overhead, but you have to store operations for a correct implementation. Because each operation needs to have a timestamp, the storage requirements can be significantly higher than for a state-based.

State based CRDTs are moved wholesale between nodes to merge changes. This works well for smaller types, such as counters, but the tradeoff between communication and storage efficiency becomes an issue for collection types, such as larger sets and graphs.

Basically, the implementation tradeoff is space efficiency vs. communication efficiency.

# Node tokens

One common pattern that we'll use is the concept of a node token. Rather than trying to rely on timestamps, which can be horribly off between different nodes, we'll use a counter that monotonically increases (we'll discuss failure tolerance and recovery in a future post). If we mark that counter with which node it came from, we can build a timeline of all the operations issued from that node. In practice, I've used the current thread id as the node identity, and a simple counter tacked together with a ':'.

Typically, we only use these tokens as unique values to identify operations or inserted values.

## Why not timestamps?

Some people will start talking about clock drift in data centers, and electrical frequency corrections, and other things like that. I'll go with a simpler example. Imagine your spouse is with a different cellular provider. Chances are if you pull out your phones one next to the other, they'll be off by more than a minute.

Data centers exhibit the same issue, but on a much smaller scale (a few milliseconds off).

# Garbage Collection

CRDTs can end up tracking a lot of useless information. Either as operations that were replicated to all nodes in the cluster, or tombstones that all nodes have seen. Unfortunately, you need external synchronization to garbage collect, or a more complicated approach. In the meantime, we'll glaze over this part, but I'll touch on one scheme that removes the conditions for full synchronization in a later post.

My next post will describe two theoretical counters, and walk through a Ruby implementation of one.

---
title: "CRDTs: Sets"
tags: crdt
---
Sorry for the delay with this post. I've been busy with work and planning my wedding. Let's discuss CRDTs that behave like Sets. First and foremost, there are several theoretical types that are distinct, but when implementing them, it is trivial to convert from one to the other, to the point that they're effectively natural optimizations that an experienced developer would implement.

# Grow only Set

Grow only sets contain unique members, which are added, potentially multiple times. The idea being that the LUB is the union of the sets. I didn't bother implementing this, since it's trivial, and there are more interesting things to do.

# Add Remove Set (2P-Set)

The next type we'll talk about is an Add Remove Set. The idea here is that you track two grow only sets, one for elements that have been added to the set, and one for elements that have been removed. The problem being that once you've removed an element, there's no way to add it back in. Most developers implementing this would state the need to add an extra "tag" value that would track unique additions/removals.

# Observe Remove Set

In an OR set, the trick is that we're now keeping "tombstones" to track what elements have been removed from the set. The theory is that you track unique additions of elements, and when removing, you mark all the adds as being "removed". This elegance is what I believe to be the optimal solution for Set-like CRDTs. Notably, the behavior fits with what non-technical people would expect to happen (so long as some basic local constraints are followed)

## Local Constraints

Just to be clear, I don't advocate enforcing this with code. It adds unnecessary complexity and makes the code less readable. It's better to enforce it with the UI of your application. In this case, there is only one local constraint that you should enforce: Don't allow the user to add elements that are already in the set.

## Token Issuance

As we need unique tokens, I've found it useful to issue tokens that are a combination of a unique node identifier and a monotonically increasing per-node counter. Tokens issued in this manner are useful for both garbage collection while maintaining the unique constraint trivially.

## Implementation Details

There are three basic ways to implement this, with varying benefits: tracking separate hashes for observed/removed tokens, combining them into an "element" structure, or tracking a Token -> Boolean hash. In the first two, I've found it is much simpler to write code that moves tokens between the observed/removed piles rather than keeping them in both (which is advocated by a naive implementation of the mathematical construct). The resulting code is easier to understand, and more space efficient (not to mention being easier to garbage collect)

### Separate Hashes

In this approach, you'd keep two separate hashes, one to track an array of observed tokens for each element, and one for removed tokens. I abandoned this approach after I noticed that it involved a lot of extra bookkeeping code, lacked clarity, and has horrible locality.

### Element structure

In this approach, we track each element as a structure that contains the observed and removed tokens. In Ruby, this won't make much difference for locality, but it does make the code much more understandable.

### Boolean Hash

This approach is probably ideal in terms of simplicity, but requires tracking a cached "present" value, which is the and/or of all the token values. Also, it requires marginally more storage than the other approaches. However, it can seem more elegant at times, and may be more efficient if copying tokens is an expensive operation.

### Garbage Collection

As we pile up more and more operations adding and removing elements from the set, we build up garbage in the form of tokens that have been replicated as removed in all the nodes of the cluster. One potential solution would be to keep a counter for each node, which can request the removal of all removed tokens originating from that node before that counter.

Garbage collection assumes that if an element is already present in the set, the user won't add it again (meaning there is at most one observed token for a given element from the same node at any given moment). This assumption of sanity is useful, but can be enforced using local conditions, if necessary.

## Next steps

I implemented this with state-based replication. However, in order to support undo/redo operations at the UX level, it makes sense to implement this with a message queue. If you're going to do that, you should keep in mind that nodes aren't necessarily fully connected, meaning that you should replicate messages even if they didn't originate from the given node. A simple example of why that's necessary is when you have a work computer behind a corporate firewall, a mobile phone/tablet, and a home computer with a horrible ISP that doesn't allow incoming connections.

Another thing I'd like to do but didn't have time is to impose a stable ordering condition on the enumeration function. Basically, that means that for any set that has the same elements (added/removed at the same time), it will return them in the same order. This is useful for export functionality, and can reduce user confusion when displaying elements as part of a UI.

# PN Set

This is a specialized set type where each item gets a counter associated with it. When an element is added, the counter is incremented, and when it is removed, it is decremented. There are a number of problems with this, not the least of which is that concurrent removals can result in the counter becoming negative, where subsequent adds can seem to have no effect. There are ways to handle this, namely by clamping the counter to specific values (either 1 or 0).

However, once you clamp both values to resolve concurrent adds and removes, you are left with a poorly implemented OR set with anomolous behavior because you need to choose whether concurrent adds or removes win. As such, I dropped my implementation efforts on this in favor of other types that have more useful applications.

# Closing notes

Between counters and sets, we can build most useful applications. It's amazing how the overwhelming majority of applications use Arrays even though they don't need the strong ordering they provide, and could be modified quite easily to use Sets instead. In any case, after we've covered Graphs, I'll introduce total order CRDTs that make collaborative editing applications possible (which are the interesting ones anyways)
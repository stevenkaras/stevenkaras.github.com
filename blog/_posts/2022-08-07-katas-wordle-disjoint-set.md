---
layout: post
title: "Kata: Wordle disjoint set"
tags: [katas]
---
I ran across a few youtube videos describing a math/programming challenge: finding sets of 5 wordle words that have all unique letters.
[Matt Parker][yt-mp], [Fred Overflow][yt-fo1] and [Fred's followup][yt-fo2] show different ways of solving this challenge.
Matt's solution took a month to run, and I immediately saw a way to improve the performance with some set theory.
My first attempt took 2 days, but I was able to cut it down to running in about an hour with a little more effort.

[yt-mp]: https://www.youtube.com/watch?v=_-AfhLQfb6w
[yt-fo1]: https://www.youtube.com/watch?v=947Ewgue4DM
[yt-fo2]: https://www.youtube.com/watch?v=bSSEwbfq2Ig

While my solution takes a lot longer than 3 seconds or even 30 seconds, I think it's a great way to show off how power basic set operations are for making things efficient.
My solution has no external dependencies, is easy to read through, and can work on any input wordlist (FYI - the default mac wordlist does not contain any valid solutions).
The fundamental approach is to consider the graph induced by shared letters.
This means that we construct a graph where each vertex represents a word, and an edge exists between words if they share any letters.
The challenge is to find a disjoint set with 5 vertices in this graph.
This is equivalent to finding a clique (a subgraph where each vertex is connected to every other vertex in that subgraph) in the complement graph (which flips the existence of edges).

By using this modified representation of the challenge, my code takes an hour to run instead of the full month.
The best part is that the code is straightforward and shows each step and can be extended to solve many related problems very easily.

[Gist here][gh-gist]

[gh-gist]: https://gist.github.com/stevenkaras/dda8167dfd525ed2893121eb1f96a8d9

# Why katas?

Katas are small practice exercises that focus on one particular movement or skill.
I try to do at least one a week in different focus areas, unless I'm working on improving one specific skill in which case I try to do one a day.

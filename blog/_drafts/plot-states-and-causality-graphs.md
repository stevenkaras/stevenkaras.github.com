---
title: Plot States and Causality Graphs
layout: post
---
Since being unemployed gives me a fair amount of free time, I've had the chance to really sink some thought into all sorts of things. Recently, I've been replaying Fallout 3 (great as an RPG, crappy as an FPS). The complexity of the dialogue system has led me to start thinking about ways to visualize the plot of the entire game, and I've come up with a few ideas.

So I've been thinking of ways to model plot states, and what I've come up with is that each plot state holds an arbitrary value. A plot state's value is changed when a series of conditions are met, and the new value is written. These conditions are typically boolean comparisons, however they may be more complex. What I'm thinking of is how to effectively visualize a large set of plot states, their effective values, and to intuitively represent them in a manner that promotes introspection as to how one state affects others. As such, we'll assume that each plot state has a limited, finite set of values.

First off, we'll build our visualization on top of the accepted nomenclature and notation for directed graphs. Each plot state is a group of nodes where each node represents a value for that plot state. Every value node has at most one incoming edge, but may have many outgoing edges. There is no theoretical restriction on cyclicality, however it may be convenient to define the graph as such for analysis.

In addition to plot state value nodes, we'll introduce two new types of node. Both of these types may have many incoming edges, but at most one outgoing edge. The first is an AND node denoted as a filled circle, significantly smaller than a value node. The second is an OR node denoted as a hollow circle, the same size as the AND node.

To determine whether or not a plot state can receive a particular value, we run the following algorithm test(marked, node)

1. given a set of marked value nodes, and a node (we'll call it the test node)

2. from the test node, resolve recursively:

  a. if the test node is a value node:

    i. if the test node has no incoming edges, return true

    ii. if the test node has an incoming edge from the previous node, call test(marked, previous)

  b. if the test node is an AND node:

    i. call test(marked, previous) for every incoming edge from a previous node

    ii. if any of these return false, return false

    iii. if all of them return true, return true

  c. if the test node is an OR node:

    i. call test(marked, previous) for every incoming edge from a previous node.

    ii. if any of these return true, return true

    iii. if all of them return false, return false

By creating tools to effectively display these state values, gamers will be able to investigate the repercussions of their actions, and designers will be empowered with tools to allow them to track complex plot states, and suggest where new relationships can be formed, improving gameplay and increasing replay value by visually identifying linear plot choices.

Useful features to have in such a tool would be the ability to export the condition for a value node being available to various language syntaxes, for quick code generation. The ability to export the entire graph at once to DOT format for rendering as a graph is arguably important for those people who want to have a high-level overview of the entire plot. Being able to quickly filter out all unrelated nodes, both contingent and dependent upon a given node is useful for designer and plot managers to see how the plot develops around a particular event or choice. The ability to filter for multiple such nodes is essential.

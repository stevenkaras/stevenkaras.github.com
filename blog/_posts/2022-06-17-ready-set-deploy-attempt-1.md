---
layout: post
title: "Ready set deploy attempt #1: failed"
tags: [ready-set-deploy]
---
I wanted to document my attempts at building a better mousetrap for configuration management (or server deployment - six or one half dozen).
The problem that I'm trying to solve can be summed up in one sentence: "Maintaining IaC deployment definitions is tedious and easy to miss small details - better tooling should make this easier to set up and do one-off migrations".
This is a record of my first attempt, and a short analysis of why it failed.

# The design

* Configuration is managed as state and has a few fundamental operations: gather, diff, apply
    * A apply (B diff A) should produce B
    * B diff (A apply B) should produce A
    * A diff A should be empty
    * B diff A is the inverse of A diff B
    * A apply B is equivalent to B apply A
* State is either desired or undesired (to support removal of something)
* State is either partial or full (as a natural result of wanting state to be a group)
* State has before and after anchors to support partial states in ordered listings (e.g. iptables rules, lines in a file, etc.)

# The implementation

I started from the theoretical model, but added another flag to represent "transient" states that should never be serialized out of a running process.
The last was to support temporary state during a diff process.
The generic package manager driver was easy to write, but I never bothered to test it.
The file driver was where things went wrong: I realized that apply wasn't well defined, and combining two dependent states was even worse (for example, taking the diff of `$HOME/.config` from some desired state which defines only some files inside).

# What went wrong?

The file driver fell on its face because it was overly ambitious and tried to solve a complex problem by paying attention to space complexity, rather than coming up with something that works first.
The overall design also failed because the operations weren't well defined and there are some blind spots (combining two full states -> does this produce the intersection of their values, or their union? - what about ordered state?).

## Fixes

1. Redefine state to have three fundamental types: Full, desired, and undesired (no flags!).
2. This simplifies the operations and allows us to declare when they should succeed, when they should fail, and a few others.
3. Focus on the end-usage first, and then see how the plumbing needs to be designed to fit that use.

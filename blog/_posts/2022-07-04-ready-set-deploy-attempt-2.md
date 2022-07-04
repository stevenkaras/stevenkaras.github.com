---
layout: post
title: "Ready set deploy attempt #2: partially failed"
tags: [ready-set-deploy]
---
I wanted to document my attempts at building a better mousetrap for configuration management (or server deployment - six or one half dozen).
The problem that I'm trying to solve can be summed up in one sentence: "Maintaining IaC deployment definitions is tedious and easy to miss small details - better tooling should make this easier to set up and do one-off migrations".
This is a record of my second attempt, and a short analysis of why it failed, and what parts can be carried forwards.

# The design

* Configuration is represented as a platonic ideal and not mutated in place
* Configuration state has three types: full, partially desired, and partially undesired.
* Configuration state has a name and a qualifier - all operations are only valid for states with the same name and qualifier
    * state names are mapped to implementing code (separating the data representation from the code)
* Configuration state has a few fundamental operations[^1]:
    * `gather PROVIDER` produces `[FULL]`
    * `FULL diff FULL` produces `(DESIRED, UNDESIRED)`
    * `FULL combine DESIRED` produces `FULL`
    * `FULL combine UNDESIRED` produces `FULL`
    * `commands [DESIRED | UNDESIRED]` produces a list of commands to execute
* Configuration state is independent of any other provider/qualifier pairs

[^1]: `T` is a type; `[T]` is a list of T; `(T,U)` is a tuple of `T` and `U`; `T|U` is either `T` or `U`

The design suffered from a few deficiencies at first, and there were a few casualties along the way:

* `gather ALL` was supposed to gather all the defined states from the current system - dropped because not all systems are equal and which files to "slurp" isn't easy to define

# The implementation

I started from the desired usage:

```bash
bash -x <(rsd diff <(rsd providers role_state.json | rsd gather-all) role_state.json | rsd commands -)
````

This basically saying: gather all the providers/qualifiers defined in this role definition, diff against the role, and turn into commands to execute (basically applying a role to the current system).
I started from the obvious primitives: gather and diff - for homebrew packages (deciding that files can wait for later).
This went smoothly and helped fix many of the deficiencies from the previous attempt.
I got it to the point where the primitives (gather, diff, combine, commands) worked for homebrew packages and tested using my two laptops as a baseline.
Apparently I have many packages that are marked as "requested" on one system that aren't on the other, and a bunch of cruft I never cleared out - this helped expose that.

The next step was to implement a file content provider.
I didn't think too much about what I was doing, which is where things started to go wrong.

# What went wrong?

The file content provider failed because it wasn't well defined - I decided to drill it down further and further until there wasn't anything left: only the contents of text files.
The problem is that it isn't very useful as a provider: files are more complicated than simply their contents: permissions, ownership, extended attributes, sparse files, alternate streams, symlinks, hardlinks, directories, named pipes, etc.
But this opened a can of worms: what level of support do I demand from the "platonic ideal"?
What if a role defines something a system doesn't support (e.g. apt packages on a mac host, alternate data streams on an ext4 filesystem)?

This pushed me into a crisis of philosophy - am I working with a platonic ideal that defines as little as possible?
I can't define each capability as a separate provider because provider/qualifiers shouldn't interact.
But leaving it all in one provider creates a hellish provider that needs to track all of these things, and runs the risk of gathering information that can't easily be mapped (e.g. extended attributes between mac/linux systems).

## What next?

1. Contemplate the philosophy of configuration state - should I focus on scoped platonic ideals and fail when they conflict? Are package lists fundamentally compatible (beyond a simple mapping of package names)? It captures the intent of a role better, but how to convert a gathered state into a role?
2. Explore a few solutions for the file question - multiple providers, monolithic-providers, etc.

# What worked?

The usage-first approach.
The formal definitions for fundamental operations.
The CLI framework and a lot of the code around the actual providers (with room for improvement).
The shared logic approach worked well, but could probably be done even better - package managers fall into three categories, ordered providers have similar logic, etc.

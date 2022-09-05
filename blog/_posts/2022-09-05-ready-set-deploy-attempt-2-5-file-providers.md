---
layout: post
title: "Ready set deploy attempt #2.5: A better file provider"
tags: [ready-set-deploy]
---
I wanted to document my attempts at building a better mousetrap for configuration management (or server deployment - six or one half dozen).
The problem that I'm trying to solve can be summed up in one sentence: "Maintaining IaC deployment definitions is tedious and easy to miss small details - better tooling should make this easier to set up and do one-off migrations".
This is an interlude between attempt #2 and my next attempt, wherein I'll compare the various options for implementing a file provider.

# The problem

Files are simple, right?
In many ways, they are: there's some binary data stored somewhere that you can `read`, `write` and `seek`.
But in many important ways, they have much more than that: permissions, ownership, extended attributes, sparse files, alternate data streams, etc.
I want to explore a few of the different options I have for implementing a file provider/s in this post.

# Options for implementing different file features:

## Option 1: Separate providers for each feature

This option would have a FileContentsProvider, a FilePermissionsProvider, etc.

Each feature is largely orthogonal, so there shouldn't be a problem that one provider will trample the others work when applying changes.
However, this does mean potentially splitting up information among different subsystem states, which makes debugging more difficult and adds to operational complexity.

### Why it's not viable

Directory state tramples file contents state - if a directory is undesired, it needs to remove the file contents.
This violates a basic principle of the model where one state type does not impact another state type - I'm not sure it's worth violating for this case.
If I were to go down this rabbit hole, then the operations would need to get the entire system state and the default implementation would narrow that to the matching subsystem state (for each provider).
This would strongly couple the providers together in a way that they may as well be a single class with different entry points for each "provider".

## Option 2: A monolithic "god" provider

This option would have a single FileProvider that handles everything from the contents to ensuring the correct permissions are set on the directory.

This hits a hard limitation because not all filesystems are equal and some support features that others don't.
It makes sense to fail if the state was generated, but just because a mac file has the "com.apple.quarantine" extended attribute doesn't necessarily mean we want it to fail when moving something over to a Linux machine.

## Option 2.5: A monolithic provider with feature flags

This option would modify the monolithic provider to leave some properties of a file/directory as optional.
That would mean parsing options from the qualifier which will require extensive documentation.
This also complicates the logic for combining or taking a diff if one side omits properties.

## Option 3: A combined contents + permissions + ownership provider

Similar to a monolithic approach, but rather than using all properties, it would define a basic set of required properties and not be defined beyond that:

1. name
2. ownership
3. permissions
4. contents

This strikes a nice balance between splitting things out between multiple providers and trying to fully represent all the properties at once.
By limiting it to properties defined by POSIX, it maximizes the portability of defined state.

# Options for organizing the state by qualifier

## Option A: singleton state

This approach has a single state for all filesystem state.
This sidesteps any issues with how RSD's shared logic interacts with the unique challenges of filesystem state, but it also doesn't reuse it making the diff/combine logic far more complicated.

## Option B: state per file/directory

This would create a separate state for each file/directory.
This leverages the shared RSD logic for diff/combine operations, but sometimes there are interactions which would need to be caught by extra validation logic.
For example, if we define that `/etc/foobar` doesn't exist, then the contents of `/etc/foobar/config` are irrelevant and can be dropped from resulting state.
This again requires that diff/combine get the entire system state (or at least all subsystem states for the same provider) with default logic that finds matching ones.

# Obvious things that need saying

There's for sure a place for someone to come along and implement a provider that takes a different approach than what I've laid out here or whatever I'll actually include in RSD.
Hell, I might even decide to include multiple providers so the choice is left to the end user.

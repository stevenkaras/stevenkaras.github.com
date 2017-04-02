---
title: Two way git mirroring
---
At work, we have a server with bad/dying hardware. It happens to be our primary origin for our git repos as well, which become corrupted once a week or two now. We've set up a new server running Gitlab that we want to migrate over to, but we can't tolerate any service disruptions. Partly because we have a lot of servers that are potentially used to push changes, and we don't want to forget about an old EC2 instance. But mostly because some people will read the email saying "don't push to the old server, your data WILL be lost" a week after you've sent it.

Our workflow is a centralized workflow, with everyone pushing to a central repository. This is the easiest workflow for a team/company our size.

# Rejected solutions

## Forward all SSH traffic

One way to do the migration would be to add an iptables rule that forwards all SSH traffic. However, this has two drawbacks:

1. It requires action on the part of each existing user (because the host key will change). It also looks suspiciously as if the old server has been hacked.
2. You can't access the old server via SSH on the same port.

In our case, the old server provides a handful of other services, so this isn't really an option.

## NFS/SMB mount the new server

Network file systems generally work ok, but can have some horrendous failure modes, and we need to provide the strongest guarantees possible.

## Drop in some proxying commands for git

This is a real option that I considered, and I may use it in the future, especially for the simple migration case. The idea is to wrap git so it will check if the current repo has been moved and potentially redirects everything to an ssh tunnel.

But I like a challenge, and multiprimary git is an interesting problem to crack.

# The migration process:

* The old server is the only one used
* The new server is used as a read only copy (mirroring automatically from the old server)
* Both the old and new servers can be used to write new data
* The old server is used as a read only copy (mirroring automatically from the new server)
* The new server is the only one used

# Read-only mirroring

This is actually easy with git. First, set up access from your primary to the secondaries. Then add a post-receive hook that runs `git push --mirror mirrors`. If you are willing to allow a short delay for changes to propagate, you can even queue it to be executed later with `at`.

# Multi-primary mirroring

This is difficult to get right because you want your two (or more) primaries to appear as if they are the same thing. This means locking, to prevent concurrent pushes causing conflicts. It also means retries, and leasing locks to deal with a failed server or dead pushes. In our case, we're lucky in that the new server is located right next to the old server, so the chances of only one going down is negligible.

## Advisory locking

When you can't use a proper locking structure in the code that is executing, you can use external locking services called "advisory" locks that effectively provide the same semantics.

## Avoiding infinite loops

A pushes to B pushes to A pushes to B.....

There are a few ways to approach this. Either you can push until convergence (requires pushing the desired end state through a side channel), or ensure that you only push once (from the first origin)...

### Pushing only once

The easiest way to do this is to use push options. The only catch is that Gitlab filters them out somehow with their hooks/embedded version of git, so it's a non-starter if you're using their platform. I expect other systems such as Gogs/Gitea, etc will have similar issues, not in the least because push options were only added recently to git.

### Pushing until convergence

In this approach, you'd record the desired commit of each ref being pushed, and refuse a push that is not for those... A more advanced approach would lock each branch being updated individually, and allow simultaneous pushing to non-related refs.

Sadly, I haven't had time to implement this yet, and probably won't get around to it anytime in the near future.

# Deprecating the old server

This is done in several phases. First, a visible warning is given when someone pushes to the server, and once you've migrated over the majority of your systems, then you simply refuse accepting pushes to the old server.

Once you've guaranteed that nothing has been broken, you can remove the repo (by renaming) to find any read-only copies that are pulling automatically from the old server.

# Other reasons you'd want this

I work in Israel. Some of our servers are located in the US, others in the EU, and we have a few locally. Ideally, we want to reduce the amount of data we move between regions. This means read-only mirroring between regions. If you had multiple teams working around the world, you might want to reduce the latency of pushes by using these scripts, although you'd need to invest some more time in setting up proper locking.

# What happened in the end

Despite my desire to solve the problem "correctly" and do a completely seamless migration, building an interesting piece of technology along the way, we decided that our company is small enough that we can get away with just telling everyone to switch all at once. Let that be a lesson that sometimes it's easier to break things than to spend too much time trying to do it perfectly.

The [hooks][multiprimary-hooks] work, although they haven't been tested thoroughly.

[multiprimary-hooks]: https://github.com/stevenkaras/bashfiles/tree/master/githooks

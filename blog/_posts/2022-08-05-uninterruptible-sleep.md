---
layout: post
title: "Uninterruptible sleep"
---
Many years ago, I discovered one of the warts of NFS: uninterruptible sleep.
Some research later and I found that adding some mount flags made the problem never happen in the first place.
Around 2019 I ran into a similar problem so I decided to investigate and document what I learned for posterity.

A process is shown as being in uninterruptible sleep `(D)` when it makes a system call that is marked as "uninterruptible".
This usually happens for very short times around physical IO, but some syscalls such as `vfork(3)` will also be uninterruptible until they return.
The practical impact of this is that this process can't be killed even by `SIGKILL`.
This happens often when working with networked filesystems though as some common IO syscalls are uninterruptible and even if the syscall is interruptible they will still move into that state for some time while working.
In this specific case, the root cause was `mlocate.updatedb` getting stuck trying to index files on a s3fs FUSE mount.

# Things that won't kill the process:

* `sudo kill -9 PID`

This will report success (it delivered the signal to the kernel), but the process will not be killed.
Someone [asked why this doesn't work on the Unix/Linux Stack Exchange][so-kill9-doesnt-work], but the answers don't go into details.

* `sudo gdb -p PID`

This will hang and get stuck (not in `(D)`, but also not killable).
The reason is `ptrace` doesn't return `EINTR`, but also isn't put into D state.
Because it's waiting for the target process to become runnable, you're left with an extra unkillable process.

# Things I didn't try:

While researching this, I found [stack overflow explanations][so-uninterruptible] that describe the problem at a high level without providing concrete steps on how to resolve this (short of pulling the power cord).
[LWN's article][lwn-task-killable] linked from the SO post went into more depth of how drivers can use `TASK_KILLABLE` to allow fatal signals to kill a process that would otherwise be stuck in uninterruptible sleep.
[Tanel Põder][tanelpoder-uninterruptible] wrote an in depth treatment of diagnosing stuck processes which is worth a read if you're interested in how the kernel exposes process status information to userspace.


* `echo 3 > /proc/sys/vm/drop_caches; sync`
* `udevadm settle`
* `strace -p PID`

# Things that do work:

* Pulling the power cord
* Soft reboot of the system
* Killing the s3fs usermode agent (in this specific case)

# Why this is important

Ubuntu installs mlocate by default, and sets it up to index all attached filesystems every day.
If you install s3fs or a similar FUSE filesystem, it will happily try to read every single filename for indexing.
If something happens to your network during that time, it's likely that it will get stuck in uninterruptible sleep and never come back.

This means that it will try to read filenames for every single file mounted on your system.
Good news is that it knows to skip over sshfs, smb, and nfs mounts via the `PRUNEFS` configuration, which comes set on Ubuntu 16.04 with many different networked filesystems.
The bad news is that it matches on the whole filesystem type, not just a prefix or a pattern of any sort which means you can't ban all FUSE filesystems.

# Root cause

The root cause in this specific case was the s3fs agent getting stuck.
We still don't have a clear picture of exactly how or why this happened, but it was a regular occurrence before I disabled mlocate.

# Mitigations

* some people mentioned the `intr` mount option. From the FUSE manpage:
> Allow requests to be interrupted.  Turning on this option may result in unexpected behavior, if the filesystem does not support request interruption.

So that seems like an endorsement of this not being a viable mitigation.

* Convince mlocate to support more complex patterns for the `PRUNEFS` blacklist

[so-uninterruptible]: https://stackoverflow.com/questions/223644/what-is-an-uninterruptible-process
[lwn-task-killable]: https://lwn.net/Articles/288056/
[tanelpoder-uninterruptible]: https://blog.tanelpoder.com/2013/02/21/peeking-into-linux-kernel-land-using-proc-filesystem-for-quickndirty-troubleshooting/
[so-kill9-doesnt-work]: https://unix.stackexchange.com/questions/5642/what-if-kill-9-does-not-work

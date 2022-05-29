---
layout: post
title: Monitoring cp progress
tags: []
---
`cp` copies files from one place to another and does not output any progress information by design.
About a week ago I copied a 4GB file and wanted to check after a few minutes how far along it was.
Usually I would just check how large the target file is, but I had a minute to explore other options and found a better way.

tl;dr:

```bash
pgrep -n -l cp
watch cat /proc/PID/io
````

`procfs` provides the `/proc` filesystem present on almost all Linux systems (this particular feature was added in v2.6.20 released on 2007-02-04).
The `/proc/PID/io` file includes the `rchar` and `wchar` fields which show the total I/O of a process and show the progress far better and quicker than checking the filesystem for how big the destination file is (due to effects of write journaling, etc).
Given how easy this is I was surprised this isn't the recommended method of checking the progress of `cp`, so I decided to write this post up to explain how to do it.

Sources:

* [Linux kernel documentation for procfs][kernel-org-procfs]
* [LKML patch adding documentation in 2007][lkml-docs-patch]
* [Git commit adding actual support in Dec 2006][github-linux-procfs-io]

[kernel-org-procfs]: https://kernel.org/doc/Documentation/filesystems/proc.txt
[lkml-docs-patch]: https://lkml.org/lkml/2007/3/3/131
[github-linux-procfs-io]: https://github.com/torvalds/linux/commit/aba76fdb8a5fefba73d3490563bf7c4da37b1a34

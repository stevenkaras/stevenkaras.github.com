---
title: ETL for Humans
layout: post
---
I've done a lot of work in the past around ETL jobs, and helping data scientists/less technically oriented people set up workflows, and improve performance. My biggest win was taking a job that was supposed to run daily, and optimize it to run within 10 minutes. The biggest win we got here was simply by splitting up the various steps of the job and running some of them in parallel. The next biggest was by identifying parts of the job we could precompute and update incrementally. But something that has struck me is how many systems I've seen that have "hidden" interdependencies, for example Zapier's workflows, where if twitter doesn't post your tweet for some reason, it may not get posted to Facebook either. I'd like to take a few minutes to discuss how I think the ETL space can be improved. I doubt I'll get to any of this soon, but it's on my (very) long list of things to do eventually.

# Intuitive parallelization

Barring multi-step SQL queries that build intermediate tables, most ETL (and even more general workflow) operations can be run in parallel. There's no reason not to expose this complexity to the user. In fact, I think most will find it liberating. Handling synchronization between parallel tasks is an exercise given to CS students, so there's very little excuse for this to already be handled automatically by our software. A simple UI could allow dependencies to be drawn between steps, showing how we can run multiple operations in parallel.

# Manual checkpoints

Something we've discussed on my side-project Feedio is allowing users to manually review things before they happen. A decent way to handle this could turn a normally painful experience into a semi-magical one, giving peace of mind to luddite users, and instant feedback for workflows under development.

It also means that a workflow entirely comprised of manual checkpoints can be automated once it's in this system.

# Scalable execution

Processing jobs like this are embarrassingly parallelizeable, and any decent framework should have a scheduler that can stream records between worker nodes based on the relative cost/benefit of the communication overhead versus the estimated cost of concurrent processing. Perhaps the most important part is that it should do this strictly transparently, given that most people don't want to ever deal with concurrency/scaling issues (or are even aware of such things).

# Why it won't happen anytime soon

* The form factor isn't immediately obvious. I think there's a place for this system to exist as a native standalone app, but at the same time it could exist as a distributed system.
* Graph drawing UX widgets aren't well done yet. There are some neat attempts at this for web, but they're still in their infancy.
* Doing distributed systems is really fucking hard. Doing distributed systems that interface with outside components is an exercise in futility.
* Scaling a system from something that runs in the background of a smartphone through a desktop service and up to multiple dedicated servers is hard. It's just too many platforms to test for (not to mention all the small edge cases of devices dropping in and out).
* The established players won't be looking in this direction, and the approach is too high-risk for new startups.

# Why it will happen sooner than you think

* Zapier is moving in this direction. They're business model is prohibitively expensive to be useful, so it'll be used more for glue, rather than realizing its full potential.
* Amazon is on the cusp of discovering how useful this is, although knowing them, they'll miss the mark by a wide margin and it will never see mainstream use because they will make it with too many knobs, and none of the ones most people want/need.
* Every single company in the world has workflow problems. Often, they buy custom solutions that solve one workflow problem, without any generality. The market is huge, and the first venture to use maximum effort will win huge support.

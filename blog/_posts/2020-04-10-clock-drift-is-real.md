---
title: "Clock drift is real"
layout: post
tags: [story]
---
Clock drift is when the clock of a computer drifts away from what the rest of the world considers to be correct.
Some people think this is something that won't happen to them, or that it won't be serious when it does, or that it isn't a big deal when it does.
Let me tell you loud and clear: clock drift is real, it will affect you, it will hurt, and it is serious.

# Classic clock drift

<!-- This story actually happened back in 2016, so I don't remember 100% of the details -->

One day, we had a job that kept failing randomly.
No one had touched the job in months, the server hadn't been touched to the point where we only had two employees who even remembered it existed.
So I ssh'd into the server, and ran the job manually.
It succeeded, and I went on my merry way.
The next day, the job failed again with the same error.
The way this job worked, a local server would instrument several servers, including this one, to index collected data.
So I connected to the local server and tried to ssh into the remote worker.
It failed and reported that the clock on the remote worker had drifted by several hours.

My laptop was still able to connect because the local server had also drifted, but in the other direction.
Within a week we had a job that verified the clocks between all our servers were within 5 minutes of each other.

# Milliseconds matter

More recently, we moved some parts of our systems to run on another server to spread the load.
The next day, we got called in by our boss to explain why we saw a 15ms latency regression for tasks that should always finish within 10ms.
After investigating for a while, we came up with no reasonable explanation and were planning on turning on detailed timing logs to consider external effects.
Thankfully, before we did that we double checked the latency report again, and saw that the minimum time (tucked away on the left side, nowhere near the 95%ile we were looking at) was showing -15ms.

The obvious cause was that despite being synced to NTP, the servers were out of sync with each other.
We ended up setting up chrony to sync against the main NTP pool for one server per cluster, and the rest to use that as the main source of truth.
After tuning the configuration for 2 hours, we were able to get the site leader synced to within 1ms in most cases, and to within 10us inside each cluster.
It still took us two days to learn how to analyze the logs and verify how well our servers are synced.

# Be careful which clock you use

Working in algotrading, it's really important to track how long it takes you to place orders.
But you need to be careful when comparing clocks, and make the distinction between your clock and an external clock.
We once had an incident where we were using our local clock for prices we received from a particular exchange.
Under normal conditions, this was sufficiently close to the remote clock that it didn't matter.
However, once our system was under extreme load it would buffer messages from the exchange, and attach the local clock when handling the message afterwards.
We saw this as messages showing up minutes late despite the timestamps in the messages showing we had received them far later than they claimed.
The root cause of the load was a new job that would run heavy database queries for minutes at a time, effectively stalling price reading for this exchange.

While investigating the issue, we started plotting the offset between the local and remote clocks when we received messages.
The minimum offset would be fairly steady, but sometimes it would have a little slope over an hour or two, which is the effect of both ends having their clocks slewed by ntpd/chrony.
I got permission to share a redacted screenshot of this plot over a few hours because it shows the effect of clock drift really well:

[![]({{ site.url }}/blog/assets/delays_clockslewing_20190824.png)]({{ site.url }}/blog/assets/delays_clockslewing_20190824.png)

# Lessons learned

Clock drift isn't some academic exercise. It's happens all the time, it can and will affect you, and it can make you lose money.
Good news is that deploying NTP is easy, and most applications only need very rough accuracy.

# Kudos

Kudos to PZ Kaplan who encouraged me to write up a few clock skew stories and publish a blog post again.

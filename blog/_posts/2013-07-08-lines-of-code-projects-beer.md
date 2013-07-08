---
title: Lines of Code, Projects, and Beer
layout: post
---
You can read all over the internet about how lines of code are a horrible measure of worth. Unfortunately, like any metric that is well defined, but is used to describe an abstract quality, it is always possible to game the system and artificially inflate anything. All I'm proposing is rather than look at lines of code as the end all be all of code metrics, we use them instead to describe the overall complexity of a project.

It's trivial to see that a project that has 100 lines is far simpler than a project with 1000 lines. They may do something very similar, and the 900 lines in the larger project add a small feature that very few people use. But if you talk about the cost of bringing on a new programmer, and trying to estimate the amount of time it will take them to acclimate themselves to the project, then lines of code (with a few other metrics) can be applied to get a pretty good estimate.

So what I'm proposing is a set of metrics. BLOC is the binary logarithm of the lines of code, DFR is documented function ratio, which is the percentage of documented functions out of all functions in the project (not counting unit tests). Finally, there's a subjective score (on a 1-100 scale) of how useful the developer documentation is.

Of course, these metrics are great for project managers and upper management to quantify software projects, however it doesn't say much for developers, or open source projects. So there's a much simpler measure:

How many beers does it take to explain this project? Simple enough, and easy to estimate for any experienced developer. Completely subjective, but you can measure it empirically.

If I ever get around to it, I'll sit down and work out the various scores my github projects have, and post them here.

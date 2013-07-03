---
title: Continuous Development
layout: post
---

Extreme programming has generally been regarded as a Good Thing, with many successful companies crediting their ability to deliver projects on time and with superior quality to following the practices outlined by [Extreme Programming](http://en.wikipedia.org/wiki/Extreme_programming).

One of the sadly underdeveloped practices is having a continuous process. The concept that I can have a repeatable build that is constantly being tested and examined is a boon to developers, as it can highlight problematic areas of code, and provide insight into what changes were made that caused the problems. However, most organizations implement this concept of having a continuous process as having a continuous integration server that maybe provides them with nightly builds.

What I'm proposing is a different kind of continuous process. One which starts on the local machine, constantly compiling code and providing insight to the developer, and possibly even running unit tests in the background instead of allowing the CPU to idle. There are several things that stand in the way of this process existing. First, few testing frameworks can selectively run unit tests (JUnit is a notable exception). Secondly, most build systems don't allow for this type of continuous development workflow, although some have started to move in the right direction.

Let's examine NodeJS/Grunt and Ruby/Autotest. [Grunt](http://gruntjs.com/) is a component of the Yeoman group of projects whose focus is on Extreme Programming and continuous development. While Grunt does a great job of continuously delivering a built project, it fails in running unit tests automatically and selectively. [Autotest](https://github.com/seattlerb/zentest) for Ruby does a better job of this, yet is generally incapable of selectively running unit tests (though there has been some work in this area).

What it comes down to is that we need to formalize this process into several areas:

- Continuous Building
- Selective Testing
- Build Dependency Identification

Continuous Building in this sense means automatically detecting when files need to be built again. This can be done trivially on an event-basis on most platforms at this point. I am personally aware of a ruby gem that provides a consistent interface for listening to filesystem changes. Since this build is triggered in the background, and it's reasonable to assume that the developer probably wants to do other things with his machine,

Selective Testing is a need that arises from the fact that not all tests are quick and efficient. In fact, some tests may require the CPU to be spun at 100%, to simulate resource contention. It doesn't make sense that we should run these expensive tests all the time, much less while the developer may be making constant changes. So instead of running every single test every time we run the build, I'm proposing a framework to run tests selectively, and a convention of organizing tests so that the system can get "hints" as to which tests should be rerun. Similar to [TAP](http://testanything.org/) (Test Anything Protocol), which is a language agnostic protocol for reporting test results, I'd like to propose a similar protocol for instructing a test harness/environment which tests should be run.

Running a subset of the full test suite is a step in the right direction to convert the build process into a continuous one. However, a more important bottleneck is that running a build can take a really long time. To improve the build process, we can selectively only rebuild the parts of the project that have changed. But that's only one step we can take. I've done some research and have found that different build systems see drastically different performance numbers, in no small part due to their differing approaches to detecting dependencies. Just to be clear, I'm not talking about library dependencies, but rather compilation unit dependencies. Meaning that if you change foo.h, you'll need to rebuild foo.c and bar.c. The most successful approach I saw was [tup](http://gittup.org/tup/), with their "up-tree" approach.

This approach determines dependencies in the code, and stores them in the opposite direction, so based on changes to a single file, you can quickly determine which others need to be rebuilt. This general approach of first determining a plan of action and then executing it has a cleaner design, and we reap the benefits of this. More importantly, it produces a rather important data structure that we can use for other purposes than simply building. The dependency tree of which files need to be built can be analyzed in several ways, both to improve build speed and performance, as well as for identifying highly coupled code and candidates for refactoring.

Once we've built a system that has all three of these components, we can enter an age of the truly intelligent build, where unit tests are intelligently run against extremely fresh code, and reducing the cost of building a project to a minimum.

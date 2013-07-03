---
title: Version Stamping
layout: post
---
Version stamping. It's something that we all have to deal with at some point or another. Since version stamping shares some philosophical territory with branching strategies, I'll touch on them as well.

Most software projects (hell, most projects period) have some sort of version stamp (usually a number) attached to it. Some of these stamps assign meaning to some or all of their parts (Windows 2000), while others are seemingly irrelevant (TeX, with its expanding decimal pi). There have been [efforts to try and standardize usage](http://semver.org/) and creation of version stamps, so everyone uses the same (or at least similar) approaches.

Regardless of what your stamp contains, you need to apply that stamp to your project. This can mean changing a header file and recompiling some or all of your codebase. It can mean updating the version name/code in your AndroidManifest.xml, and other derived strings form various places. The list of places that need to be stamped varies from project to project. Ideally, you should reduce it as few places as possible, and have the stamp done automatically by a script.

Now let's discuss how to go about managing these stamps. They can be managed in several ways. One is to adjust the stamp manually, by editing one source file that is read in as input to the stamping script. A nifty trick that is useful is to have that input file be (one of) the output files of the stamping script. This input file must be a part of your source distribution, so other developers can also publish builds (having one person publish new versions is a good idea. Having only one person who is able to do so is a Bad Idea).

Now that we've covered the how, let's cover the what a bit. A good version stamp will give a general indication as to the capabilities of the software. Most version stamps do so by imposing an ordering on differing versions. It is also reasonable to assume that your project comes in a variety of build flavors, each with its own unique set of features or properties. For example, you may have one flavor for a library built as a dynamic library, against the debug versions of the STL. Another flavor would be the release version as a static library.

To support this syntax, we include both some sort of numeric (or other ordered) indicator, followed by an indication of the build flavor. Now the real pickle comes when we want to stamp what platform the project is being built for. The question of whether each platform should receive its own version stamp or if the stamp should be shared across the entire project is a philosophical one, and the primary one that I want to discuss.

Generally speaking, the majority of projects that have a common version stamp for each platform tend to be more cross platform, with small amounts of platform-specific code. Whereas most projects that have separate version stamps for each platform use these separate stamps to reflect the fact that the code is wildly different between each platform, and they evolve in different ways (including bugfixes). This difference is reflected in the concept that a version stamp should reflect all the features/bugs that are contained in that version of a project. When the majority of changes are local to each platform, it is possible that one platform can be developed far faster than other, less popular platforms. Similarly, if most of the code is cross platform, then it makes sense that you would want the version stamp to move forward when bugs are fixed in the common code (or features added).

The choice is ultimately yours, but you can ask these questions to give yourself a better grasp of the situation:

- How much of the code is shared between components/platforms?
- Is there a part of this code that will be updated more often than other parts?
- When new features are added, will they be included for all platforms?

With the standard caveats against clumping all your code together in one project....(X, anyone?)

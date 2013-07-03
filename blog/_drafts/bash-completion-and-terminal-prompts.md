---
title: Bash Completion and Terminal Prompts
layout: post
---
They are completely ubiquotous, so amazingly integrated into our lives, and yet so many developers I know don't even bother to learn how they work, much less change them. The terminal prompt is a part of my daily life as a developer, and I've found myself increasingly in the position of providing tooling for my team, and releasing some of those tools as open source projects.

For example, when I needed a framework to quickly create Ruby command line interfaces, I created [thunder](http://stevenkaras.github.io/thunder/). When I needed a decent prompt, I created my dotfiles framework. The basic idea being that each person should be able to customize his or her terminal prompt to their needs, while providing as much common code as possible, so you can expand and use it in whatever way you see fit.

Personally, at work, I have several projects that I have open in different terminal windows (or tabs). Each of these projects is versioned, but some are done so using svn, and others git. Moreover, I have a few subprojects, and even a few git-svn repos, that have multiple subprojects within them. So I came up with my framework to help you determine the root path of the current project (really the root of the current versioned directory), and provides several useful extension points for adding hooks, listening to events, etc.

For example, I have a quick PROMPT_COMMAND that checks if the directory has changed. If it has, it runs the DIR_CHANGE_COMMANDS.

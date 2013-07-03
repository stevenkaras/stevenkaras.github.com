---
title: "UX Design Rules: Constant Availability"
layout: post
---
This post is part of a series on UX design principles.

Sometimes it just happens that your app crashes, or needs to finish loading, or something like that. But sometimes only part of your app needs to load. We'll look at several examples from the real world of how to show that a particular element is loading, without blocking access to the rest of your app, which is perfectly available to run.

First off, let's take a look at a web browser. Most web browsers include JavaScript, which gives web designers the power to display alert boxes. Very early on, there were "browser-death" pages designed to flood the browser with an endless loop of these alerts. Since nothing in the browser could be interacted with until the alert was dismissed, the only way to close the page was to kill the browser process. In early versions, it would even prevent interacting with other browser windows! Needless to say, this was far from ideal.

When the world moved to tabbed browsing, Javascript alerts were never updated to be local to one tab. They still displayed themselves on top of the entire browser, preventing any access of the page that the user is currently on, or anything of the such. It was only recently that Firefox made the move to display these alerts on top of the tab content, in such a way that the location bar, other tabs, and most importantly, the browser menus were still accessible.

Which underlies the point of this design rule: Even if you do need to force your program into a mode, it should only affect the components that are absolutely necessary to do so.

Let's examine a different example. The Pentaho business intelligence suite is a powerful open-source tool for analytics, data warehousing, and more. The way it's designed is similar to a traditional application that takes in

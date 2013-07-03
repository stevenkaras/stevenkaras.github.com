---
title: "UX Design Rules: Single Screen"
layout: post
---
This is the first in a series on UX design principles.

Most of my recommendations will use computer games as examples. This is usually where I have found the most violations of my rules, but they apply equally as much (if not more so) to business and web applications.

Simple interfaces are good for small data sets, where the amount of data can be summarized in one screen. Once the data goes across more than one screen, more advanced controls are needed. Let's take inventory management in an RPG. So long as the number of items your character is carrying is enough to fit on one screen, it's easy to manage your inventory. However, sometimes it is necessary to manage larger inventories.

In these cases, lists with scrollbars are typically used with limited success. Comparing the properties of two objects in such a manner is a pain in the ass, since it requires constantly scrolling up and down. Worse than this is when equipped items are shown on an entirely different screen.

Let's call this first principle "The Principle of the Single Screen". I'll come up with a catchier name later. This means putting all the relevant actions and data related to a particular activity, or group of related activities, all on the same screen. No scrolling necessary. Displayed on screen, plain and simple as daylight.

If you are having difficulty squeezing all your UI components onto the screen, look for ways to shrink your UI. Reduce the size of icons, UI element borders, etc. If you have multiple tasks that use the same data set, but are unrelated, you can hide the UI controls for one in a collapsible box. An accordion control can be used to show only one set of actions, and their related detail views at once.

If your data set bleeds across several screens, it means that a simple list just won't cut it. You should assume that one of your users will want to fill his inventory with a massive number of items. There are several solutions in this case, with varying success. A hard limitation on the number of items in the data set, with a clearly defined limit (and error messages) is one approach, although a bit draconian in measure. Other solutions require additional UI elements, as follows.

Adding filtering is a good way to allow the user to drill down to one type of item, but this suffers from the same issue as before, if the filter isn't specific enough. Worse, too many filters can overwhelm the user, and be worse than a few simple tools. It's important to mention that the same principles described here apply to the filters. Having a combo box filled with filters that the user needs to scroll to view them all detracts from their ability to grasp a full view of the system at a glance.

While filters can be a useful stopgap measure that can be added quickly, sorting controls are what allow the user to pick out the most important items. The most versatile access method is of course, free text search, but the difficulty of implementation, lack of a simple, mature solution across many programming languages restricts this feature to the most advanced projects only.

---
title: "UX Design Rules: To Mode or Not To Mode"
layout: post
---
This post is part of a series on UX design principles.

To mode or not to mode, that is the question. Whether 'tis nobler to lock the user from all other options at that time, or to allow an asynchronous workflow. Many people have talked, written, and rampaged about the evils of modes. However, despite their best efforts, modes still exist. So I'm going to explore the reasons why they exist, and why some developers insist on using them still.

Generally speaking, a modal dialog or window prevents any other interaction with your application until it has received the user's attention. As I've explained in my other posts, the average user doesn't want to talk "with" the computer, they want to talk "at" the computer. Meaning that when your program forces the user down a particular path of actions (such as being forced to dismiss a dialog before using a window), it creates a sense of frustration, helplessness, and makes your UX feel "evil".

Let's take the modal dialog box as our example. It's typical use is to force the user to acknowledge some warning or error within the application. However, it's often used outside this role, as a way to report results to the user. The problem is that it forces the user to dismiss the dialog in order to continue using the application, even if there are other components or sections that could reasonably be used at that time.

The key here is that modes restrict user choice. They hide information that would otherwise be available to the user. They also prevent the user from making informed decisions and having the option to "bail out" quickly.

We can analyze a lot of the other principles here in terms of this one. The single screen principle means that we shouldn't force the user to move from the mode of one screen to another. Animations force the user to go into "watch animation" mode prior to taking action. So the underlying principle of all these is to not use modes, or at least to use them very carefully.

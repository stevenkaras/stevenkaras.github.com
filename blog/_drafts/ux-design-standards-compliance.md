---
title: "UX Design Rules: Standard Compliance"
layout: post
categories: [ ux ]
---
This post is part of a series on UX design rules. Back in 2012, I was playing around with switching to vi as my primary IDE. It started out well, but I eventually gave up when I discovered Sublime Text. I'll be using it as an example in this post about an important UX rule: Consistency.

vi is a great example of both a highly consistent application, yet wildly inconsistent with its environment. To elaborate, vi was built before most of the commonly accepted usability standards were accepted. As such, it built its own standards, and built on top of some existing applications. There's a great post on how vi was designed by thoughbot (insert link here).

Internally, vi has the concept of directions. These define different ways to move the cursor throughout the document. These directions can be used with 99% of all other vi commands, making them apply to different sections of text. In some ways, this is somewhat obselete with modern keyboards and pointing devices, and wholly inappropriate for touch interfaces. But once you've picked up the concept of directions, you're past the hard part of learning vi.

However, vi's keyboard shortcuts are extremely inconsistent with those used by most text editors. It leads to a higher cost of entry, which prevents the widespread use and adoption of the editor among younger programmers. This cost was most pronounced for me when I showed a small group of first year CS students in a lab how to edit a text file using vi. They were dumbfounded by the concept of having to "switch modes" and couldn't understand why they needed to enter "insert mode" before typing in the file's contents.

The key point here is to 




First off, let's lay out the keyboard. You have the letters, the numbers, and a whole bunch of other keys laid out around these letters. The central position they are afforded represents their importance and ubiquity of use. Most notable for this discussion, is the groupings of so called modifier keys on the bottom left and right of the keyboard. These keys change (modify) the behavior of a program when a particular key is pressed.

This means that if typing the letter 'a' produces that letter in the program, then holding the shift key and pressing the same button produces a similar effect. However, many UX designers fail to maintain this intuitive consistency when it comes to the various "command-mode" actions that can be taken.

Eclipse follows this principle amazingly well. The control modifier key, when used in combination with a key that normally navigates throughout the input, does not change the cursor position, but rather moves the viewport around. Meaning that pressing CTRL-Down moves the entire screen down one line, without moving the cursor.

vi has no such consistency, at least not in the stock format. 

We can extend this principle on a grander scale to the entire operating system. Ubuntu's unity desktop environment has come under a lot of fire recently for not being customizable at all. While it's true that Unity lacks the customization options of KDE or XFCE, those options will be added later once the devteam has had the chance to work out just what should be customizable. One of the first things to be customizable were keyboard shortcuts. Unity makes extensive use of the Super key (Windows key, for us mere mortals) in the default shortcuts.

It makes sense to use the super key as a modifier key for all actions that are related to the operating system, or the desktop environment as a whole. So things like window management (like Super-Up) make sense. It would also make sense to suggest to application developers to only use the control key for keyboard shortcuts, or restrict the alt key for shortcuts that affect the program as a whole (or only the current window).

To wit, I'm proposing that UX designers follow the following advice for modifier keys:

Super - Restricted to actions that move windows, launch applications, and manage the desktop environment

Alt - xxxx

Ctrl - If your application has a viewport concept (such as an editor), these shortcuts should mainly move around the viewport. Otherwise, feel free to use this one as your primary modifier.

Shift - Should be used as an additional modifier that reverses the action of the normal keystroke. So if Ctrl-Z performs an undo, Ctrl-Shift-Z should redo it.

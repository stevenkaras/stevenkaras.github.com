---
title: "UX Design Rules: Consistency"
layout: post
categories: [ ux ]
---
This post is part of a series on UX design rules. Back in 2012, I was playing around with switching to vi as my primary IDE. It started out well, but I eventually gave up when I discovered Sublime Text. I'll be using it as an example in this post about an important UX rule: Consistency.

vi is a great example of a highly consistent application. Part of the reason why is because it is built on top of layers of abstraction that provide it with very real and very powerful advantages in consistency. There's a great post on how vi was designed by thoughbot (insert link here). It's the composition of these abstraction layers that make vi's interface one of the most consistent interfaces.

For example, one of the most basic abstractions is the concept of directions. These define different ways to move the cursor throughout the document. A direction is used as input for 90% of all the other commands as a way to apply transformations to a particular chunk of text. In some ways, this is now obselete with modern keyboards and pointing devices, and wholly inappropriate for touch interfaces, yet the underlying concept of "take some text and do something to it" was well split into two tasks. The repeated application of this abstraction as a way to "select" text to transform provides vi with a highly consistent base upon which to expand.

One area which typically lacks consistency is keyboard shortcuts. Especially multi-key shortcuts. There are a few conventions that you can follow, but in general, it means assigning meaning to each of the modifier keys and sticking with that meaning! For example, decide that any reversible operation should have a shortcut that reverses it, and is invoked the same, but with the Shift key as well. Or that the Alt key only affects the current window, or doesn't make content changes (only viewing data differently).

Another way that your application needs to be consistent is how it displays user controls. For example, always display dialogs with the OK button on the right, or on the left. If you switch between the two, the cognitive dissonance your users will experience severely impacts their experience, and in turn, your revenues.

Keep your abstractions close, and consistency follows.

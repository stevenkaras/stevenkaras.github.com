---
title: Touch on Android
layout: post
---
While building [my game](https://play.google.com/store/apps/details?id=ncs.pipes), I came up against a missing feature in Android. There is little to no drop-in support for basic multitouch gestures, such as swiping, dragging, or pinch zooming. The support you are given is minimal, and it's based on a fingerDown, fingerMove, fingerUp API. Which means that any developer who wants to use these gestures has to develop a compatibility library before writing an event handler similar to:

`onPinch(scale, centerX, centerY)`

Naturally, I wrote the library, and have made it available on [GitHub](https://github.com/stevenkaras/Android-TouchLib) under the MIT license.

While the current feature set is highly limited (it only supports dragging, pinching, and tapping), it can be easily extended to include other gesture types. In the future, I'd like to add support for a more generic framework, allowing a more seamless transition between gesture states.

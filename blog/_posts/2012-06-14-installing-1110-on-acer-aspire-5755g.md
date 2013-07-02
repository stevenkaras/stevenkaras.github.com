---
title: Installing Oneiric on Acer Aspire 5755G
layout: post
---
Installing Linux has, historically, been very dangerous, and very tedious. The oldest installers required you to write down your hard drive geometry beforehand, and you needed to set aside an entire day just to do that. Now, most installers finish inside two hours, and will automatically import your settings from previous installs or other OSs.

However, it's always nice to see/hear about someone else's experience installing a distro before installing yourself. I recently ran across the [Linux on Laptops](http://www.linux-on-laptops.com/) site, which offers links to various blog posts (such as this) extolling the issues and experiences installing various Linux distros on a particular model.

When I first installed Ubuntu on my laptop, it worked right out of the box, supporting almost all the hardware (the microphone on this model is a little too far away from me to be useful, so I use a headset, even under windows). The one caveat is that it doesn't support the Optimus hybrid graphics card out of the box. This means that Ubuntu will drop into Unity2D after the first boot, until you install the proprietary drivers from NVidia, and will drain your battery fast until you install a package to handle the power management aspects.

There's currently (June 2012) only one active project that provides this support: [Bumblebee](http://www.bumblebee-project.org/). Installing it is a breeze (although it does require some shell-fu).

Aside from that minor hiccup, the only modification that I suggest is reducing the size of the launcher icons (via ccsm) to 36 pixels. Otherwise the small resolution starts to feel a bit cramped.

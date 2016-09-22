---
title: Mac sucks for some things
layout: post
---
This is a rant about all the small things that drive me nuts about Mac. I'll mention workarounds, but this isn't an omnibus post, it's just some filler to keep my blog active (I've got a bunch of writing in the pipeline, but nothing finished).

# Scanning sucks

Scanning with Ubuntu is a breeze. It scans the document, and after it's grabbed the full frame it allows you to crop/adjust the image as you see fit. This is a great workflow, and works well with network scanners (like I have at home). Mac has Image Capture as a builtin utility, which works great. Except when it doesn't. No CLI interface for it....randomly insisting that there is no document, when I know for a fact there is (admittedly, this may be HP's fault, they suck at implementing standards), and assorted other crap. Things like randomly changing the DPI, refusing to change the destination folder, resetting the file name, clobbering existing files, etc.

## My workaround

Run ubuntu in a virtualbox. Few handy tricks: install compiz settings manager and disable all animations, it will speed up the experience by a ton. The Unity Dash animation is hard coded, so nothing you do can solve that.

```bash
sudo apt-get install compizconfig-settings-manager
# ccsm to launch (GUI, so manual editing)
ccsm
```

## Future

Ideally, I'd like to script this out to a docker image that can find and connect to the scanner on its own, scan the files, and name them appropriately.

# Cut/Copy/Paste in Finder

Everyones favorite pet peeve. Apple is just being stubborn. Not all of us like to work with many open windows. Some of us actually like to keep our workspaces relatively empty. I personally do it because I can't multitask, and keeping as few applications open at any given time enforces that approach. It means that windows get closed the second I don't need them right there in front of me.

## Apparently it's builtin, they're just assholes

Apple included this, but rather than follow what most people would consider to be a sane pattern, they decided to be "special" and do their own thing. Just copy, then hit `⌘-⌥-v` in the destination folder and it works.

# Home/End/PageUp/PageDown/Top/Bottom

Coming from Ubuntu, I've grown very accustomed to the readline bindings. Then Mac comes along, and sets up their own special bindings that don't map well (or at all). You'd think that `⌘` is equivalent to `Ctrl`, but nope. It's `Super`. And `⌥` is `Meta`, except when it isn't. And then they just muck around with all the behavior by making `⌘-←` do what home does. Sometimes. Except when it doesn't. Here's what I've found out so far:

```
Home - fn-←, but ⌘-← works in most apps (not all, and sometimes not even in different parts of the same app)
End - fn-→, but ⌘-→ works in most apps (not all, and sometimes not even in different parts of the same app)
PageUp - fn-↑
PageDown - fn-↓
forward-word - ⌥-→, but C-→ also works in readline
back-word - ⌥-←, but C-← also works in readline
```

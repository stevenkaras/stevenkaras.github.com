---
title: Announcing Thunder
layout: post
---
It seems like most of my recent projects revolve around building command line utilities. As a result, I've had the displeasure of dealing with buggy frameworks that provide option parsing, ugly code as a result, and much more. I finally got sick of it and wrote my own command line utility library for Ruby. It doesn't do much, but that's by design. Read on for more.

Thor was a godsend when I first found it, but I've grown past it, and it has a few rather glaring bugs, mostly involving subcommands and default tasks. Other frameworks don't provide the unobtrusive code feel that Thor does. One other thing that drove me nuts about Thor is how it does everything and the kitchen sink, most of which I don't use, partly because Thor doesn't do it well enough.

A friend of mine compared the situation to a bathroom. You can install a beautiful vanity, a large marble bathtub with brass fixtures, or you can buy a plastic prefab. The prefab does everything you need it to at first, but only so well. After you've used it for a while, you start bumping your elbows on the walls, and eventually get fed up with it. Not because it's not good, but because it's not good enough.

Thor is a great project, but I truly believe that by setting out to become a prefab plastic shower, important qualities such as focus, documentation, and perhaps most importantly, stability are being sacrificed.

The gem is public, so just `gem install thunder` and read the docs to get started!

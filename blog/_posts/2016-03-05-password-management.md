---
title: Password Management
layout: post
---
Password wallets are awesome! But getting them to work across multiple devices can be a major pain in the ass. Recently, I switched from using Dropbox to Syncthing, and came up with the idea that a password wallet shouldn't use a single file (at least not by default), but rather a directory with a clear, simple format. I'll lay out the design I want for this system in this post, and hopefully I'll get around to building it in the next year or two.

# Philosophy

Password wallets are binary files that can be easily corrupted, synced wrong, simple changes aren't merged easily/properly, etc. I'd prefer a password wallet that defines a directory structure rather than a file structure, and allows for simpler sync mechanisms to play well with it (such as pushing tarballs around, or rsync, or syncthing, or btsync, or dropbox, or whatever the fuck you want)

# Basic Structure

```
walletname
|--key
|--group1
|  \\--2e5f3ac1
|     |--20160103.120203.phone.keypair
|     \\--20160103.100821.laptop.keypair
\\--group2
   \\--subgroup1
      \\--3cd7a081
         \\--20160103.120203.laptop.keypair
```

* `key` contains the encryption key used for the rest of the wallet, and is encrypted itself.
* keypair folders are deterministically assigned a unique ID based on the initial Name field. sha256(Name)[0..8] or somesuch.
* keypair files are encrypted using the key from `key` (an extension should be simple to allow groups to use a sub-key, in case they are migrated between wallets)
* keypair files are named based on creation date and the name of the device that created them (entered when first configuring the client, defaults to hostname)

# Encryption/Security

AES-256-GCM. Or whatever the symmetric de jour is this week. The threat model I'm protecting against is data being exposed by Dropbox, etc being compromised, or sync traffic being intercepted.

# Interface

Ideally, the UI should allow you to layer multiple wallets together, so you can segregate the ones you use for work from the ones you use for personal life.

# Future

I've been working on a Ruby implementation of this, but I don't have a ton of time to put into it. I'll upload it to Github once I have a working UI.

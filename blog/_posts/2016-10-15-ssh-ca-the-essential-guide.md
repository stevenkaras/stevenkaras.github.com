---
title: "SSH-CA: the Essential Guide"
layout: post
excerpt_separator: <!--more-->
---
This post is a personal request from a colleague who wanted to know the bare minimum needed to work with my ssh-ca script. Once you have [the script][0] (self-contained, no need for my entire bashfiles):

[0]: https://github.com/stevenkaras/bashfiles/blob/master/.ssh/ssh-ca.bash

```bash
ssh-ca setup
ssh-ca sign ~/.ssh/id_rsa
ssh-ca install myuser@myserver.example.com
```

<!--more-->

Repeat the sign step for all the keys you want to sign, and the install step for all the servers you want to trust the CA.

# But I want to sign server keys!

```bash
ssh-ca setup
for key in /etc/ssh/ssh_host_*_key.pub; do ssh-ca signhost "$key"; done
ssh-ca trustconfig # copy the second line and add it to the known_hosts file of any client you want to trust the server keys
```

Admittedly, this is not as magical as the client key flow, but it's the best I've got.

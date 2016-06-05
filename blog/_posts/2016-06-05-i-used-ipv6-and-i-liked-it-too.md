---
title: I used IPv6 and I liked it too
layout: post
---
Small fuckup on my part: we shipped a new server to the DC last week, and I forgot to set up the network interfaces beforehand. Our IT consultant looked at me and said "yep, you're screwed". Rather than handing it off to the DC crew to set up, I tried for a while to get our two existing servers to talk with the new one. Some searching and a few stackoverflow results later, I found an opening. Turns out I had left one network interface up in dhcp mode. Bad news is that it wasn't getting the autoconfig address (169.254.0.0/16), so even though the link was alive at the ethernet layer, it was dead as a doorknob for IP traffic.

Funny thing is, IPv6 is automatically configured, and it had set itself up properly. Even better, turns out that ipv6 includes neighbor discovery baked into the protocol:

```bash
ping6 -c2 -I em2 ff02::1
```

Which reveals the IPv6 address of any neighbors on the em2 interface (em0 being out to the world, and em1 to the other existing server). Even better, ssh with ipv6 lets you bake in which interface to use in the address:

```bash
ssh -6 IPV6_ADDRESS%em2
```

I used IPv6, and I liked it too. Now I just need to learn it (and probably write up a checklist before sending a server to the DC).

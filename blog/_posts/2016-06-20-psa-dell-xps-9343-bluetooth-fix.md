---
title: "PSA: Dell XPS 9343 Bluetooth fix"
layout: post
---
Dell fucked up and shipped a broken package for bluetooth support with the Dell XPS 9343 Developer Edition. The good news is that they just put the firmware blob in the wrong place, so all you need to do is just hardlink it:

```bash
sudo ln /lib/firmware/fw-0a5c_216f.hcd /lib/firmware/brcm/BCM20702A0-0a5c-216f.hcd
sudo modprobe -r btusb && sudo modprobe btusb
```

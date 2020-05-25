---
title: "Raspberry Pi, x86, and docker; oh my!"
---
I ordered a Raspberry Pi a while ago but I only got a chance to really start playing with it recently.
My plans for it at the moment are pi-hole and a media server, but I'm not sure which one I will end up using and I despise polluting a system with PoC deployments so I wanted to get docker running as quickly as possible.
Along the way, I hit a snag because the docker/compose image is x86-only, so I used an old trick for running executables: binfmt and qemu.

# tl;dr

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
sudo usermod -aG docker pi
sudo curl -L --fail https://github.com/docker/compose/releases/download/1.25.5/run.sh -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo apt-get install qemu qemu-user qemu-user-static binfmt-support
```

# Installing docker

I think I've hit almost every possible landmine when installing docker in the past: changing package names, hard-resets for what were supposed to be zero-downtime updates, moved config values causing security breaches, etc.
Normally, I would never recommend piping `curl` to `sh` but I have to say that the convenience it gives is worth it.
This time, the installation was so quick and easy I was surprised how well it worked given my past experiences.

Please note however that I specified the `curl | sh` to use https, so it's entirely likely this is a very bad idea.
If you work on the Docker team or know someone who does, please *please* **please** change this to use https.

## Docker-compose

[pi-hole publishes][pi-hole-compose] a recommended docker-compose config for running it, so getting docker-compose running was a major goal for me.
In the past, I've used pip or their self-contained release for docker-compose but in the spirit of learning and experimenting I wanted to set it up as docker-compose inside docker.
The catch here is that the image is x86 only, and the Raspberry Pi 4 is armv7l, so if you try to run docker-compose out of the box like this, you'll see this error:

> `standard_init_linux.go:211: exec user process caused "exec format error"`

[pi-hole-compose]: https://github.com/pi-hole/docker-pi-hole/#quick-start

# A short diversion

Back in high school, I used to have only one computer and while I wanted to run Linux I also wanted to play games and didn't feel like restarting every time.
As a result, I tried out a bunch of different solutions including several that I don't remember the names of, but eventually rested on using cygwin and adding it to the PATH creating what my friends and CS teacher called a "Frankenstein's Monster" of an operating system.
The idea was that I could jump back and forth between Linux and Windows commands and benefit from both worlds.
After a year or so of this, I finally made the jump to using Linux exclusively except for gaming, and haven't looked back since (except for a year or two when we were expected to submit Microsoft Word documents for homework but that's thankfully over).

# QEMU and binfmt_misc

QEMU is emulation software that allows you to emulate just about any processor and system configuration you could imagine.
Together with binfmt_misc, you can use it to run x86 code on ARM, ARM on x86, and even more exotic configurations.
It may not be perfect, and it certainly isn't fast, but it works and in some cases that's all we ever need.

The details are basically that the Linux kernel uses a module called binfmt_misc that tells it how to actually run programs in the `exec` family of system calls.
You can inspect the currently registered handlers in `/proc/sys/fs/binfmt_misc`, as well as register new ones by writing to the `register` file.
For example, here's the output from my rPi's `/proc/sys/fs/binfmt_misc/qemu-x86_64`:

```
enabled
interpreter /usr/bin/qemu-x86_64-static
flags: OCF
offset 0
magic 7f454c4602010100000000000000000002003e00
mask fffffffffffefefcfffffffffffffffffeffffff
```

The idea being that when the kernel sees an executable file with that magic number at the beginning, it hands it off to the `/usr/bin/qemu-x86_64-static` executable to interpret.
Normally, just running a program compiled for x86 like this is a bad idea because unless it's statically linked, it will look for libraries like libc, but it will get non-x86 code.
The usual solution for this is to run things inside a chroot, which a docker container basically is.

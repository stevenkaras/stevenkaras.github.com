---
title: Modular Development
layout: post
---
I've spent enough time working on various consulting projects that I've picked up a few strategies for handling them so the work is organized, reproducible, and unobtrusive. The last thing I want is for a client to lose faith or a deliverable because their files get lost or mixed up with another client or my own.

The other main reason why I follow this methodology is that reproducible results are easier to debug and maintain, have increased value (since the process can be tweaked to produce a different deliverable), and result in increased productivity.

So here's my basic setup: I have a base virtual machine image that I update from time to time. Whenever I start a new project, I clone the entire image, and install whatever packages I need for the project. This base image includes a file server, so the files sit directly on the virtual machine hard drive, but I can edit them from my host environment. While it means that I need to boot up the VM to work on the project, it's something I do anyways. The base image also has 2 network interfaces set up so I can always access the VM, while still giving it access to the internet.

All that was very general, so here's the specifics: I run [VirtualBox](https://www.virtualbox.org/) 4.1.18 and my base image is [Ubuntu Server 12.04 LTS](http://releases.ubuntu.com/precise/) (Precise Pangolin). I've set the first two adapters to use NAT and Host-Only networks. On the server image itself, I've installed the VBoxGuestAdditions (although I'm not using them), and it's running NFS (and exporting a folder called project). On the host side of things, I've got a script set up to mount and umount the NFS folder (I've found that it freezes badly if I forget to umount the VM before turning it off).

To set up the entire system:

## Setup the network interfaces

Start by opening the VirtualBox preferences and creating a Host-Only network. There may be one by default, but there wasn't for me. Open the settings for the VM and set the first two adapters to NAT and Host-Only (it doesn't matter which is which). Then open the VM, and edit the /etc/network/interfaces file. Add the definition for the second interface (Precise Server doesn't autodetect it, at least in my case). It should be identical to the first one, which is autodetected.

Once you've done that, either run ifup on both interfaces or reboot the VM. Make a note of the IP on the host-only adapter (it should be 192.168.56.xxx if you didn't play around with the dhcp settings for the host-only network)

## Setup NFS

I followed [this guide](https://help.ubuntu.com/community/SettingUpNFSHowTo), along with a few others. The basic idea is to install NFS, share the project folder, and fix a few settings.

Here's a handy script to handle most of that (run all these as root, assumes the primary username is demo):

{% highlight bash %}
#!/bin/bash

apt-get install nfs-kernel-server
mkdir -p /export/project
echo "/home/demo /export/project none bind 0 0" >> /etc/fstab
echo "NEED_IDMAPD=yes" >> /etc/default/nfs-common
echo "/export/project *(rw,nohide,insecure,no_subtree_check,async)" >> /etc/exports
{% endhighlight %}

## Write a few helper scripts

I've found that keeping around two helper scripts to mount and umount the project folder on the VM is quite handy. Bear in mind this is not a secure setup, and you should never take what you read without researching it first. I encourage everyone to read up on these commands before thoughtlessly copying and running them. Here's the commands you should toss in each script:

#### mount-project:

{% highlight bash %}
#!/bin/bash

VMIP=$1
: ${VMIP:="192.168.56.101"}
sudo mount -t nfs -o proto=tcp,port=2049 $VMIP:/export/project /media/project
{% endhighlight %}

#### umount-project:

{% highlight bash %}
#!/bin/bash

sudo umount -f /media/project
{% endhighlight %}

---
title: Magic Number bug in SSH
layout: post
---
[1213486160][0] and [1195725856][1] move over, you've got more friends! Meet 1397966893 and 1349676916. I ran into this because one of our servers was unable to git pull from our office starting from when I pushed out a new ssh config with some shiny new features turned on.

[Turns out][2] that if you use SSH control sockets and combine it with ProxyCommands, ssh promptly barfs and spits out the suspiciously large "1397966893" as an invalid packet length. The only current solution that I found is to disable control sockets for the proxy server.

The second one I found by searching for similar errors for SSH, and it's pretty obvious from the context that this magic number is what you get for using SSH Protocol 1 (deprecated for a very long time now). The approximate dates if you search on google for this support this.

[0]: https://rachelbythebay.com/w/2016/02/21/malloc/
[1]: https://rachelbythebay.com/w/2016/10/07/magic/
[2]: http://serverfault.com/questions/447055/ssh-multi-hop-connections-with-netcat-mode-proxy

*[1213486160]: "HTTP"
*[1195725856]: "GET "
*[1397966893]: "SSH-"
*[1349676916]: "Prot"

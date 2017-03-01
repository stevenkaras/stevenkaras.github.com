---
title: Configuration Management using SSH and m4
layout: post
---
At my work, I've found that I need to manage the ssh configurations and authorized keys for a handful of user accounts across many servers. So in my typical style, I wrote a [Bash script][0] to manage the whole lot. At first, it was a simple `cat | parallel scp x {}:x` script. Eventually, we realized that we had a fairly standard base configuration, but that some servers needed more "customized" configurations.

One option was to keep a separate copy of each servers' configuration and push out the custom ones. But that means changing some basic configurations like adding a new server, or a new authorized user, which violates SSOT. So I considered several options. I wanted something simple with a minimal amount of complexity. This is in part because I've been burned by systems that turned into works of art with little signs that say "magic! don't touch" and "you aren't expected to understand this".  Another important consideration is portability. That means using standard tools such as bash. 

It just so happens that I remembered an ancient utility that I had encountered in a similar role at a previous workplace. [M4][1] draws its ancestry all the way back to the 70s, and while I didn't need the entire complexity of a macro language, it provided the subset I needed.

M4 is a nifty little language. It allows you to define macros, which are tokens that are replaced. You can then test for the existence of a macro to control your output conditionally. Most importantly for me, you can also include other files, evaluating them as templates as well.

[0]: https://github.com/stevenkaras/bashfiles/blob/master/.ssh/ssh-manager.bash
[1]: https://en.wikipedia.org/wiki/M4_(computer_language)
*[SSOT]: Single source of truth

I know that it isn't an ideal solution, and I'll probably end up switching over to ansible or another reasonably mature framework rather than trying to reinvent the wheel. Although I still maintain that reinventing the wheel, especially when you throw it out at the end, has significant value because it gives you great insight into the design and problem space.

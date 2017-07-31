---
title: VHDL development on Mac
---
I took a course this semester on FPGA development using VHDL, where the ongoing project is to build a MIPS CPU from scratch.
I primarily use Mac at home, so I set out the weekend before the semester started to find tools that would run on Mac. I'll also include at the end some generic VHDL resources.

# Nothing runs on Mac
The two recommended environments for VHDL in the course were [ModelSim][modelsim]{:rel="nofollow"} and [ISIM][isim]{:rel="nofollow"}. In the end, I installed ISE on a Windows VM, and used that for "last-mile" building.

[modelsim]: https://www.mentor.com/products/fv/modelsim/
[isim]: https://www.xilinx.com/products/design-tools/isim.html

# Enter GHDL
[GHDL][ghdl] is the GNU VHDL environment/simulator.
Luckily for us, it also runs under mac.
They recommend use of [GTKWave][gtkwave], which also runs on mac.
GTKWave requires the Switch module, which I installed with `cpan install Switch`.

[ghdl]: https://github.com/tgingold/ghdl
[gtkwave]: http://gtkwave.sourceforge.net/

# Sublime Text
[Sublime-VHDL][sublime-vhdl] is the plugin I used to enable syntax highlighting, although I had some trouble because it sets the path to /usr/local/bin, and gcc is installed under /usr/bin.
So I wrote my own build system that passes in the correct path (and added a few options to shorten my write-build-test loop).
I've opened a pull request to fix this, given that gcc is under /usr/bin on both OSX and Ubuntu by default.

[sublime-vhdl]: https://github.com/yangsu/sublime-vhdl

# Compiling code with GHDL

When I tried to compile an example testbench provided by the professor in the course, I immediately hit my first hurdle.
It seems that GHDL provides a strict interpretation of the IEEE standard, which doesn't include the arithmetic extensions.
Fortunately, it does come bundled with the Synopsys (or compatible, not 100% sure) implementation:

```bash
ghdl -a --ieee=synopsys *.vhd
```

We discovered after that he also is fond of using the `ieee.std_logic_arith` package, which was deprecated a long time ago and replaced by `ieee.numeric_std`. The earliest [reference][vhdl-math-tricks] I could easily find that recommended the deprecation of numeric_std was from 2003.

[vhdl-math-tricks]: http://www.gstitt.ece.ufl.edu/vhdl/refs/vhdl_math_tricks_mapld_2003.pdf

The last hiccup we ran into was that GHDL is somewhat more pedantic (or lacks the "customized" libraries that come with ISE), and so it fails when trying to compare `std_logic_vectors` with `=`. Working around that gave me my one liner (that I also included in the build system):

```bash
ghdl -a --ieee=synopsys -fexplicit *.vhd
```

# Building and installing the code onto an FPGA

I'm not certain if GHDL is capable of building a firmware image for loading into a dev board, so I ended up installing ISE onto a Windows VM, which works ok, but isn't anywhere near as streamlined as my personal dev environment, so I end up switching back and forth when fixing errors that arise in actual synthesis.

We used Digilent boards, so we used their Adept package to actually load the design onto the boards. The USB connector worked without too much trouble (needed to replug the USB once or twice for it to recognize the USB cable).

{% comment %}

# Other resources

This section is not being published because I wasn't able to test everything here, and didn't feel comfortable recommending something I haven't tried at all. But for those people who can track down the comment, here are a few more links for you to follow:

* [VUnit][vunit] - python library for building and testing designs in one step
* [cocotb][cocotb] - yet another testing framework. Seems significantly more complicated than it needs to be.
* [OSSVM][ossvm] - a formal verification framework

[vunit]: https://vunit.github.io/
[cocotb]: https://github.com/potentialventures/cocotb
[ossvm]: http://osvvm.org/

{% endcomment %}

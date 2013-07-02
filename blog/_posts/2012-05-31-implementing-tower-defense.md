---
title: Implementing Tower Defense
layout: post
---
Tower defense games are a staple of online casual gaming and mobile games. The genre has been done to death so many times that there is even a [games portal site](http://www.playtowerdefensegames.com/) dedicated solely to tower defense games. Now, tower defense can be broken into two basic categories: path-based and maze-based. Other game mechanics may be mixed in, but those are the two that define the tower defense genre. Let's take a look at implementing the basic mechanics of these.

In a path based tower defense game, the enemies follow a set path, and the player builds towers along that path. The path is set, and enemies always follow it. Note that it is trivial to show that this is equivalent to multiple path games. These games are the simplest to implement, since it doesn't require any algorithmic knowledge. It's no surprise that the overwhelming majority of early tower defense games used this paradigm.

To create a more complex, varied game, developers built the ability to affect the path of the enemies as they came out. This is what I refer to as the maze-based paradigm. The basic strategy here is to build a maze for the monsters to navigate. But that's the crux of it: they need to navigate. Navigation, at its core, requires a knowledge of algorithms. There are many navigation algorithms, ranging from the simple (BFS) to the complex (A\*, D\*, LFD2).

For maze-based tower defense, the efficiency that we are looking at is that we have a map with n tiles, and m enemies on the board at any given moment. Any navigation algorithm has a worst case of Ω(n). So if we navigate for each individual enemy, our lower bound is Ω(mn). Not too good. More importantly, since we're navigating many enemies along what is ostensibly the same path (or at least to the same destination), then we can reduce the complexity to O(n).

BFS is a single source to all destinations search algorithm. So to find the shortest path from any point to a single destination, all we need to do is run the BFS, and reverse the result. Now we've built something that not only works in O(n), but works in O(1) for any given query. Meaning that in every game tick, the amount of processing we need to do is O(m). Not bad for five minutes writing code.

I'll leave the implementation and application of this algorithm to the reader....it's a fun one, once you've got the theoretical background.

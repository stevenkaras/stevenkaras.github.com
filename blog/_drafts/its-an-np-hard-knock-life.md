---
title: It's an NP-Hard knock life
layout: post
---
A few days ago, an Italian graduate student published a paper including a complexity analysis for various video games, proving for the first time that Pacman is NP-Hard. Personally, I welcomed the news, although I wish he had mentioned Zelda, since the proof is even easier for that one (space traversal = TSP + other stuff = NP-Hard). Point being, I suddenly felt like my childhood wasn't quite so wasted any more. After all, I had solved many NP-Hard or PSPACE complete problems!

The paper also made me think that if Pacman is NP-Hard, and we can reduce TSP to it, then we can leverage other such games and a recording mechanism to effectively crowdsource NP-Hard problems, similar to the protein folding game FoldIt. Such a game could be provided for free to various platforms, with each "level" representing either an isolated chunk of the greater problem, or working collaboratively on the entire problem (with effective tools to share and version game boards).

I already have one game for Android published, but I can prove quite simply that while it is in NP, I suspect that it is in P. The verification algorithm for the board runs in O(n). Board configurations have an upper bound of n, so selecting one is NP. Therefore, it is in NP. But solving it can be done by creating an "energy" grid, that shows potential configurations where each piece could potentially be connected. If a piece only has one such configuration, then the configuration of adjacent pieces that connect to it is much higher, and so on. Not sure what the exact energy function would be, but the point is that it could most likely be done in P.

So if the "classic" games are all NP-complete, that means that I need to design a new game that can be transformed from TSP (or knapsack). One thing is for sure though. My CS degree is already starting to ruin my life. I can't play a game without thinking of the complexity of it.

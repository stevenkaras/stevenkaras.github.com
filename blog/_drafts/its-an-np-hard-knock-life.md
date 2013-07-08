---
title: It's an NP-Hard knock life
layout: post
---
A while ago, an Italian graduate student published a [paper](http://arxiv.org/abs/1201.4995) on complexity analysis for video games, proving for the first time that Pacman is NP-Hard. Personally, I welcomed the news, although I wish he had mentioned Zelda, since the proof is even easier for that one (space traversal = TSP + other stuff = NP-Hard). Point being, I suddenly felt like my childhood wasn't quite so wasted any more. After all, I had solved many NP-Hard or PSPACE complete problems!

The paper also made me think that if Pacman is NP-Hard, and we can reduce TSP to it, then we can leverage other such games and a recording mechanism to effectively crowdsource NP-Hard problems, similar to the protein folding game FoldIt. Such a game could be provided for free to various platforms, with each "level" representing either an isolated chunk of the greater problem, or working collaboratively on the entire problem (with effective tools to share and version game boards).

So if the "classic" games are all NP-complete, that means that I need to design a new game that can be transformed from TSP (or knapsack). One thing is for sure though. My CS degree is already starting to ruin my life. I can't play a game without thinking of the complexity of it.
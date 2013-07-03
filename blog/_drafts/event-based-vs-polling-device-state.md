---
title: Event-based vs. Polling device state
layout: post
---
I've been playing way too many games recently, and I can't help but pick apart the paradigms they use to handle user input. Most traditional, and AAA games use a polling style of input, where if the "move left" action button is pressed during (or slightly before) each frame, it moves the character during that frame. Some of the cheaper games I've seen use the simpler "typing input" method that causes many issues with good gameplay.

In a polling style game, the best time to poll the keys for actions varies based on the action to be taken, and the style of game. Although, in general, it should take place somewhere between 10-100ms before the frame. Given that most LCDs run at 60fps, that means that there are 16ms between each frame (ideally). So polling for input at the end of each frame and storing that for the next frame sounds reasonable, but is a bad idea.

Object oriented philosophy states that there should be a separation of concerns within a system. Meaning that the code for rendering the frame, updating the model, and gathering user input shouldn't be run together. It could be that updating the model takes a long time for some reason. In the meantime, the user should be given feedback on that slowdown, and still be allowed to access the majority of the user interface (for example, to pause, quit, or open a debugger in another viewport).

Now, saying all this is one thing. Actually implementing it is another. It's based on the assumption that the most basic action available to you is polling whether a key is depressed or not. On top of that, we can build an abstraction layer to track which keys are depressed, and raise events for when the key is pressed down, and then released.

A second abstraction layer can be used to handle typing input. This handles the delay before "repeating" the keystroke. This same layer should be responsible for combining certain key combinations, such as ctrl-x and alt-f4. While the key combo behavior is highly useful for complex applications, the repeated keystroke behavior is arguably an anachronism, and one that causes some developers to become lazy and utilize it for their own purposes.

But the fact remains that I've seen too many games that mix between these two layers, or worse yet, rely on the key repeat feature rather than handling the events properly.

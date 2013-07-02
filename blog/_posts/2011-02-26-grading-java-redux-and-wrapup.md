---
title: "Grading Java: Redux & Wrapup"
layout: post
---
Well, I had a lot of fun being the "supertutor" for a semester. It was truly an experience, granting me insight into various thought paradigms. And I've realized the number 1 reason why most students get their grades lowered is they don't follow directions.

To be honest, it was somewhat embarrassing to see how some students would time and again make the same "mistakes", which were simply because they didn't bother reading the instructions, and couldn't be bothered to learn from their mistakes. While I realize that learning is hard (my own grades prove that....), I've also learned the true value of an academic institution.

All that aside, I ended up making many improvements to the [Java Grading Tools](https://github.com/stevenkaras/Java-Grading-Tools) package over the course of the semester. I even wrote a classloader!

Most of the changes are just bugfixes and "superficial" convenience, however the entire package is a semeseter more mature. And since I don't plan on doing this ever again, I am just going to leave the package to grow old, and fade from memory. To that point, if anyone wishes to take over development, or if they need some support, please contact me! I'd love to add a "users" page that shows how many people use the package.

Here are some of the features I would have liked to include/improve upon:

- Make the license clear and include it at the start of every file (my fault this isn't currently like that)
- Improve the classloader to run `@BeforeClass` and `@AfterClass` code also (via flag)
- Make the classloader more fault-tolerant (such as with a non-existant test class)
- Add an option to include or exclude classes from the classloader.

I may still add some of these options, in which case I'll update this post.

Enjoy!

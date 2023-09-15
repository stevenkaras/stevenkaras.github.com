---
layout: post
title: "Google Sheets: Yet another undocumented feature"
tags: []
---
Google Sheets documentation is sorely lacking when it comes to technical accuracy.
There are many features that are underdocumented and require experimentation before they can be used reliably.
Worse, there are some that are just straight up undocumented.

This post is about one in particular: Criteria/Condition syntax for text matching in database functions.

For our example data, let's consider the recipe data they use in the official docs:


| Key | Recipe                | Tags               | Preparation | Calories | 
| --- | --------------------- | ------------------ | ----------- | -------- |
| 1   | Caprese Salad         | Vegetarian,Salad   | 5           | 200      |
| 2   | Burrito Eroica        | Meat,Texmex        | 10          | 1900     |
| 4   | Celery Rawshticks     | Vegan,Snack        | 3           | 100      |
| 8   | Linguine al Pesto     | Italian,Vegan      | 15          | 400      |
| 16  | Swiss-Mushroom Burger | Meat,American      | 14          | 700      |
| 32  | Nutella Sandwich      | Vegan              | 3           | 440      |
| 64  | Paella Valenciana     | Fish,Seafood       | 40          | 650      |
| 128 | Risotto Milanese      | Vegetarian,Italian | 30          | 600      |

# Default behavior

The default behavior for a text typed field is to do a prefix match.
This means that this query will return <span title="32+4 indicating it matched Celery Rawshticks and Nutella Sandwich only">36</span>, instead of <span title="adding 8 to indicate it matched the Linguine as well">44</span> (because the Linguine tags are ordered differently):

```
DSUM(recipes, "Key", {"Tags"; "Vegan"})
```

# Contains

It seems that they use globbing syntax for string conditions, so this gives the expected <span title="4+8+32=44 meaning it matched all 3 of the expected recipes">44</span>:

```
DSUM(recipes, "Key", {"Tags"; "*Vegan*"})
```

# Confirming the syntax

[Glob syntax][wiki-glob] has a few other features, so let's check if it's being implemented with `fnmatch(3)`:

```
DSUM(recipes, "Key", {"Tags"; "*a?e*"})
```

This returns the expected 64+128=192 as it matches on V**ale**nciana and Mil**ane**se.

[wiki-glob]: https://en.wikipedia.org/wiki/Glob_(programming)

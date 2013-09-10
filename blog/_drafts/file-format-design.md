---
title: File Format Design
layout: post
---
Code lives from version to version. Alex from TheDailyWTF pointed out that databases live beyond versions, and may indeed live throughout the lifecycle of an application. It is an easy conclusion that file formats are similar in that regard. File formats tend to fall into two categories: stream-based, variable width records, and fixed width formats. Let's examine some of the advantages of each approach, and hopefully come across some design patterns that we can reuse.

### Fixed width formats

The main advantage of a fixed width format is the ease of indexing. Meaning that we can seek to an arbitrary record number. Aside from that, when the record size is known ahead of time, we can omit that portion of the data structure, and save a marginal amount of space.

It can be useful to sort the records according to a particular field, which allows for binary searches through the data.

On the other hand, due to the rigid structure, this approach isn't appropriate for inherently variable data types, such as strings.

### Variable width formats

Variable width records are extremely useful for fluid data, such as text, or variable length lists. The primary advantage in this format is the density of data, and is appropriate for string pools.

### Stream based formats

The key difference between variable width record formats and stream formats is that stream formats don't assume all records have the same type. That is that the first record could be for a music album, and the next for a restaurant. Most text based formats fall in this category (including html).

### Hybrid formats

It is unreasonable to assume that a file format will ever have only one type of record. That means that we need to compose together in the same file many different record types, and often the need to mix fixed and variable width records will arise. For those of you who prefer to use text based formats, this isn't as relevant.

There are limits to this, however. To correctly combine different record formats, you should place the fixed width records before the variable width records. However, if you expect the variable width section to grow significantly while the fixed width sections won't, then you can reverse the entire format, and place the variable width records at the start. The fixed width records go at the end, and the entire format is read backwards.

### mmap() support

In POSIX systems, such as Android or OSX, there's a very efficient function for loading data from the disk. Windows has a comparable equivalent, and works in much the same way. The catch being that not all devices are equal. Some prefer for integers to have 4 bytes, while others prefer 8 bytes. If the format lines up with these expectations and preferences, using mmap can be much more efficient than "parsing" the file.

In order to support this, we can write our reference parser, and then add in a per-device format. When the file is received by the device, it can process the file, and save it in the optimized format. This allows us the flexibility to offer out of the box support for our format, but also allow for highly efficient indexing.

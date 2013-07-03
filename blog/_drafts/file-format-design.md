---
title: File Format Design
layout: post
---
Code lives from version to version. Alex from TheDailyWTF pointed out that databases live beyond versions, and may indeed live throughout the lifecycle of an application. It is an easy conclusion that file formats are similar in that regard. File formats tend to fall into two categories: stream-based, variable width records, and fixed width, binary formats.

Let's take for example, the case of a variable width format that holds some arbitrary data inside each record. It could take hours, if not longer, to sort, search, or work with this data. However, if we build an index of this data, that is sorted, we can do it much faster. So let's build a basic framework.

Let's break up our file into two sections. The variable width records will go at the start of the file. It's easier to modify the end of the file, so we'll add new records to the end of the variable width section, and add the fixed-width section at the end. To know where the fixed-width section starts, we'll dump some basic info into a very short header.

The general file format should look like this:

INSERT IMAGE HERE

Where the id field is the file type identifier (traditionally called a magic number). The fw_address field is the offset of the start of the fixed width record section (as a 32bit unsigned integer, stored little endian). The rest of the bytes are reserved for future use (moving up to 64 or 128 bit addresses, flags, etc.).

It's important to remember that when you're talking about a file format, it's perfectly reasonable to define a ton of reserved bytes, even if you don't think you need them. Especially if you don't think you need them. Because an extra 72 bytes may mean a lot when you are talking about a common data structure that's held in memory. The longer you expect your file format to live, the more reserved bytes you should tack on.

Let's assume that our variable width records store their length in the first four bytes, which is the length of the data in that record (meaning it does not include the first 4 bytes).

INSERT IMAGE HERE

The fixed width section has this general format:

INSERT IMAGE HERE

In the header, we

Ok, now that we've fully defined our file format, remember that it is easier (and quicker, sometimes) to store each of those sections as separate files in a zip container (which works much in the same way as this format). But by opening the black box, and looking inside, we've learned a bunch of principles that will help us in the future.

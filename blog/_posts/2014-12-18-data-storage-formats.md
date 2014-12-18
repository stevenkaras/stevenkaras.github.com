---
title: Structured Data Formats
---
Given that PostgreSQL 9.4 was released today with support for their binary JSON format JSONB, I thought it would be nice to write a quick post exploring the basic concepts in structured formats, as well as some basic principles for access languages.

# Data primitives

Let's start out with some basic definitions:

Value
: any of the below

Scalar value
: any data value, including numbers, strings, null or undefined value, etc

Set
: an unordered collection of values

Sequence
: ordered collection of values (aka array, vector, etc)

Map
: key-value store of values

Ordered Map
: a map with user-specified ordering of key-value pairs

Entity Expansion
: Also known as the source of all evil. Allows a scalar to point to another place in the data document. Support automatically qualifies a format for data bomb vulnerability potential.

# How do various formats fit this?

XML - Ordered maps, where keys are shallow ordered maps (limited to 1 level deep). Some trickery involved due to entity expansion
YAML - Ordered maps, sequences, and some of the same trickery as above for entity expansion.
JSON - Ordered maps, sequences, a few other things
JSONB - maps, sets, many scalar values are mangled
BSON - ordered maps, generally equivalent to JSON, with some specialized formats for different string types (such as digests, JS code, etc). Sequences are converted to ordered maps with numeric keys

## Data bomb vulnerability

A bunch of these formats allow self-reference, which allows the expansion of a value by replacement with another one. Smart formats will define them as references. Others, will explicitly demand that they be expanded into additonal copies. This can lead to massive memory consumption, as expansion creates extra objects, and parsers can easily crash processes by feeding in specially crafted documents ([XML Bomb](http://en.wikipedia.org/wiki/Billion_laughs))

## A note on sparse sequences

In general, sequences can be trivially converted to maps, with the keys being the indexes. This can result in a rather compact representation of sparse sequences, where many of the values are identical.

# Data Access

In general, let's define a syntax for accessing each of our primitives:

Set
: * Membership: [value] - true iff the given value is in the set
  * Collection: [] - collect all the values

Sequence
: * Reference: [index] - the value at the given index
  * Collection: [] - collect all the values

Map
: * Reference: .key - the value for the given key
  * Collection: .* - collect all the values 

Ordered Map
: Both map and sequence syntax is valid
  If there is more than one element with the same key, referencing collects all values with that key

Key Values
: An edge case that is useful for XML

  * Testing: .key{condition} - conditions are a list of 3-tuples with the key to test, the value to test against, and the test type (equality, etc).
  * Reference: .key$ - collect the key as an object
  * Collection: .*$ - collect all the keys as an object

It's important to note that collection is only valid if the values are of the same type at each stage. This allows us to traverse documents and aggregate multiple results along the way. A special exception can be made for null values, which should be ignored or cause failure (developer's choice). Similarly, type inconsistencies (such as schema violations) should result in a failed operation.

For those of you who say this is very similar to XPATH, there's a reason. It's one of the few things about XML that was well done. Unfortunately, it's still meant to work with XML, so no one has ever taken it seriously.

Some quick examples of this access:

~~~
[].like_count
result.metadata.globalCounts.count
feed.entry.author.name
~~~

These are real world examples for extracting the number of facebook likes, google+ +1s, and Atom feed authors

# Defining a new format

I'm going to spitball my own new format, which is focused on stream parsing, so the data can be parsed while it is still being transferred (and, importantly, used even if the transfer is cut off halfway):

* Values - numbers, strings (counted strings, not null-terminated)
* Every document must have a sequence at its root.
* Front-loaded sizes + keys for maps/sequences.
* Ordered maps may only use string or numeric keys.
* Sequences are packed
* Human inspectable. Not necessarily readable, but no binary integers

~~~
[2:"12"Hello, world#1
~~~
~~~
{3:"3"foo"3"bar"2"piF3.14"10"The Answer#42
~~~

This is the PEG for my format:

~~~
Document <- Value
Value <- Scalar / Sequence / Ordered Map
Scalar <- String / Number
String <- '"' Length '"' StringValue
Length <- \d+
StringValue <- characters with C-style escape sequences
Number <- '#' Integer / 'F' Float
Integer <- '0x' [0-9a-fA-F]+ / '0' \d+ / \d+
Float <- a floating point value in string form (e.g. 3.14 or 2.17e0)
Sequence <- '[' Length (number of items in sequence) ':' Value{length}
Ordered Map <- '{' Length (number of key value pairs in map) ':' KeyValuePair{length}
KeyValuePair <- Key Value
Key <- String
~~~

There is an optional extension, which adds in offsets for quick traversal within large sequences/maps:

~~~
Sequence <- ']' Length (number of items in sequence) ':' Offsets ':' Value{length}
Offsets <- Offset ( ',' Offset )
Offset <- Length (offset in bytes from the start of the values or pairs)
Ordered Map <- '}' Length (number of pairs in map) ':' Offsets ':' KeyValuePair{length}
~~~

The first offset, which will always be 0, is ommitted. Also note the different type identifiers, which allows backwards compatible parsing.

The idea being that you register handlers for components based on their access string. As the stream is parsed, handlers are called and passed values that match the access string. Please note that it is not without reason to implement stream parsers for other structured data formats with a similar API (especially given a simple way to map between formats).

# Final caveats

I haven't built any code for this system, since I just wanted to explore the concepts involved. It should be easy to generate a performant parser from the grammar I specified, although a hand-crafted one will be much more performant. The stream parser I mentioned exists for JSON in JS, it's called oboe.js. Others like it may exist.

Also, this is the first time I've ever built a PEG, so it may not be correct.

---
title: Checking Java Homework
layout: post
---
I checked homework for the course Introduction to Computer Science at [my university](http://portal.idc.ac.il/en/main/homepage/Pages/homepage.aspx) last semester. Over the course of the semester, I think I saw every anti-pattern possible in the universe in the students code. But better they make mistakes now than later, when it matters. Anyways, the course is taught in Java, and over the years, several useful methods that aid in writing unit tests have been developed. Over a weekend during my winter break, I rewrote some of those methods, made them better, and packaged them nicely in a neat little ball. Receive: the Java Grading Tools library

The idea behind the library is really simple: provide some methods to ensure compliance to an API, allow unit testing of various features that are somewhat hard to do otherwise, etc. The library currently has 2 sections:

### 1. ReflectionUtil

This is the class that houses the methods to ensure API compliance. In our course, students aren't allowed to change the APIs that we give them to implement, and this class makes writing unit tests fairly simple. Unit test examples are of course included.

### 2. IOUtil

This utility class can be used to redirect I/O from the stdin/out so that unit tests can be written even for classes in which students need to take input from the user, and output something. Of course, the entire methodology is fairly flawed unless some measure of output compliance is enforced. Otherwise the regexs will cause the TA to commit suicide (regex in Java isn't very nice, but regex isn't very nice at all).

This project is available under the GPL from [GitHub](http://github.com/stevenkaras/Java-Grading-Tools).

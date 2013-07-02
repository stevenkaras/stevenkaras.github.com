---
title: Java Typedefs
layout: post
---
So Brian Goetz, a consultant at Quiotix, wrote a [post](http://www.ibm.com/developerworks/library/j-jtp02216.html) back in 2006 about how a typical "typedef" in Java is an anti-pattern, and now many people simply link to it and take it for read that it is correct. At the time, generics were a part of the language for several years already, and programmers were beginning to write code like this:

(UPDATED)
{% highlight java %}
public class ProcessFutures extends HashMap<String, LinkedList<Future<String>>> {}
{% endhighlight %}

And while he's mostly correct in stating that this particular usage is a borderline antipattern, what it comes down to is that this usage was born out of necessity. He goes on to explain that such a class reduces maintainability, and is too "concrete". What he means by too "concrete" I have no clue. While it is true that a typedef feature is sorely needed in Java, especially since the introduction of generics, programmers are left with no other choice. And as I intend to show, any such "poor man's typedef" is reinforced by the DRY principle, the Open/Closed principle, among others.

The principle usage of a classdef, as I'll be calling them, is only within a single class or throughout a package. The problem is that the majority of programmers give these classdefs too great an access scope, rendering them as part of the public API, even. The rule that you need to follow when using such classdefs is to ensure that they are only returned by your methods, and never accepted as parameters. In general, if you're already at the point where you need to use such a complex data structure, you should probably consider boxing it inside with other, related data. This not only reduces the amount of code you need to write for method parameters, but also will make your design clearer and easier to maintain. See the difference between the first and second methods?

{% highlight java %}
public static ResultSet runTests(DataSet data, TestSuite suite) ...
public static List runTests(Map<String, String> data, List<Integer> input, List<Integer> expected) ...
{% endhighlight %}

Now, in the first method, the fact that it returns a `ResultSet` shouldn't make it less maintainable, but rather more. Because you know what you're getting back as a result, you spend less time working on the design, and a little more time realizing that `ResultSet` inherits from a `List<String>` type, so you can still just assign it a reference of that type. Or you can go the route of writing domain-style code and utilize the `ResultSet` class in your code (which in turn makes your code much easier to read). While this does place some stress upon the class system, it may preferable to declare such classdefs as final, so as to prevent an ignorant programmer (we all know a few) from making a classdef of a classdef of a classdef. There is one last note I'd like to make about the return values. I chose to return a `List` type rather than an `ArrayList` because while return types should be as specific as possible, they shouldn't be so specific as to tie the programmer into one particular implementation.

Now, it seems to me that on a design level, it's perfectly reasonable to start with the second API and migrate to the first. But I'm the bridge burning type. While it is true that the second method is far easier to work with, since there's no need to create any extra types, etc. Oh wait....you do have to work with extra types...`List<Integer>` to be exact. Which means that my choice to not create a properly designed parameter type also increases the amount of code needed to use my library. Design laziness is the real antipattern here. Not "pseudo-typedefs" or classdefs. As a matter of fact, I would encourage programmers to use and create these "pseudo-typedefs", since by simple virtue of their needing to implement ctors for any but the most basic of classes, it should occur to them that they need to either rethink their design, or actually flesh out a proper class.

There's a second technique that Brian Goetz didn't cover in his article. The struct class, as I've come to call it. It's really simple:

{% highlight java %}
public class ResultSet {
  public ArrayList<String> a = new ArrayList<String>();
}
{% endhighlight %}

Now this is a real anti-pattern. It breaks any chance of being used with polymorphism, and simply adds to the client programmer's required efforts to use your code.

Beyond that, his article goes on to discuss how typedefs are contagious. He cites that in the vast majority of C programs, there are literally hundreds of typedefs spread across dozens of header files defining and redefining simple concepts like `boolean`, `true`, `TRUE`, `False`, and `int32`. While it's quaint to remind everyone of header file hell, it misses the point that we are programming in Java, an Object-Oriented programming language. And that the majority of those redundant C header typedefs were done out of necessity, not malice. When lots of people start doing something, even when they know it's a bad idea, it should serve as a clear sign that change is needed.

So, what I propose is adding a typedef mechanism to Java. It won't serve any purpose beyond shortening the code that people write. Since this can be done at compile time, it doesn't break backwards compatibility, and without requiring any extra work on the JVM. If this mechanism isn't added, it will eventually result in programmers leaving the language in favor of more reasonable pastures.

UPDATE:

I've thought of another reason why the classdef is truly useful. Aside from simply shortening the code that a programmer needs to write, it also reduces the Javadoc. This is because Javadoc automatically uses the fully qualified names. Which means if you are developing a package, it will simply name your class. But if you are using `Map<String, LinkedList<String>>`, this gets turned into `java.util.Map<java.lang.String, java.util.LinkedList<java.lang.String>>`. So to reiterate my stance on classdefs: Acceptable, but only as return values, internal code. If you want to write a method that takes a classdef as a parameter, then you should turn it into a real class.

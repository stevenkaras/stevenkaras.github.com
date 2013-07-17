---
title: The Elder God's Regex Library
layout: post
---
As some people have pointed out, writing a regular expression to parse some of the more complicated grammar's we use when developing is a good way to summon the elder gods. So I created this page to serve as a peek into the various regex spells that can be used to awaken the Old Ones that slumber beneath the sea in R'lyeh. All the examples are from Ruby, but are easy enough to translate to PCRE/PHP/Perl/C#/etc.

### String literals on one line:

{% highlight ruby %}
/^" ([^"\\]* | \\ ["\\bfnrt\/] | \\ u [0-9a-f]{4} )* "$/x
{% endhighlight %}

### JSON:

{% highlight ruby %}
%r{
    (?<number>    -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? ){0}
    (?<boolean>   true | false | null ){0}
    (?<string>    " ([^"\\]* | \\ ["\\bfnrt\/] | \\ u [0-9a-f]{4} )* " ){0}
    (?<array>     \[  (?:  \g<json>  (?: , \g<json>  )*  )?  \s* \] ){0}
    (?<pair>      \s* \g<string> \s* : \g<json>  ){0}
    (?<object>    \{  (?:  \g<pair>  (?: , \g<pair>  )*  )?  \s* \} ){0}
    (?<json>      \s* (?: \g<number> | \g<boolean> | \g<string> | \g<array> | \g<object> ) \s* ){0}
  \A \g<json> \Z
}ix
{% endhighlight %}

### Java 1.7:

{% highlight ruby %}
%r{
    (?<identifier>   \g<IDENTIFIER> ){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
    (?<>){0}
}x
{% endhighlight %}

### A Regex for A Regex

For single line regexes:

{% highlight ruby %}
%r{
    (?<group>    \( (?: \? (?: :| ! | omix) | [^?]) \)){0}
    (?<metachar> \\ (?: \( | \) | \[ | \] | \{ | \} | \. | \? | \+ | \* | \\)){0}
    (?<modifier> i | m | x | o){0}
}x
{% endhighlight %}

> ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn
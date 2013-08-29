---
title: The Elder God's Regex Library
layout: post
---
As [some people have pointed out](http://stackoverflow.com/a/1732454), writing a regular expression to parse some of the more complicated grammar's we use when developing is a good way to summon the elder gods. So I created this page to serve as a peek into the various regex spells that can be used to awaken the Old Ones that slumber beneath the sea in R'lyeh. All the examples are from Ruby, but are easy enough to translate to PCRE/PHP/Perl/C#/etc.

### String literals on one line:

{% highlight ruby %}
/^" ([^"\\] | \\ ["\\bfnrt\/] | \\ u\h{4} | \\ [0-7]{3} | \\ x\h{2} )* "$/x
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

### A Regex for A Regex

This matches most single line regular expressions. It isn't perfect (note the improper handling of noncapturing group prefixes), but it is a starting point, and shows how complex our regular expression syntax is!

{% highlight ruby %}
%r{
    (?<group>       \( (?: \? (?: \g<modifier>*: | ! | = ) | ) \g<root>* \) ){0}
    (?<modifier>    i | m | x | o ){0}
    (?<escaped>     \\ (?: \( | \) | \[ | \] | \{ | \} | \. | \? | \+ | \* | \\ | \/ )){0}
    (?<raw>         [^\\\(\)\[\]\{\}\?\+\*\/]){0}
    (?<class>       \[ \^? \g<raw>+ \] ){0}
    (?<matcher>     \g<escaped> | \g<raw> | \g<class> ){0}
    (?<anchor>      \\ (?: A | z ) | \^ | \$ ){0}
    (?<quantifier>  \? | \* | \+ | \{ \d+ (?: , (?: \d+ ) )? \} ){0}
    (?<root>        \g<matcher> \g<quantifier>? | \g<anchor> | \g<group>\g<quantifier>? ){0}

    \A\/ \g<root>* \/ \g<modifier>*\z
}x
{% endhighlight %}

### XML:

XML 1.1 (from the [standard](http://www.w3.org/TR/xml11/))

This one frustated me a bit. Turns out the W3C uses SEBNF, which includes some confusing syntax. In general, you can replace a rule with a call to the relevant group, and exclusion groups into negative lookaheads.

{% highlight ruby %}
%r{
  (?<document>        (?! \g<Char>* \g<RestrictedChar> \g<Char>* )
                      \g<prolog> \g<element> \g<Misc>* ){0}
  (?<Char>            [\u{1}-\u{d7ff}] | [\u{e000}-\u{fffd}] | [\u{10000}-\u{10ffff}] ){0}
  (?<RestrictedChar> [\x01-\x08] | [\x0b-\x0c] | [\x0e-\x1f] | [\x7f-\x84] | [\x86-\x9f] ){0}
  (?<Whitespace>      [\x20\x09\x0d\x0a]+ ){0}
  (?<NameStartChar> : | [A-Z] | _ | [a-z] | [\xc0-\xd6] | [\xd8-\xf6] | [\u{f8}-\u{2ff}]
    | [\u{370}-\u{37d}] | [\u{37f}-\u{1fff}] | [\u{200c}-\u{200d}] | [\u{2070}-\u{218f}]
    | [\u{2c00}-\u{2fef}] | [\u{3001}-\u{d7ff}] | [\u{f900}-\u{fdcf}] | [\u{fdf0}-\u{fffd}]
    | [\u{10000}-\u{effff}] ){0}
  (?<NameChar>       \g<NameStartChar> | - | \. |  ){0}
  (?<Name>           \g<NameStartChar> (?:\g<NameChar>)* ){0}
  (?<Names>          \g<Name> (?: \x20 \g<Name>)* ){0}
  (?<NameToken>      \g<NameChar>+ ){0}
  (?<NameTokens>     \g<NameToken> (?: \x20 \g<NameToken>)* ){0}
  (?<EntityValue>    " ([^%&"] | \g<PEReference> | \g<Reference>)* "
    |                ' ([^%&'] | \g<PEReference> | \g<Reference>)* ' ){0}
  (?<AttValue>       " ([^<&"] | \g<Reference> )* "
    |                ' ([^<&'] | \g<Reference> )* ' ){0}
  (?<SystemLiteral>  " [^"]* " | ' [^']* ' ){0}
  (?<PubidLiteral>   " \g<PubidChar>* " | ' (?: (?! ' ) \g<PubidChar> )* ' ){0}
  (?<PubidChar>      \x20 | \x0d | \x0a | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%] ){0}
  # CharData is a problem to parse. I'll have to think about how to go about fixing this.
  (?<CharData>       [^<&]* (?= \]\]> ) ){0}
  (?<Comment>        <!-- ((\g<Char> - -) | (- )) -->)

  # you can continue this one on your own, but I'm calling it quits here. The grammar isn't specified in a manner that makes it easy to translate to the regexp syntax
}
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
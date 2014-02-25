---
title: Require paths in Ruby
layout: post
---
Ruby is a fun language. But in all that fun, sometimes we get a little excited and forget to be rigorous. Specifically, I'm referring to require paths, which are far too often neglected, and can cause all sorts of headaches when dealing with multiple versions, etc.

The general rule of thumb is that only the first require call should be abstract. After that, once you're inside your gem/app, all the requires should be relative to the current file.

## Unqualified require

Let's take for example a gem with an executable. As a developer of this gem, I'd like to test the executable and ensure that it's working as expected. However, I'm also a consumer of the gem (it's installed). Let's call our gem "foobar". That means that the bin/foobar file:

{% highlight ruby %}
#!/usr/bin/env ruby

require 'foobar'

Foobar::CLI.new.start
{% endhighlight %}

Would always grab the installed gem version. There are a couple of different ways to address this:

- be lazy and version bump to test
- add the local "lib" folder to the load path: `$: << File.expand_path("../../lib", __FILE__)`
- prepend the local "lib" folder to the load path: `$:.unshift File.expand_path("../../lib", __FILE__)`
- require the foobar file directly

## Being lazy

I'm a strong advocate for laziness. I also advocate anything that encourages being lazy. But in this particular case, laziness causes problems. The commit history of your project becomes polluted with tiny version bumps, or you have a rake task to bump, build and (re)install the gem locally.

The real victim here is yourself. The added time of rebuilding the gem, uninstalling the current version, then reinstalling your latest build adds up quickly. It means another 5 seconds before you can start testing your gem. Every experienced developer knows that any build that takes longer than 10 seconds can easily result in more time lost to Facebook, Reddit, and other Internet Pleasures (TM).

So do yourself a favor, don't be lazy. Just this once.

## Modifying the load path

Changing the load path is generally regarded as a "bad thing". It causes every subsequent require statement to take just that much longer, it's sloppy, and it pollutes the namespace. Worse, if you don't prepend the local lib folder, it won't even work when you're developing a gem locally.

In general, I strongly recommend avoiding runtime hacks like this. It may be "neat", but we have Rubygems to manage our load path for a reason. Let it do it's thing, and we'll all get along just fine.

## Require the file directly

This is the solution I'd recommend. The philosophy of this approach is that once we've found our way into the gem folders, we've already done the resolution required of Rubygems or Bundler or whatever. That means that from that point onwards, we just require the files directly, with a full path.

Let's use our foobar gem as an example:

bin/foobar:
{% highlight ruby %}
#!/usr/bin/env ruby

require File.expand_path("../../lib/foobar", __FILE__)

Foobar::CLI.new.start
{% endhighlight %}

lib/foobar.rb:
{% highlight ruby %}
class Foobar
  def foo(arg)
  end
end

%w{ bar }.each do |lib|
  require File.expand_path("../foobar/#{lib}", __FILE__)
end
{% endhighlight %}

lib/foobar/bar.rb:
{% highlight ruby %}
class Foo::Bar
  def bar
  end
end

%w{ baz }.each do |lib|
  require File.expand_path("../bar/#{lib}", __FILE__)
end
{% endhighlight %}

### Ruby 2.0

Much as I wish that everyone would use up to date versions of Ruby, there are many companies that still use older 1.8.7 and 1.9.3 versions in production. But if you're lucky enough to be able to dictate the Ruby syntax used by your gem, then you can use the `__dir__` shortcut and cut out one of the `..` path components:

{% highlight ruby %}
require File.expand_path("../lib/foobar", __dir__)
{% endhighlight %}
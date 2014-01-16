---
title: Library Development in Ruby
layout: post
---
We can't always develop Object Oriented libraries with beautiful objects floating around inside our memory space. Sometimes, we have to develop procedural libraries (or are tasked with improving existing code). In order to organize these libraries better, we usually end up combining related functions into modules. This has two major advantages, one of which is the documentation looks a lot better, and the second is that it forces us to think about how to go about organizing our code. But in order to maintain the API to our code, we need to ensure that all these functions are still available to the top level namespace. Here's how we can go about doing that.

## First steps

Depending on the size of your library, you'll either be able to squeeze all your functions into one module, or you'll need to create a hierarchy. Let's handle the simple case first, and then describe how to build on top of that to handle the hierarchy.

This is how you'd handle the simple case:

{% highlight ruby %}
module Foo
  def hi
    puts "hello"
  end
end
self.extend Foo unless self.include? Foo
{% endhighlight %}

You can swap out extend for include or prepend if you prefer (or have a specific reason why). This exposes the "hi" function to the top level namespace, while allowing us to organize our code a little bit. After a while, you can deprecate the top level usage, and mandate that users include the module themselves, and finally transition into a full-fledged library.

## Larger hierarchies

If, however, you're inheriting a larger legacy codebase with a lot of top level functions, you can start by splitting them up into different files (I can't stress how important this step is). Next, you'll want to organize them into a hierarchy of modules, but in order to do that, you'll need some boilerplate code:

{% highlight ruby %}
module Foo
  def self.register_module(mod)
    @modules ||= []
    @modules << mod
    @base_includes.each do |base|
      base.send :include, mod
    end if @base_includes
    @base_extends.each do |base|
      base.send :extend, mod
    end
    @base_prepends.each do |base|
      base.send :prepend, mod
    end
  end

  def self.included(base)
    @base_includes ||= []
    @base_includes << base
    @modules.each do |mod|
      base.send :include, mod
    end if @modules
  end

  def self.extended(base)
    @base_extends ||= []
    @base_extends << base
    @modules.each do |mod|
      base.send :extend, mod
    end if @modules
  end

  def self.prepended(base)
    @base_prepends ||= []
    @base_prepends << base
    @modules.each do |mod|
      base.send :prepend, mod
    end if @modules
  end
end

module Foo::Bar
  def hi
    puts "hi"
  end
end
Foo.register_module(Foo::Bar)

self.extend Foo unless self.include? Foo
{% endhighlight %}

From here, it's a matter of organizing your code better, improving documentation, and eventually deprecating the top level usage.

## Identifying invalid usage

This is a much more complicated topic, since it ties in directly with modeling the entire type system of your client applications in runtime. Since chances are if you inherited a legacy system, they did some sort of funny business that changes modules at runtime, you'll be better suited by a quick script to highlight unqualified usage of methods in classes that don't include the owner module. Here's a sample one:

{% highlight ruby %}
require 'thunder'

class DeprecatedMethodUsage
  include Thunder

  default_command :find_usage

  desc "find_usage MODULE METHOD [PROJECT_ROOT]"
  def find_usage(modulee, method, project_root = ".")
    Dir["#{project_root}/**/*.rb"].each do |file|
      contents = File.read(file)
      # check if the module is included in this file
      if contents =~ /include\s+#{modulee}/
        puts "#{File.basename(file)} included #{modulee}"
        next
      end

      # look for unqualified invocations of the method
      line_num = 0
      contents.lines.each do |line|
        line_num += 1
        if line =~ /(?<!\.)#{method}/
          puts "#{file}:#{line_num}"
        end
      end
    end
  end
end

DeprecatedMethodUsage.new.start
{% endhighlight %}

That can be improved by leaps and bounds to ignore quoted strings, and apply heuristics if it is being invoked on another object or the module directly.
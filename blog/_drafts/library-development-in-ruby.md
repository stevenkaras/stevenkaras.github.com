---
title: Library Development in Ruby
layout: post
---
We can't always develop Object Oriented libraries with beautiful objects floating around inside our memory space. Sometimes, we have to develop procedural libraries (or are tasked with improving existing code). In order to organize these libraries better, we usually end up combining related functions into modules. This has two major advantages, one of which is the documentation looks a lot better, and the second is that it forces us to think about how to go about organizing our code. But in order to maintain the API to our code, we need to ensure that all these functions are still available to the top level namespace. Here's how we can go about doing that.

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
Now that we have this, the question is how to extend this for a more complicated hierarchy. This requires our code to change to the following:

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

Also, keep in mind that there's a good chance you'll move `Foo::Bar` into its own file, and start organizing your library more like a gem.
---
title: Fun with method dispatch in Ruby
layout: post
---
I got bored today waiting for my code to compile, and wrote a mixin that enables declarative programming in Ruby. Given Ruby's functional roots, this gives Ruby a very different feel, and really just made me feel like it should be part of the language. Surprisingly, this little mixin is just that. Little.

I started this project knowing what I wanted it to do, and how I wanted the result to look like (always a good approach, in my experience). Once I finished the code (well after my compile had finished), I was pleasantly surprised to see that all the code for the gem fit onto one screen (albeit without some essential features).

Ruby's open nature is what allowed me to change the behavior of method declaration in a quick and simple manner. It did allow me the chance to poke around a bit with the internal workings of Ruby's object model, and the changes introduced in Ruby 2.0. Specifically, how there is no longer a single callback for when a module is either included or prepended (those are separate callbacks). Meaning that if you have code that needs to affect the receiver (such as adding in class methods), you should add a call from both callbacks to a helper method.

My approach to adding prerequisites to methods was to brute force them in. Meaning that when a method is declared, I immediately alias it, and redefine it with some stub code that calls the prerequisites prior to the method itself. From here, I still need to add "flags" for each method, so that methods aren't called more than once, then add the ability to call methods in other classes, and finally add the ability to add calls to methods with parameters.

The syntax is extremely simple, with no added frills:

{% highlight ruby %}
class Example
  include Ladder

  def pre
    puts "in pre"
  end

  needs :pre
  def declared
    puts "in declared"
  end
end
{% endhighlight %}

Here's the mixin source:

{% highlight ruby %}
# Provides a simple API for declaring method dependencies
module Ladder
  # @api private
  # Automatically extends the singleton with {ClassMethods}
  def self.included(base)
    base.send :extend, ClassMethods
  end

  # @api private
  # Automatically extends the singleton with {ClassMethods}
  def self.prepended(base)
    base.send :extend, ClassMethods
  end

  # This module provides methods for any class that includes Ladder
  module ClassMethods

    # @api private
    # Get the ladder configuration
    def ladder
      @ladder ||= {
        :commands => {}
      }
    end

    # @api private
    # Registers a method as a ladder method
    def method_added(method)
      return unless ladder[:next]
      ladder[:commands][method] = ladder[:next]
      ladder[:next] = nil
      alias_method "__ladder_#{method}", method
      define_method method do |*args|
        self.class.ladder[:commands][method][:needs].each do |need|
          self.send(need)
        end
        self.send "__ladder_#{method}", *args
      end
    end

    # Declare that the next method defined needs another method/s executed beforehand
    #
    # @param prereqs [<#to_s>] list of the needed methods
    def needs(*prereqs)
      ladder[:next] ||= {
        :needs => []
      }
      ladder[:next][:needs] |= prereqs.map(&:to_s)
    end
  end
end
{% endhighlight %}
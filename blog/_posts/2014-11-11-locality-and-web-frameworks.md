---
title: Locality and Web Frameworks
layout: post
---
Locality is probably my favorite principle of all time. It's the concept that when related things are closer together, they're easier to manipulate. It's the reason why CPUs are able to optimize a lot of work so they don't need to hit the disk or even the main memory. It's also why I advocate a slightly different way of organizing files than most frameworks. I'll lay down here what I consider to be the best way to go about organizing these files, and also provide a link at the end to a reference implementation of a framework that supports this.

# Program component organization

The crux of the issue is that most frameworks organize their components in the following manner:

- app
  - controllers
    - controller A
    - controller B
  - models
    - model A
    - model B
  - views
    - views for A
      - view A1
      - view A2
    - view B
  - ...

Which leads to the problem that if you want to remove component B from this app, you need to touch at least 3 different directories. All I'm proposing is that we slice the knife a little differently to support more natural operations on components. This, of course, supposes that the basic unit of an application is a component, and that we would want to operate on all aspects of a component at the same time. As such, I would suggest organizing the files like this:

- app
  - component A
    - controller
    - views
      - view A1
      - view A2
    - model
  - component B
    - controller B
    - model
    - view

The idea being that if a component is sufficiently complicated, you can still support multiple aspects without sacrificing an easy way to move components between applications (imagine only needing to copy over the folder to add user management to an application). This system of organization can be extended to allow components to be nested inside one another, should the need arise.

The primary advantage of this system is that it forces developers to isolate their components, and encourages good application architecture. Detractors will claim that this limits system cohesion and encourages inconsistency between components, but I've seen enough code to know that it takes a lot of effort to ensure consistency among components, and junior developers need more support with design rather than consistency.

Another advantage is the ability to keep components in separate source control repositories and use various methods (svn externals, git submodules, etc) to bring them together.

# Current state of support

I'm not big on Python, so someone else will have to inform you how well this approach is supported there

## Ruby

Sinatra can support this approach fairly easily, but doesn't provide much in terms of services. Ruby on Rails has begun to walk down this path with Rails Engines, but they're relatively new, and still provide far too much complexity inside a component.

# My framework

These are the basic services I would expect a web framework to provide before I'd be willing to use it:

* Template rendering (by plugin, ideally)
* Request Routing
* Database design management
* ORM
* Code generation for common tasks

Since I'll be building it in Ruby, I can get most of those at little cost (or for free). But again, this is only going to be a reference implementation, and it can be done in any language, with any number of extra features baked in already.

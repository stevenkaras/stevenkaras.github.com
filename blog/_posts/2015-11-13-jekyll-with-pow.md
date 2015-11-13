---
layout: post
title: Jekyll with Pow!
tags: []
published: True

---
I've found it to be more and more of a pain to quickly write something, want to see how it'll look as HTML, and become frustrated to find out that I write so infrequently that my blog isn't running as a server. So I set out over the last 30 minutes to set up Jekyll to play nicely with POW!

The first problem I ran into was that POW! doesn't find the rvm gemset properly. In fact, their docs still discuss using a .rvmrc, which was deprecated quite a while ago now. POW! has deprecated the .rvmrc, but they also don't use .ruby-version and .ruby-gemset properly yet. In any case, here's the setup:

Gemfile:

{% highlight ruby %}
group :development do
  gem "rack-jekyll"
end
{% endhighlight %}

config.ru:

{% highlight ruby %}
require "rack/jekyll"
run Rack::Jekyll.new(config: "_config_development.yml", force_rebuild: true, auto: true, show_drafts: true)
{% endhighlight %}

.powrc:

{% highlight bash %}
if [[ -f "$rvm_path/scripts/rvm" && -f ".ruby-version" ]]; then
  source "$rvm_path/scripts/rvm"

  if [[ -f ".ruby-gemset" ]]; then
    rvm use $(cat .ruby-version)@$(cat .ruby-gemset)
  else
    rvm use $(cat .ruby-version)
  fi
fi
{% endhighlight %}

The good news is that this will only start the blog for 15 minutes at a time before killing it, so I don't need to worry about it taking up a ton of battery power when I'm not writing.

The only drawback to this approach is that it only works for Rack servers. I'd strongly prefer a generic service monitoring service, that would take in pairs of command lines and ports to proxy requests for, and automatically have it send SIGTERM to a service that hasn't received any requests for a few minutes. But that's a huge project for another day.

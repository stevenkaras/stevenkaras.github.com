---
title: Advanced Blogging with Jekyll
layout: post
---
Since leaving my job to do consulting, I've had the opportunity to write a lot more blog posts, and have made a goal of writing at least one a week. Practicing writing is the best way to improve my writing, and I'm committed to improving my communication skills (extremely important as a consultant). So far, I've had some weeks where I forget altogether, but for the most part, I've prepared a few drafts, and am slowly releasing them. But more importantly, it's also forced me to consider the blogging platform itself, and how to improve it. I'll cover a few of the more advanced tricks that I didn't cover in my last post on using [Jekyll on Github Pages][blogging-with-jekyll].

## Analytics

I use Google analytics, but I haven't done much more than simply set up basic reporting. I'll probably do a more indepth post on analytics once I have more than 1 daily visitor (not enough to do even basic statistics on). I'd suggest putting the analytics code into a include file, so you can drop it into multiple layouts easily. It's driven by a small amount of config values that go in your `_config.yml` file:

{% highlight html %}
{% raw %}
{% if site.analytics.enabled %}
{% endraw %}
<!-- Google Analytics -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', '{%raw%}{{ site.analytics.property_id }}{%endraw%}', 'auto');
ga('send', 'pageview');

</script>
<!-- End Google Analytics -->
{% raw %}
{% endif %}
{% endraw %}
{% endhighlight %}

Then include this in your layouts:

{% highlight html %}
{% raw %}
{% include analytics.html %}
{% endraw %}
{% endhighlight %}

## Development Configuration

Now that we're playing around with analytics, we can actually do damage (false positives/views) by opening the site locally, which you'll probably do many times when writing or improving the infrastructure. So that means maintaining a separate configuration file. I just called mine `_config_development.yml` and it sits alongsite the normal, production one. When I'm working locally, I point jekyll at the development configuration by running this command:

```
bundle exec jekyll serve --watch --drafts --config _config_development.yml
```

Well, that's kinda a lie. I wrote a script that sits in the tasks folder of my blog folder. So when I want to run the local server, I run `_tasks/serve`. But the heart of the script is that line.

## SEO

Analytics aren't really useful without visitors to read the posts, so we'll want to do some basic SEO. This means making the site a bit more "Google"-friendly. For the most part, this means using the webmaster tools to check your site and fixing any glaring issues. You can also do some more aggressive SEO, like guest authoring posts, and asking for links, but I'm lazy, and I'd rather build a reputation slowly. I might link this post on a smaller subreddit to drive some traffic, however little to my blog (as an experiment).

For the most part, Github Pages does a great job serving up the site, with one minor caveat that the cache settings are too short for Google's liking, so you'll be penalized for page speed on those. That having been said, there are a few things we can do on our end to improve the page speed, which is a large factor in improving the page score.

### Combining CSS

The easiest thing we can do is combine multiple css files into one. This is especially useful if we're using a theme that has multiple css files to start out:

{% raw %}
    ---
    ---
    {% include css/base.css %}
    {% include css/highlight.css %}
{% endraw %}

### Asynchronous CSS

The recommended solution uses Javascript, which means that anyone browsing with Javascript disabled, which is common in some circles, will not see a styled version of our site. So I've studied how to get the best of both worlds. Non-blocking CSS, with graceful degredation for browsers that don't support JS, or have it turned off for personal or security reasons.

The trick is to use two methods: first, we put in the stylesheet at the end of our document, past the closing html tag. Wrap it in a noscript tag, which will only activate when Javascript is disabled:

{% highlight html %}
<noscript><link rel="stylesheet" href="combined.css"></noscript>
{% endhighlight %}

But also include this at the end of the body:

{% highlight html %}
<script type="text/javascript">
var stylesheet = document.createElement('link');
stylesheet.href = '/css/combined.css';
stylesheet.rel = 'stylesheet';
stylesheet.type = 'text/css';
document.getElementsByTagName('head')[0].appendChild(stylesheet);
</script>
{% endhighlight %}

That will make it asynchronous for anyone using Javascript, although the rest will be stuck with the slower blocking code. The only way to make that asynchronous would increase the number of requests just for the CSS to 2 or 3, which is an unacceptable performance penalty.

### Google Authorship

Google really wants to push Google+, so let's play ball and hope they reward us a little. Basically, what they want us to do is add a link to my Google+ profile with `?rel=author` tagged on the end of the href, and that's all.

## What's next?

I'll continue to improve my platform as I write more, and I'll continue to write posts about how I improve my platform.

[blogging-with-jekyll]: {% post_url 2013-12-11-blogging-with-jekyll %}
---
title: Blogging with Jekyll
layout: post
---
There are already a multitude of guides on how to convert your blog to Jekyll. This is mine. I've been working on my blog for a while now and have pushed support for various things such as feeds, basic SEO and emphasize having a clean design. Here's how I did it (with links to the sources).

The main features that I've built in recent time have been focused on increasing visibility for my blog, and ensuring it works on a wider variety of devices. Here's the quick list of features that I've added:

* [RSS/Atom Feeds](#feeds)
* [Sitemap](#sitemap)
* [Mobile compatible layout](#layout)
* [Google +1](#plusone)

# First, some history

I've been using various blogging platforms and have moved back and forth from maintaining individual posts over time to writing posts at 3am and publishing without checking, to revising them several times before finally publishing them. This particular site is merely the latest incarnation of my blog, although I did put forth the effort to transfer most of my content to here prior to shuttering my old blog.

When I launched this site, I wanted it to look good. Not great, but good. That meant targeting mobile devices, reducing the graphic intensity of the design, and making it generally easier to consume the content I create. So I picked a [layout](https://github.com/orderedlist/minimal) I knew looked good, and didn't use any javascript. I needed to make a few modifications to make it appropriate for use as a Jekyll template for a blog, rather than a project page. Notably, I changed around the nav sections to include a collapsable section to list recent posts, if there is sufficient space to display it. There were several other minor changes I made, mostly around improving the appearance on smaller screens.

From there, it was a matter of adding features that would help improve my blog's visibility. Sitemaps were first, based off [Tobias' post](http://vvv.tobiassjosten.net/jekyll/jekyll-sitemap-without-plugins/). After that I started building [Atom](https://github.com/plusjade/jekyll-bootstrap/blob/master/atom.xml) and [RSS](https://github.com/snaptortoise/jekyll-rss-feeds/blob/master/feed.xml) feeds. I made a few minor changes, such as splitting the feeds into reusable layouts. Not sure if or how I'll end up using that, but at least I have it now.

From there, it was about adding social features that would increase the chances of someone wanting to share one of my posts (or at least make it look more "professional"). I've got a +1 button now, but I'm wondering whether or not I want to put forth the effort to make it work with other networks.

All that's left is SEO and analytics. Huzzah!

## RSS/Atom Feeds      {#feeds}

[RSS feed of my posts](http://github.com/stevenkaras/stevenkaras.github.com/blob/master/blog/rss.xml) with it's [corresponding layout](http://github.com/stevenkaras/stevenkaras.github.com/blob/master/_layouts/rss.xml)

[Atom feed of my posts](http://github.com/stevenkaras/stevenkaras.github.com/blob/master/blog/atom.xml) with it's [corresponding layout](http://github.com/stevenkaras/stevenkaras.github.com/blob/master/_layouts/atom.xml)

## Sitemap             {#sitemap}

[Sitemap source](http://github.com/stevenkaras/stevenkaras.github.com/blob/master/sitemap.xml)

## Adaptive layout     {#layout}

I based my design on the minimal theme for github pages, although with some rather massive changes. The trick here is to use some advanced CSS selectors that allow you to test the media width. See the [source](http://github.com/stevenkaras/stevenkaras.github.com/blob/master/css/base.css#L178) for details.

## Google +1           {#plusone}

This was a simple matter of adding the requisite code from Google. They actually make this very easy, although their code is extremely kludgy, and uses tables heavily (turning on the 3D visualizer in Firefox is enlightening)
---
title: "New domain: karas.io"
layout: post
---
I recently decided that the time has come for me to register my personal domain and start moving my online presence onto a more self-hosted platform. I'm going to share some of the process, and my plans for the future.

# Choosing a domain

I thought I'd try grabbing karas.com, but my family name is too common, and it's been grabbed by those quasi-squatters who sell you email addresses for 50 bucks a pop.

Then I thought about getting kar.as, as a sort of domain hack, but it's been registered for many years by an Austrian doctor with no contact info, and the registry didn't even respond to my whois request.

I've always been fond of the .io ccTLD, which made the decision easy when I saw that karas.io was free for registration.
I shopped around a little bit, and found out the official NIC costs about three times as much as you can find elsewhere.

# Migrating the blog

## URL migration

I got lazy and did not put in support for migrating the canonical URLs for my posts, which resulted in Feedio detecting duplicate posts. It's a small amount of ugly I'll just have to live with, and I'm ok with that.

# Cloudflare

Github doesn't support SSL termination for CNAMEs, so you need to handle the SSL termination on your own.
Step in Cloudflare, who offer as part of their free tier support for exactly that.
I had some reservations about using Cloudflare for multiple reasons.
First, they made a rather public statement that they don't truly support free speech, and went so far as to "kick someone off the internet".
Second, they provide zero recourse for investigating why a connection was blocked; even after turning the "security" settings ostensibly off.
However, they do provide the easiest service, and I'm willing to live with that.
Please note that I've turned off as much of their filtering as I was able to, so you should be able to browse my blog with Tor,
or scrape it if you please.

# The future

I took out a server on Scaleway a while ago, and have started using it as target practice for various DevOps tools.
I'm taking it slowly though, and I want to find the absolute best tools for the job. In some cases, that can mean waiting for those tools to exist.

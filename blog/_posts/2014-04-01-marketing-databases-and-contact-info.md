---
layout: post
title: Marketing Databases and Contact Info
---
A recent project of mine tracks contact information for an alumni organization. I thought I'd share some of how I build this system, to help out anyone else facing a similar situation. First some background; the alumni organization has historically worked with spreadsheets passed between volunteers and employees. Over the years, this has lead to a schema crisis, as not all lists use the same column names, and some lists lack some or most information (in one case, it was literally just a list of names).

About two months ago, I started designing a proper system for them. One that would replace Excel and bring them into the modern era. But one of the greatest challenges that I faced while doing so was correctly capturing the contact information for the alumni. In this case, program members are asked to provide contact information prior to their participation, and are contacted once every year or two to update it. However, these contact details can only be used for administrative purposes, unless they opt in for marketing. Importantly, when they are asked to update their details, they need to opt out rather than opt in for marketing emails.

In this specific case, marketing materials is really a monthly newsletter. However, this raises some other concerns, such as what the best email is to contact someone at. To support this, and also store all the prior history (important for legal purposes), we need to decouple the concept of a person and their contact details. This can mean that a single person can have zero or more emails, phone numbers, mailing addresses, and social media accounts (such as Facebook, Twitter, LinkedIn, etc).

So the schema I built looks like this:

Note: The Phone, Address, and SocialLink tables look very similar to the Email table, and are omitted for brevity.

<pre>
OriginSystem:
  text name
  text organization
  boolean allow_marketing

Email:
  text email
  text label
  Person person
  OriginSystem origin_system
  text origin_system_record
  date valid_start
  date valid_end
  date opt_out_date
  text opt_out_channel
  date opt_in_date
  text opt_in_channel

Person:
  text name
  OriginSystem origin_system
  text origin_system_record
  Email best_email
</pre>

We can break up the email table's columns into groups that support the following features:

- [Origin tracking](#origin-tracking)
- [Expiration](#expiration)
- [Opt-in/out](#opt-in-out)
- [Preferred contact method](#preferred-contact-method)

## Origin Tracking {#origin-tracking}

We consider each spreadsheet to be a separate system, and the row a record was extracted from is considered to be the origin_system_record. This allows us to come back in the future and include additional information from that same system, without interfering too much. It also means we can track where contact details came from, for both legal and data quality purposes.

Imagine a situation where an intern purchased a list of potential donors to your charity, but lacking experience, wound up with a horrible list of people who aren't interested. By tracking the origin, you can see if the company you purchased that list from has provided you with bad lists in the past, and renegotiate terms if the quality has decreased. Origin tracking is the was to solve this situation.

Note that each origin system has a boolean marker if marketing is allowed. This is actually a 3-state attribute, since in some cases, the answer is neither yes nor no. An alternative implementation would be to have two fields: allow_marketing and disallow_marketing (at most one of which should be true). However, I feel that utilizing the NULL value of a database field is the appropriate value and the one most expected by a programmer.

## Expiration {#expiration}

Over time, people change phone numbers, emails, even Facebook accounts. In the extreme, I have seen a good friend change his email 5 times over a period of several years. By tracking when a particular email is valid, you can ensure that you have the correct email for them, and store the history for data mining or legal purposes.

We can classify emails as being valid if the valid_end date is NULL, and expired if that attribute is populated

## Opt-in/out {#opt-in-out}

This feature is a bit complex. Sometimes, a generic opt-in is given for a particular origin system (such as a contact list acquired through a third party). However, someone can opt out from being contacted in several different ways, and it's up to you (and your local legislation) to determine if that opt-out applies only to the particular contact detail, or the person in general. You also want to track how they opted in/out for analytics purposes. If a lot of people are opting out because your unsubscribe link is right next to the "Donate Now!" button, then you should have yet another way to learn that that's a bad idea.

Pseudocode for a person-scope opt-in/out:

    if email.person.emails.max_by { |email| email.opt_out_date } > email.person.emails.max_by { |email| email.opt_in_date }
      # they're opted out of marketing emails
    elsif email.origin_system.allow_marketing.false? && email.opt_in_date.nil?
      # they haven't opted in, and we can't send them marketing emails from here
      # If your lawyers say yes, then you can send them an opt-in email
    else
      # it should be ok to contact them in this case

## Preferred contact method {#preferred-contact-method}

This one is a bit more complex, and easier to envision with phone numbers. Some people prefer to be called at home, or at work, or on their mobile phones. It is up to you to track how they'd like to be contacted.
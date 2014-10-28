---
title: Validating Email Addresses
---
A quick discussion of how to detect invalid email addresses, in several ways, and how to combine them into a system for reducing invalid addresses from entering your system and negatively impacting our sender reputation.

# Detecting invalid addresses

## Lexical structure (Looks like a duck)

The first thing we want to verify is that this is something that could possibly be a valid email address. At least from a lexical point of view. The proper tool for this is regular expressions, which thanks to modern technology are actually readable now.

{% highlight ruby %}
# Note that obsolete syntax support has been stripped
%r{
  # From RFC 5322 s 3.2.1
  (?<quoted-pair>     \\ [\x21-\x7e \t]){0}

  # From RFC 5322 s 3.2.3
  # NOTE: Omitting CFWS patterns
  (?<atext>           [a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~\u007f-\uffff]){0}
  (?<atom>            \g<atext>+){0}
  (?<dot-atom-text>   \g<atext>+ (?:\. \g<atext>+)*){0}
  (?<dot-atom>        \g<dot-atom-text>){0}
  (?<specials>        [()\[\]<>:;@\\,."]){0}

  # Derived from RFC 1034 s 3.5
  (?<domain>          \g<label> (?: \. \g<label>)*){0}
  (?<label>           [a-zA-Z] (?: \g<ldh-str> [a-zA-Z0-9])? ){0}
  (?<ldh-str>         [a-zA-Z0-9\-]*){0}

  # From RFC 5322 s 3.4.1
  (?<addr-spec>       \g<local-part> @ \g<domain>){0}
  (?<local-part>      \g<dot-atom>){0}

  \A \g<addr-spec> \Z
}x
{% endhighlight %}

This validates the lexical structure of the address, which is the first step in validing it.

## Domain validation (Quacks like a duck)

Now that we've validated the lexical structure, we can move on some more indepth testing of the address. First, we'll want to validate that the domain in the address actually points to a real domain address, and that email is enabled for that domain.

On a technical basis, we do this by checking for the existence of an MX record for the given domain name.

{% highlight ruby %}
require 'resolv' # DNS library that comes with Ruby
def email_domain_valid?(domain)
  Resolv::DNS.open do |dns|
    return ! dns.getresources(domain, Resolv::DNS::Resource::IN::MX).empty?
  end
end
{% endhighlight %}

Note that you can extend this to perform further checks, such as validating the existence of the MX domain, checking SPF records (if you only want to communicate with two-way mailboxes), etc.

## Checking if the mailbox exists (Swims like a duck)

I don't recommend this. In order to get it to work, you'll have to set up your server as a sending IP for your domain. Beyond the initial setup, there's a good chance that if you abuse it, your servers will be banned for spamming smtp connections.

{% highlight ruby %}
require 'net/smtp' # SMTP library that comes with Ruby
def mailbox_exists?(address, domain)
  Net::SMTP.start(domain) do |smtp|
    smtp.rcptto(address)
  end
  return true
rescue Net::SMTPFatalError
  return false
end
{% endhighlight %}

## All together now (Is it a duck?)

By combining the methods above, you can build a validation function that fits your needs and acceptable level of risk. On a personal note, the majority of "bad" addresses I see come from end users testing out our site. They will either enter gibberish or a fake email (often not caring if it's even a valid domain) just to see how the site behaves. In this case, you will need to communicate why the email failed validation.

Here's a [gist](https://gist.github.com/stevenkaras/600c3ea8377524784602) with the above code put together into a `valid_email?` method

## Obligatory meme

![It's an email duck!]({{ site.url }}/blog/assets/nuclear duck.jpg)

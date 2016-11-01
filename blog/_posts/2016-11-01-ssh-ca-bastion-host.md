---
title: SSH CA bastion host
layout: post
---
I recently built a SSH CA wrapper script, that handles a lot of the bookkeeping around running a CA for SSH. The wrapper works great, but we discussed how we could use it at work to solve the KRL distribution problem. Basically, it comes down to reducing the validity windows of the certificates we issue, which means we need an automatic way to issue certificates. As such, I'd like to introduce SSH-ACME!

ACME is the protocol/standard implemented by Let's Encrypt as a way to automatically issue SSL certificates. The idea being that the issuance process is already mostly automated, and there's no reason to have long validity periods for certificates. The Let's Encrypt project solves two of the major problems with SSL today: certificate cost (it's free!), and certificate revocation.

SSH-ACME is a similar effort by myself to automatically issue SSH certificates, allowing us to consolidate access to a set of hosts to one "controller", which is able to revoke access almost immediately.

# The broad concept

SSH has the ability to issue certificates, and I wrote a wrapper script to manage such a CA easily. Out of this, I started thinking how I'd solve the key revocation/rotation problem. Basically, it comes down to issuing certificates with extremely short validity windows. This allows keys that have become compromised to be revoked as a matter of course, by simply refusing to issue the compromised key new certificates.

# Brass tacks

The acme script has two major roles: 1. To trust/revoke a user's Public Key. 2. To automatically issue a certificate to a previously trusted public key. It does this by adding an authorized_keys entry for that key that uses a forced command to issue the certificate to stdout. Moving your users public keys to the ACME server is left as an exercise to the reader.

## Setting principals

SSH certs have a feature whereby you can restrict the use of a cert to a set of principals, and have the server refuse to authorize a cert only if it has at least one of a set of principals. In this way, you can also run access management from your ACME instance.

# How it can fit into your security architecture

I'd suggest running your ACME server inside your company, running nothing but sshd and the acme/ca scripts. Then you can secure this system more heavily. It may be tempting to conflate your ACME and bastion hosts, but I strongly recommend against it, for the inevitable time when the bastion host is compromised.

# Caveats

My focus is no longer security, so it's entirely possible that using this will open you to a side channel attack or something of the like. I haven't audited the code, and don't plan to. While I tried to keep it as a wrapper that automates otherwise normal operation of SSH, I may have failed in some ways.

SSH only confirms certificate validity at the start of a session, so revoking a key through ACME/KRLs will not end any ongoing sessions. This may be a concern if you're responding to an active attack.

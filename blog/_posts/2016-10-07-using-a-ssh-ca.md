---
title: Using a SSH CA
layout: post
---
Facebook recently posted a lengthy description of how they use SSH certificates and a bastion host heavily integrated with LDAP to grant access to their operational systems. I started investigating the option to use SSH certificates about a year ago (while building a short script to rotate SSH keys automatically), but reading their account finally gave me the impetus to complete the effort, including writing a wrapper script that simplifies a lot of the configuration/operation of a SSH CA.

Source is [here][0]

[0]: https://github.com/stevenkaras/bashfiles/blob/master/.ssh/ssh-ca.bash

# Getting set up

Run `ssh-ca setup`, which will create a ca directory (defaults to ~/.ssh/ca, but you can set it via the SSHCA_ROOT environment variable).

```
ca_root
├── audit.log
├── ca.pub
├── certs
├── krl.source
├── krl
├── next_cert_id
├── next_krl_id
└── private
    ├── ca_key
    └── ca_key.pub
```

## Trusting the CA for client keys

You'll need to configure ssh to trust your CA. Run `ssh-ca install myserver` to set up the CA in the authorized_keys file, similar to ssh-copy-id. If you prefer to do this manually, you can run `ssh-ca trustconfig`.

## Trusting the CA for host keys

To trust host keys, run `ssh-ca install` and it will add the relevant configuration line to your known_hosts file. If you prefer to do this manually, you can run `ssh-ca trustconfig`.

# Normal operation

## Signing client keys

`ssh-ca sign ~/.ssh/id_rsa.pub` signs your key, placing the signed certificate in `~/.ssh/id_rsa-cert.pub`. Adjust your ~/.ssh/config to prefer certificates over keys and your certificate will be trusted by any server you've set up to be trusted by your CA.

## Signing host keys

`ssh-ca signhost myhost.example.com` will run ssh-keyscan to pull in and sign all the keys offered by the host. You'll need to copy the certificates back to the server and configure sshd_config to use them.

# Key Revocation Lists

The problem with KRLs is that there is no easy way to combine two compiled KRLs, which means releasing a new KRL takes passing it along to all the CAs that are trusted by a specific server. As such, I *strongly* recommend using short validity periods for SSH certificates, and building automation to sign keys.

More worrying is that KRLs are only for servers, so there's no way to revoke a compromised server certificate without replacing the CA.

If you really need to revoke a key, use `ssh-ca revoke "serial: X"` where X is the serial number of the certificate. This will build the KRL, which you can then distribute to all your servers.

# Next steps

KRLs reintroduce the key distribution problem, so a better solution is to use an ACME-style proof of control to automatically issue certificates.

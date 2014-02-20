---
title: Naked Objects
layout: post
---
Ever since reading The Pragmatic Programmer, there has been one basic philosophy that I can point to in all my work: DRY. Don't Repeat Yourself. Like most developers who enjoy DRY, I am a strong believer in code generation. The idea is to write programs that write programs. After all, most of the code I write is just boilerplate to apply simple concepts to different data types. In this case, I'm working on a system to generate the basic model code for a complex system.

I'm aware of multiple projects that come close to the vision I have for this, but don't take it quite as far as I'd like to. The primary problem that I'm facing is that existing efforts lack support for multiple languages, or mobile platforms. While it might be possible to update the existing systems, and I may end up using them (albeit tangentially), I'd prefer to solve the problem of Domain Driven Development on a larger scale, across language, platform, and paradigm.

There are a [few][json] [great][mustache] [examples][verbal-expressions] of projects whose impact is felt across multiple languages and platforms. This is the style and type of ecosystem that I'd like to build. By defining the format, rather than the specific implementation, I'm hoping to drive adoption.

Realistically, this means defining several things:

* the data model format (or at least what the format should provide)
* the template format ([oh][ctemplate] [wait][et], [this][mustache] [has][liquid] [already][erb] [been][stringtemplate] [done][m4] [to][genshi] [death][sprintf])
* the interfaces between the two
* a reference implementation of the entire system (showing a thin thread of data model to generated code)

# The reference implementation

NOTE: I haven't started the code for this yet, so it's liable to change before the first public release.

## The data model

I'm going to use JSON for the data model format. Each field should be defined as a type, optionally opening up an object defining multiple properties, such as type, constraints, and whatnot. References to other types are acceptable. Types can range from the generic "Number" to the very specific "uint32le". Aside from the builtin types, fields can reference other types in the system, and should be able to easily define different relationship types (the default being 1:1). Collections can be marked to use collection types, but if bound to a specific number, will use a native array rather than an object collection.

When the model is loaded into memory, we need to check for consistency. This ensures that all the types are defined.

## The template engine

While other implementations will likely want to use their preferred template engine, I think that Mustache is probably the best bet in this case, to encourage the swift adoption for multiple languages.

# The Templates

This entire system isn't much use without templates. More importantly, the key to creating an ecosystem is to provide a central distribution point. This is the hard part, and will take up a large amount of the work. The server needs to allow for anyone to upload new templates. Templates should be signed by the user they were uploaded by (don't want a repeat of the rubygems incident). The catch here being that template sets can use one another, leading to dependency hell. Good news is that we can reject circular dependencies. The client should use the central server by default, but it's important to leave the option open to use local/private servers.

Considering that this is a generic system that is needed across almost all languages, platforms, etc. It makes good sense to apply our system here. But that's a story for another post.

[genshi]: http://genshi.edgewall.org/
[stringtemplate]: http://www.stringtemplate.org/
[m4]: http://www.gnu.org/software/m4/m4.html
[erb]: http://ruby-doc.org/stdlib-1.9.3/libdoc/erb/rdoc/ERB.html
[liquid]: http://liquidmarkup.org/
[json]: http://json.org/
[mustache]: http://mustache.github.io/
[verbal-expressions]: http://verbalexpressions.github.io/
[sprintf]: http://www.cplusplus.com/reference/cstdio/printf/
[ctemplate]: http://code.google.com/p/ctemplate/
[et]: http://www.ivan.fomichev.name/2008/05/erlang-template-engine-prototype.html
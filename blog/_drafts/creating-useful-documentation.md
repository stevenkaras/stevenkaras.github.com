---
title: Creating useful documentation
layout: post
---
Documenting your work is quite possibly the most painful part of being a developer. The closest contender would be reading another developer's documentation. Part of the problem is that documentation often violates the single source of truth principle, so you'll be working with version 4.5 of a project, and reading documentation that is either labelled for a different version, or worse yet, unlabelled. This creates confusion, which is exactly what documentation is supposed to do away with. So let's explore some ways to approach this problem and hopefully solve it (at least partially).

Since we can't control multiple documentation sources, such as a series of badly written blog posts, let's focus on the use case where all the documentation is on one server. Let's also assume that the developer is actively writing the documentation, and that those docs are updated in real time for the latest version.

From the user's perspective, they want to view information for a specific version of the project (let's start by assuming a linear release model, no branching). Each version of the docs is comprised of pages. So it's really a matter of how those pages are displayed. Let's define the primitive:

`getDocumentation(resource, forVersion)`

This function retrieves the documentation describing resource for the given version. On top of this primitive, we can build our documentation site to display the latest documentation, and even update or fix typos. So let's define a few more primitives:

`copyDocumentation(resource, fromVersion, toVersion)` - creates a new copy of the content for the new version

`approveDocsForVersion(resource, forVersion)` - approves that the documentation retrieved by get() is valid for the given version

`deleteDocsForVersion(resource, forVersion)` - deletes the page for this version and all future versions based on this version.

`createNewVersion(newVersion, previousVersion)` - creates a new version

From the developer's perspective, there are pages of documentation, but they are not updated automatically. There may be bugs, and they need to be fixed. While much of the same functionality can be provided by using a wiki and copying all the pages into a new namespace for each version, it creates a lot of extra work for the developer, and can lead to the problem where a bug in the docs is fixed for a base version, but not updated downstream to later versions.

This leads us to a design with two basic domain objects. The documentation content, which can be driven by comments, wiki, google wave, or any similar system, and the documentation versions (we'll call this a DocVersion object for short). When a new version is created, all existing pages for the latest version are copied, and the DocVersion objects point to them as the parent version. More importantly, they point to the previous DocVersion object for the content.

The fields of the DocVersion object should look like this:

-  `version`: Version
-  `previousVersion`: DocVersion
-  `content`: Content (if null, look in previous DocVersion until content is found)

---
title: Web Application Interface Standard
layout: post
---

After working on a project to build various dashboard in Pentaho using CDF, I realized that the basic principles they used in CDF can be extended to almost any web application. The problem is that there is no standard that defines how these applications should be displayed. So let's introduce the world of CDF, dashboards, and how we can extend that to almost any web application.

Pentaho is a business intelligence suite, that offers many features ranging from reports, analytics, data mining, and dashboards. Dashboards are basically a page that displays a bunch of information to the user, ranging from charts to stoplight indicators (red is bad, green is good). Think of it as the electronic, modern equivalent of a control room.

CDF came out of the efforts of several programmers to build a more sensible layer to define dashboards. Prior to CDF, dashboards required knowledge of JSP, Servlets, and worse. Now all you need to define a dashboard are the indicators you want to display, and knowledge of HTML/JS. It moved the dashboard into using technologies that more designers know.

Now while this sounds like it may be useful only for some applications that simply display information, we can extend this to refer to any included chart, indicator, etc. as a Component. Each component is defined on the server, and is requested through an AJAX call. The response of that AJAX call is then placed inside the "htmlObject" tag.

This concept has been built by Google in the past, but they haven't taken it to its full potential. What I'm proposing is to build a Javascript framework on top of jQuery, and building a backend for providing these components. The key difficulty to overcome with this framework is to define it in an agnostic manner, without over-complicating it.

As such, I'm going to set out the first goals of the framework here:

- GET components from a resource, and insert them into the specified htmlObject
- GET libraries from a resource, and execute the javascript code that is returned

---
title: Spreadsheets and Databases
layout: post
---
Most of my recent projects have been simple systems to help businesses move past using spreadsheets to manage their data. The problem that I have is the amount of work necessary to build a system that can effectively compete with Microsoft Excel. There is a core amount of work that is absolutely necessary here, and can't be avoided no matter what. For example, we need to define a schema, normalize data values, and potentially import large amounts of legacy data.

Typically, when I'm discussing the requirements for these systems, I'll build a quick list of features they want/need:

* CRUD
* Listing
  * Sorting
  * Searching in a list
  * Filtering results
  * Customizing columns
* Security
  * Table level authorization
  * Column level authorization
  * Row level authorization
* Auditing
  * History of changes
  * Tracking source systems for legal compliance
* Many, many more

The sad fact is that nearly 30 years after we started building spreadsheet programs, we haven't seen major improvements in systems that can automatically generate much of anything past the first step. Despite knowing these requirements for quite literally decades, we have done amazingly little to build the necessary tools for these systems.

So here's my plan:

I have a system, a bit of a toy. It currently has 7 different resources, and I'm going to need to add another 4 or 5. I'd like to build Ruby on Rails generators that bring most or all of those features quickly so I can focus on creating the important stuff. Wish me luck!

Note: I apologize for the recent hiatus. I was busy editing several large posts that will go up in the coming weeks
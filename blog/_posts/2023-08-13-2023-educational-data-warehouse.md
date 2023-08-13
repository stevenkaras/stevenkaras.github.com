---
layout: post
title: "2023: Educational data warehousing"
tags: []
---
My kids are going to preschool, and for the second year I'm doing some data science to prep for the year.
The biggest questions I want to answer are: how many days will they actually be in preschool, how many holidays are there, are there any dates I should keep an eye out for as problematic, etc.
Last year, I did something similar, and thanks to this I was able to answer a lot of questions about when holidays began/ended and back it up with links to source documents quickly.

The structure for last year was following most of the advice given by [Joel Spolsky's "You suck at Excel"][yt-excel].
There was a main sheet with a bunch of derived columns that I copied and pasted back into themselves as text and then treated as a "fact" table to edit according to various updates we got via email/whatsapp/etc.
On the far right of the sheet I had a few columns that summarized the actual hours - there being four separate childcare providers who were handling the kids (gan, tzaharon, bokron, and my son's private gan).
Another sheet tracked the holidays, which I populated from the official posts from the Education Ministry.

[yt-excel]: https://youtu.be/0nbkaYsR94c

# So what was painful with it?

1. Having to scroll to the right on my phone was a pain. Absolutely horrible.
2. Turning the main table into a fact table meant that if I made a mistake - it would live forever and be extremely obvious.
3. I wanted an excuse to do some data warehouse modeling. Last year was "Excel". This year is DHW. Maybe next year will be different.

# This year's approach

I'm defining a `f_ranges` table which defines the regular behavior by weekday:

1. the symbolic name of the provider (gan, tzaharon, bokron)
2. the start and end dates (inclusive)
3. the start and end weekdays (inclusive)
4. the start and end hours
5. the source and a link to the source

A `f_overrides` table where each row represents an override of the regular behavior:

1. the comma delimited list of providers who's hours are overridden that day
2. the start and end dates (inclusive)
3. the start and end weekdays (inclusive)
2. A description of the override and a general category of override
3. The overridden start and end hours
4. Source and link

A `dim_date` table with dates, the weekday and week number.
I created this one by dragging the dates out for the year - September 1 through August 31.
I also found out the hard way that 2024 is a leap year.

## Some helper functions

I also set up a couple of named functions to make life simpler for me and save a bit of boilerplate.

```
MAKECOLUMN(func)=MAKEARRAY(ROWS(INDIRECT("A:A"))-1, 1, LAMBDA(_r,_c,func(_r+1)))
```

This ensures that I don't need to constantly copy the columns - the first row defines all the cells in the column.

```
DGETX(database, field, criteria, missing_value)=LET(val, DGET(database, field, criteria), IF(ISERROR(val), IF(ERROR.TYPE(val)=3, missing_value, val), val))
DMINX(database, field, criteria, missing_value)=IF(DCOUNTA(database, field, criteria)>0, DMIN(database, field, criteria), missing_value)
DMAXX(database, field, criteria, missing_value)=IF(DCOUNTA(database, field, criteria)>0, DMAX(database, field, criteria), missing_value)
DFETCH(database, field, criteria)=CHOOSECOLS(DFILTER(database, criteria), MATCH(field, CHOOSEROWS(database, 1), 0))
DVPROJECT(values, headers, fields)=IF(ROWS(values) > 0, BYCOL(fields, LAMBDA(field, CHOOSECOLS(values, MATCH(field, headers, 0))))
DFILTER(database, criteria)=LET(headers, CHOOSEROWS(database, 1), values, FILTER(database, MAKEARRAY(ROWS(database), 1, LAMBDA(_r, _c, IF(_r = 1, FALSE, TRUE)))), FILTER(values, BYROW(values, LAMBDA(_r, IF(DCOUNTA(VSTACK(headers, _r), CHOOSECOLS(headers, 1), criteria) = 1, TRUE, FALSE)))))
DJOIN(database1, database2, field)=LET(headers1, CHOOSEROWS(database1, 1), headers2, CHOOSEROWS(database2, 1), values, FILTER(database1, MAKEARRAY(ROWS(database1), 1, LAMBDA(_r, _c, IF(_r = 1, FALSE, TRUE)))), VSTACK(HSTACK(headers1, headers2), BYROW(values, LAMBDA(row, HSTACK(row, DFILTER(database2, {field; CHOOSECOLS(row, MATCH(field, headers1, 0))}))))))
```

These are variants of the `D...` database functions that take an additional parameter for the case where no records matched the criteria.
The default behavior of `DMIN`/`DMAX` is to return 0.
Worse, numerical comparisons are disabled if the formatting of the condition column is set to "Plain Text".

I didn't end up using all of them, but 

## The main view

These then get combined into `mv_hours` which pulls from `f_ranges` and `f_overrides` like this:

```
Start,End,Providers=MAKECOLUMN(LAMBDA(r, LET(r_date, INDIRECT("A"&r), r_weekday, DGET(dim_date, "Weekday", {"Date"; r_date}), r_condition, {"Start Date", "End Date", "Start Weekday", "End Weekday"; "<="&r_date, ">="&r_date, "<="&r_weekday, ">="&r_weekday}, r_ranges, LET(raw_ranges, DVPROJECT(DFILTER(f_ranges, r_condition), CHOOSEROWS(f_ranges, 1), {"Provider", "Start", "End"}), IF(ISNA(raw_ranges), {"Dummy", "no", "no"}, raw_ranges)), r_overrides, LET(raw_overrides, DVPROJECT(DFILTER(f_overrides, r_condition), CHOOSEROWS(f_overrides, 1), {"Providers", "Start", "End"}), IF(ISNA(raw_overrides), {"Dummy", "no", "no"}, raw_overrides)), r_split_overrides, BYROW(r_overrides, LAMBDA(o_r, LET(o_providers, TRANSPOSE(SPLIT(CHOOSECOLS(o_r, 1), ", ")), BYROW(o_providers, LAMBDA(o_provider, HSTACK(o_provider, o_r)))))), r_all_providers, UNIQUE(VSTACK(CHOOSECOLS(r_split_overrides, 1), CHOOSECOLS(r_ranges, 1))), r_joined_providers, BYROW(r_all_providers, LAMBDA(r_provider, {r_provider, XLOOKUP(r_provider, CHOOSECOLS(r_split_overrides, 1), CHOOSECOLS(r_split_overrides, 3), XLOOKUP(r_provider, CHOOSECOLS(r_ranges, 1), CHOOSECOLS(r_ranges, 2), 0)), XLOOKUP(r_provider, CHOOSECOLS(r_split_overrides, 1), CHOOSECOLS(r_split_overrides, 4), XLOOKUP(r_provider, CHOOSECOLS(r_ranges, 1), CHOOSECOLS(r_ranges, 3), 0))})), r_joined, VSTACK({"Provider", "Start", "End"}, r_joined_providers), r_providers, SORT(UNIQUE(DFETCH(r_joined, "Provider", {"Start";"<>no"}))), result, {DMINX(r_joined, "Start", {"Start"; "<>no"}, 0), DMAXX(r_joined, "End", {"End"; "<>no"}, 0), IF(ISNA(r_providers), "", JOIN(", ", r_providers))}, result)))

Hours=MAKECOLUMN(LAMBDA(r, INDIRECT("C"&r)-INDIRECT("B"&r)))
```

That big one is a bit complicated, but it's fairly simple once you break it down:

1. Get a list of applicable ranges (by date and weekday)
2. Get a list of applicable overrides (by date and weekday)
3. Split the overrides by the "Providers" field
4. Combine the split overrides with the ranges to get a list of all provider ranges for that day
5. Take the min/max as the start/end times
6. This produces a 3x1 row vector for each input row, meaning that it produces 3 columns at once

I then created a `Main` sheet that pulls the Start and End columns from `mv_hours` and adds a comment column for me to use for general notes (picture days, parties, etc):

```
Start=MAKECOLUMN(LAMBDA(r, DGETX(mv_hours, C$1, {"Date";INDIRECT("A"&r)}, "")
End=MAKECOLUMN(LAMBDA(r, DGETX(mv_hours, D$1, {"Date";INDIRECT("A"&r)}, "")
```

### The format

Because I'm representing days where there is no care provider with a 0, this makes it rather ugly at first.
The solution is to use a custom number format for times:

```
hh":"mm;"invalid";"no"
```

And a similar format for durations:

```
[h]:mm;"invalid";"no"
```

## Calendar export sheets

Google calendar allows importing events from a CSV file, but has some undocumented idiosyncracies.
Notably, full day events are from midnight to midnight and so the end date is the date+1.

The list of columns supported is:

```
Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private
```

### Events for every single session

This is overkill. 100%. But it was good practice.

```
Start Date=DFETCH(mv_hours, "Date", {"Hours"; "<>0"})
Start Time=DFETCH(mv_hours, "Start", {"Hours"; "<>0"})
End Date=DFETCH(mv_hours, "Date", {"Hours"; "<>0"})
End Time=DFETCH(mv_hours, "End", {"Hours"; "<>0"})
All Day Event=MAKECOLUMN(LAMBDA(r, "No"))
Description=MAKECOLUMN(LAMBDA(r, "Care will be provided by "&DGET(mv_hours, "Providers", {"Date"; INDIRECT("B"&r)})))
```

### Events only for "Overrides"

This one is a little more complicated because there are multiple approaches each of which is semantically valid:

1. An event for every day there is an override - with a notice of what the changes are, and if there is partial care being provided that day then to mention that
2. An event for every day there is an override if there is no care for that day
3. An event for every day there is no care where there usually would be

There are problems with each of the three approaches - mostly around the semantic differences and the subjective judgements calls that move things in and out of each of them.

So I decided to not even do this.

## Statistics

A fun mental exercise is to figure out the hourly and monthly costs of child care.
This can be useful for setting expectations and bringing up when lobbying for improved conditions for your children.
At least being aware of roughly how much slop there is in childcare can be helpful in understanding why things are the way they are.
This does necessitate being able to pull in which providers exist:

```
Providers=LET(ranges, f_ranges!A2:A, raw_overrides, FLATTEN(BYROW(f_overrides!A2:A, LAMBDA(p, SPLIT(p, ", ")))), overrides, FILTER(raw_overrides, raw_overrides <> ""), SORT(UNIQUE(VSTACK(ranges, overrides))))
```

But then I realized that to pull accurate information for this, I would need a new sheet that holds individual records for each session of care.
Which is the ideal state of what I'm trying to do here, but incredibly painful to construct without access to a proper SQL dialect.
So I'll just need to rely on general statistics such as overall how many hours my kids will spend in childcare, regardless of provider.

## Extra cirriculars

The local municipality has a nonprofit co-op that publishes a list of extracirriculars on their website.
While the website has some filtering options, they aren't particularly comfortable or useful beyond basic filtering.
Thankfully, I was able to copy paste most of the relevant information to a sheet.
Then I added a few columns:

* Weekday
* Start hour
* Youngest year of birth
* Oldest year of birth

Starting from this approach I was able to cut down the viable options from 300+ to 30 - and persist the reason for filtering out the unwanted extracirriculars.

## Extending this to both kids

I'm still uncertain how I'll handle this for both kids - one option is to just leave one copy and just write down comments any things that only affect one of them.
Another would be to make two copies, but any systemic improvements would require effort to keep them in sync.
Another option would be to change ranges, overrides, etc to have an extra key - basically duplicating the data, but in a single table.

For this year I think I'll go with comments and maybe next year I'll go with a more comprehensive approach.

## Future work

1. Formalize and reproduce the whole thing as SQL because Google Sheets is incredibly limited when it comes to more formal functional programming.

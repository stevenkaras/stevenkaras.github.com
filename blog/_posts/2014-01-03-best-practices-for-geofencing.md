---
title: Best practices for geofencing
layout: post
---
Geofencing is a new feature in Android, available for all devices running API level 8 and up through Google Play Services. This means that even legacy applications that can’t be upgraded to leverage newer API levels can now use these new features. Geofencing, for the uninitiated, is a power-efficient method of registering your application to get woken up when the device is within a specified distance of a point.

Practically, this can be used to prompt the user to checkin to a location they previously searched for, or to review a restaurant after they've left. Other examples include generating analytics events for conversion tracking, or displaying contextually relevant information.

However, this facility doesn't come for free. It requires a large number of permissions, takes a small amount of power, and you are allowed a limited number of active geofences. The good news is that it looks like Google Play Services is blamed for the power consumption, so your app isn't going to jump up the battery list.

## Power Consumption

We tested this extensively on my Nexus 5 device, which showed around 5% power usage over 24 hours more than before we turned on geofences. That translates to around 5mA draw for 100 active geofences, but it's important to remember that the Nexus 5 has hardware support for geofences, which many other devices lack, so you'll likely see a larger power draw on those.

## Active Geofence Limits

The real stumbling block when dealing with geofences is when you need to maintain more than 100 geofences. If you're using geofences based on reminders, it's unlikely you'll ever run into this limit. However, for almost every other purpose, you'll almost immediately reach the limit.

## A wild solution appears!

The solution is to set 99 geofences based on the current location, and set a regional fence around them all, that when exited, triggers a rebuild of the geofences. It's important to remember that in order to be correct, you actually need to know where the regional fence needs to be built. In our case, you should place the regional fence at the inner edge of the outermost fence of the closest 100. In this way, when the user leaves the region, they won't have already entered any other fences.

Note that you should retrigger rebuilds of the fences based on three situations:

1. The first time you're setting up the fences
2. When the device leaves the regional fence
3. When the underlying dataset changes

## It's super effective!

I'm currently working on a side project to encapsulate all of this logic into an open source component. I'll update and announce when it's finished.
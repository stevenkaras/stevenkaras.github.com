---
title: Mobile Aware Network Communication
layout: post
---
There are literally entire books written on how to get data packets from a mobile device to a server and back. There are protocols and strategies like Mobile IP, WAP, WiFi, WiMax, and so on. But there is relatively little written about the ways we can write our applications to better deal with the conditions of a mobile device: limited memory, battery and power consumption concerns, connectivity issues, malicious (intentionally or not) networks, and a host of other issues. I'm going to explain some of the ways we expose these issues to provide a more useful abstraction in the [Brigand](http://stevenkaras.github.io/brigand) library.

Brigand provides you with a handy API for scheduling HTTP requests that can be completed hours or days later. It's goal is to remove the common misconception that an HTTP request is immediate.

# Battery Awareness

The first thing we want our library to be aware of is battery state and level. For Android, we access the battery status using a simple call (like most of these things, it will require a Context)

{% highlight java %}
IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
Intent batteryStatus = context.registerReceiver(null, intentFilter);
{% endhighlight %}

From this, we can extract the battery level:

{% highlight java %}
int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);

float batteryPct = level / (float)scale;
{% endhighlight %}

We can also check what we're charging from

{% highlight java %}
/*
 * This snippet sets the chargeSource to either:
 *
 * 0 - not charging
 * 1 - charging from USB
 * 2 - charging from power adapter
 * 100 - charging from unknown source
 */
int chargePlug = batteryStatus.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
int chargeSource = 0;
if (chargePlug == BatteryManager.BATTERY_PLUGGED_USB) {
    chargeSource = 1;
} else if (chargePlug == BatteryManager.BATTERY_PLUGGED_AC) {
    chargeSource = 2;
} else {
    int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
    if (status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL)
        chargeSource = 100;
}
{% endhighlight %}

At the moment, we don't do it, but we plan on extending this to actually determine the exact amount of power remaining in absolute terms. This will allow us to set policies according to the actual amount of power that will be consumed in order to perform the request.

# Connectivity Awareness

The most important distinction we can make is what type of connectivity we have at the moment. This means differentiating between low power networks, such as WiFi or GPRS, and high power networks, such as HSPA and LTE. For those of you who feel like you are missing out from the alphabet soup here, the basic reasoning is that cellphone radios work in multiple modes, with orders of magnitude of difference in power consumption between modes. This means that each second spent sending data actively chews up hours of equivalent idle time.

We can work around a good chunk of this to make intelligent decisions, such as waiting for another application to switch the radio mode into high power mode, and then bundle our data with theirs, letting them take the blame for the majority of the power usage (switching between modes takes a lot of power, and can eat hours of battery life).

{% highlight java %}
/*
 * This snippet sets the dataNetwork to either:
 *
 * 0 - no network connectivity (only if we are certain there is no connectivity)
 * 1 - Ethernet
 * 11 - WiFi (802.11x)
 * 12 - WiMAX
 * 21 - Bluetooth
 * 50 - Unknown mobile network type
 * 51 - GPRS
 * 52 - EDGE
 * 53 - HSPA+
 * 54 - LTE
 * 
 * 100 - unknown network type
 */
int networkType = 0;

ConnectivityManager cm = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);

NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
boolean isConnected = activeNetwork != null && activeNetwork.isConnectedOrConnecting();

if (isConnected) {
    switch (activeNetwork.getType()) {
    case ConnectivityManager.TYPE_ETHERNET:
        networkType = 1;
        break;
    case ConnectivityManager.TYPE_WIFI:
        networkType = 11;
        break;
    case ConnectivityManager.TYPE_WIMAX:
        networkType = 12;
        break;
    case ConnectivityManager.TYPE_BLUETOOTH:
        networkType = 21;
        break;
    case ConnectivityManager.TYPE_MOBILE:
        TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        switch (tm.getNetworkType()) {
        case TelephonyManager.NETWORK_TYPE_GPRS:
            networkType = 51;
            break;
        case TelephonyManager.NETWORK_TYPE_EDGE:
            networkType = 52;
            break;
        case TelephonyManager.NETWORK_TYPE_HSPAP:
            networkType = 53;
            break;
        case TelephonyManager.NETWORK_TYPE_LTE:
            networkType = 54;
            break;
        default:
            networkType = 50;
        }
        break;
    default:
        networkType = 100;
    }
}
{% endhighlight %}

Unfortunately, we can't request that Android wake up our app when the device switches to DCH mode, but we can ask to be woken up when connectivity changes and sleep for a short period (about half a minute) until other apps already make the requests. We can also fall back on other triggers to ensure our request is made in a timely fashion.

# Time Awareness

> Time is an illusion; lunchtime doubly so.
> - Douglas Adams

However, we silly apes pay enough attention to it that it can make all the difference for an app that needs to send analytics data. For example, you may want to schedule your analytics data for transmission in the night, when the device is more likely to be plugged in for a long period of time, with little change to connectivity.

More importantly, it gives us the chance to change our policies after a period of time. This is useful if we need to ensure our data is sent within 30 minutes, but we prefer to not be blamed for battery usage.

# Disabling Application Components

Efficiently doing this can result in your application being woken up more often than you'd like. For example, if you don't have any queued transfers, there's no reason to wake up your application. To prevent that happening, you can actually request that Android turn off certain components:

{% highlight java %}
ComponentName receiver = new ComponentName(context, ConnectivityReceiver.class);

PackageManager pm = context.getPackageManager();

pm.setComponentEnabledSetting(receiver, PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP)
{% endhighlight %}

And then once you've queued your first transfer, you can turn the listeners on based on the queueing policy:

{% highlight java %}
ComponentName receiver = new ComponentName(context, ConnectivityReceiver.class);

PackageManager pm = context.getPackageManager();

pm.setComponentEnabledSetting(receiver, PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP)
{% endhighlight %}

# Use Cases

The two use cases which need to be power aware are as follows:

- *Lazy Transmission* - this is the scenario where you'd like the data to be sent within 30 minutes, but you'd prefer to not get blamed for the power usage. Once 30 minutes have passed, we allow initiating the radio state change, so long as the battery isn't below 20%, which we only allow after 60 minutes.
- *Analytics* - analytics data is extremely low priority. If the battery is between 0 and 30%, we never send this data. Between 30% and 50%, we only send it if either charging or connected to wifi. Above 50%, we still prefer to wait until someone else initiates a data transfer to piggyback onto.

Brigand handles the latter case at the moment, but we plan on supporting the former in the future.

# What Brigand is

Brigand is the opportunistic bastard of all communication libraries. It implements most of these strategies, and we plan on adding support in the future for the remainder.

# What Brigand isn't

Brigand is not Volley. It isn't a general purpose communication library. It is specifically designed for custom sync protocols and analytics data reporting. Trying to use it for other things will usually result in it destroying your device, drinking your beer, and molesting your cat. Beware.
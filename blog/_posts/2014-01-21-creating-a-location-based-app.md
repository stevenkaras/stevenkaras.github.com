---
title: Creating a location based mobile app
layout: post
---
I've recently built a mobile application that heavily uses location services. I was surprised by the lack of information available on how to execute this, especially at a higher architectural level. In this post, I'll walk you through our infrastructure and include some links for the various resources I used.

Our application targeted Android first, because the devices are cheaper and the development tools are free. The app displays markers on a map as provided by our server. Our server is a [Rails][rubyonrails] application deployed on [Heroku][heroku]. We used PostgreSQL, without any extensions. Heroku provides a free tier of PostgreSQL, and plenty of upgrade options.

# The Backend

Our backend was simple. We generated scaffolding for our Place model (GPS coords + metadata), added a quick JSON API controller for getting a list of all the places within some geographical bounds. After that I built a very basic web interface for updating the data without needing to use `rails c`.

One of the things that I wanted to play around with that I didn't get the chance to was to use the [hstore][hstore-rails4] column type as a way to store all the "extra" attributes efficiently (and without unnecessary schema changes)

## Performance and Scaling

Once our server was up and running, we started by testing out how well it would handle traffic. Unfortunately, we found out that my laptop could only support around 20 or 30 concurrent users (we tested with [siege][siege]). The good news was that Heroku provided us with much better infrastructure. We still wanted to improve it a little bit, so we grabbed the low hanging fruit:

1. Enable compression. This is as simple as adding Rack::Deflate to your application config, or to your rackup file.
2. Client changes to reduce server load (adding a 10 second delay between requests)

We had a few extra ideas planned out for the future, but never reached the point where we needed them:

1. Enable [PostGIS][postgis] on your server and set up a spatial index for location data. Heroku offers PostGIS support for production tier database services (starting at 50 USD/month). There are some free services that provide the same, but this is only once you start seeing your database churning on those queries.
2. Switching rails servers. We started out with Puma, but I wanted to benchmark that versus Unicorn, etc.
3. Adding extra indexes in the database on hot fields
4. Converting the API to use geospatial buckets that could be cached efficiently. Thinking about it now, we should have started out this way.

# The Client

Our client, unlike the server, was somewhat complex. We used Google Maps and Fragments for the UI, and a ContentProvider for caching the locations locally. Google Maps API v2 provides a [SupportMapFragment][gm-mapfrag] that we subclassed to provide an adapter for displaying markers from the provider.

## Google Maps API

I ran into more than a few problems when working with the Maps API. Here are some tips to avoid the same issues we had:

- All API calls must occur on the main thread. Even simple getters can crash threads because it does IPC on the main thread only. We used this class to perform calls on the main thread:
{% highlight java %}
public class MainThread {

    /**
     * Execute the given Runnable on the main thread, and block until it finishes
     *
     * @param action the Runnable to execute on the main thread
     */
    @SuppressWarnings("SynchronizationOnLocalVariableOrMethodParameter")
    public static void syncOnMainThread(final Runnable action) {
        final Object sync = new Object();
        final boolean[] ready = new boolean[1];
        ready[0] = false;
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                action.run();
                synchronized (sync) {
                    ready[0] = true;
                    sync.notify();
                }
            }
        });
        synchronized (sync) {
            while (!ready[0]) {
                try {
                    sync.wait();
                } catch (InterruptedException e) {
                    // do nothing
                }
            }
        }
    }
}
{% endhighlight %}
- Avoid adding the fragment directly to the layout. I wasn't able to get a splash screen to display over the map until I changed this to add the fragment programmatically (with our nav drawer).
- There are more than a few things missing from the API, but there are [several][android-map-utils] [extension][android-map-extensions] libraries that are useful. We didn't use them, but they look great, and can help.

## Performance and Scaling

There are a few performance optimizations we made:

1. Only display the markers that are within the viewport of the map. Google Maps doesn't do a great job of memory management and each marker takes up a certain amount of resources. We tripled the size of the viewport to allow for a smoother user experience when dragging the map around (adding an extra screen in each direction).
2. Only request new markers from the server every 10 seconds, unless it's the first time you're loading that area. You can approximate this by tracking the maximal/minimal GPS bounds. You can replace this with an efficient spatial index once it causes problems.
3. Enable compression for server traffic. If you're using Android's [HURL][android-hurl], it's enabled by default.

[hstore-rails4]: http://jes.al/2013/11/using-postgres-hstore-rails4
[android-geofences]: http://stevenkaras.github.io/android-geofences
[rubyonrails]: http://rubyonrails.org
[spacialdb]: https://spacialdb.com
[heroku]: http://heroku.com
[postgis]: http://postgis.net/
[postgresql]: http://www.postgresql.org/
[gm-mapfrag]: https://developers.google.com/maps/documentation/android/reference/com/google/android/gms/maps/SupportMapFragment
[android-map-extensions]: http://androidmapsextensions.com
[android-map-utils]: http://github.com/googlemaps/android-maps-utils
[android-hurl]: http://developer.android.com/reference/java/net/HttpURLConnection.html
[siege]: http://freecode.com/projects/siege
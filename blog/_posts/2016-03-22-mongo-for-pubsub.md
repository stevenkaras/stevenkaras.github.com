---
title: Mongo for pubsub
layout: post
---
I recently got called on to help optimize a deployment of Mongo being used as a pubsub broker. Mongo provides tailable cursors for capped collections. Unfortunately, because of disk access, this can cause latency spikes into the hundred ms range. I'll cover how I got Mongo to run inside Docker, using tmpfs to make our capped collections almost never hit the disk (admittedly, not as good as ramfs, but without the danger of it killing your server)

# Running mongo in docker

Good news is that there are default images for mongo, and they work turnkey. I've used mongo locally for development, and recently migrated our production servers to using a container for mongo.

    $ docker run -d mongo:3.2

## docker-compose

Compose makes it really simple to wrap up the parameters for `docker run`, making it especially useful for running sets of services together (like an ELK stack). Here's a compose file for running mongo with the data directory mounted where mongo typically runs out of on ubuntu (for example, if you want to migrate an existing installation of mongo to use docker):

```yml
version: "2"
services:
  mongo:
    image: mongo:3.2.4
    ports: "27017:27017"
    volumes:
      - /var/lib/mongodb:/data/db
```

# tmpfs

Docker support for tmpfs landed in v1.10. For example, we could mount the /data/db directory as tmpfs like this:

    $ docker run --tmpfs /data/db:rw,noexec,nosuid,nodev,size=64M -d mongo:3.2

## docker-compose

Even though tmpfs has landed in Docker, it hasn't made it into docker-py, and by extension docker-compose. This means that we'll need to mount tmpfs externally, or run the container manually (which is honestly a PITA). Once the [bug][1] is solved and the fix [merged][2], I'd expect something like this to work:

```yml
version: "2"
services:
  mongo:
    image: mongo:3.2
    ports: "27017:27017"
    tmpfs:
      - /data/db:rw,noexec,nosuid,nodev,size=64M
```

## In the meantime

    $ mount -t tmpfs -o rw,noexec,nosuid,nodev,size=64M /var/lib/mongodb
    $ docker run -d -v /var/lib/mongodb:/data/db mongo:3.2

# But I store data in Mongo too!

First, we'll need to create a single tmpfs for each of the dbs you want to be in tmpfs, symlink them into mongo's directory, and chown them so docker can allow mongo to actually write to them. Last, we need to run mongo with the [--directoryperdb][0] option, so it'll use the symlinked directories for storage.

    $ mount -t tmpfs -o rw,noexec,nosuid,nodev,size=64M /pubsub
    $ for db in capped1 capped2; do mkdir /pubsub/$db; ln -s /pubsub/$db /var/lib/mongodb/$db; done
    $ docker run -d mongo:3.2 mongod --directoryperdb -v /pubsub:/pubsub
    $ docker exec mongo chown -R mongodb:mongodb /pubsub

## docker-compose

```yml
version: "2"
services:
  mongo:
    image: mongo:3.2
    command: "mongod --directoryperdb"
    ports: "27017:27017"
    volumes:
      - /var/lib/mongodb:/data/db
      - /pubsub:/pubsub
```

# now the bad news

Even though we're running our capped collections off tmpfs, we're still seeing latency spikes in the 200-2000ms range. Our gut feeling is that tmpfs is swapping our data to disk long before it should be (thank you linux for overcommit by default...)

[0]: https://docs.mongodb.org/manual/reference/program/mongod/#cmdoption--directoryperdb
[1]: https://github.com/docker/compose/issues/2778
[2]: https://github.com/docker/compose/pull/2978

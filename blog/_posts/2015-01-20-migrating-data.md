---
title: Migrating data
---
I backed myself into a corner recently, and had three nearly identical instances of an app running. Naturally, word came down to combine them into one database. This is a quick record of what I did to do that, while maintaining referential integrity.

Let's take stock of what I had:

- 2 deployed instances of an app, one which I'll call the target, where we want all our data to live, and the other, which I'll call the source
- the schema of the source DB is a subset of the schema of the target. There are no constraints on any added columns, and we'll be leaving them null
- as it so happens, both the source and target DB live on the same RDS server. But that is inconsequential, and I won't be using any tricks to (ab)use this.
- Many of the tables in the source DB have foreign key references, albeit without any constraints
- The tables were designed for use with Rails' ActiveRecord ORM system, so I'm going to use this as the basis
- In my case, we needed to move around ~1.3M records from 8 tables across two database instances to a third one
- Just to be specific, I did this using Ruby 2.1 and a Rails 4.1 application with a Postgres 9.3 database hosted on AWS RDS.

# Dump the database

First, you'll need to pull out a dump of each table. I'd suggest saving them in CSV (with a header row).

```ruby
require 'csv'
classes = [Foo, Bar]
classes.each do |klass|
  CSV.open("path/to/#{klass.name.downcase}.csv", "w", headers: klass.column_names) do |csv|
    csv << klass.column_names
    klass.all.find_each do |model|
      csv << model.attributes
    end
  end
end
```

You run this using the environment for the source database, so it moves the rows you need to move onto your local machine.

# The Rails Approach

First, I tried writing a simple script that would create a rails model for each record, triggering validations and callbacks. This is what you'll need to do if you have external dependencies aside from your database, and need for example to add people to mailchimp lists, create mandrill subaccounts, etc.

```ruby
require 'csv'
classes = [Foo, Bar]
mappings = classes.zip([]).map{|k,v|[k,{}]}.to_h
classes.each do |klass|
  csv_file = "path/to/#{klass.name.downcase}.csv"
  next unless File.exists?(csv_file)
  CSV.foreach(csv_file, headers: true) do |row|
    # remove the surrogate key
    filtered_row = row.to_h.reject{|k,v| k == klass.primary_key}

    # if there are any foreign keys, replace them now (skip through associations)
    klass.reflections.select {|n,r| r.macro == :belongs_to }.each do |reflection|
      foreign_key = reflection.foreign_key
      old_id = filtered_row[foreign_key]
      filtered_row[foreign_key] = mappings[reflection.klass][old_id]
    end

    model = klass.create(filtered_row)
    mappings[klass][row[klass.primary_key]] = model.attributes[klass.primary_key]
  end
end
```

I ran this as test code, and it imported the first 300K records into my local development instance over a few hours, which was acceptable. When we ran it against our production DB, however, the cracks in this approach started to show. ActiveRecord's Postgres adapter has some fatal connectivity issues which are excaserbated by my horrible ISP. It took nearly two days to get through the first 50K records, at which point I decided to look for a new approach to meet our deadline.

NOTE: To work around the connectivity bug, I had it bail every 50 or so records and start again, so I had to build in a way to persist the state of the migration, including saving mappings as files, keeping track of how many records were migrated, etc.

# The Massive INSERT

Next up was taking the lists we exported in the beginning, and simply processing them into massive SQL insert statements. The core code for replacing the foreign keys was reused, and I wrapped it all into a command line tool, along with some snippets to automatically import/export all the ActiveRecord models.

To make it extra quick, I added a new field to every table, then used the PostgreSQL INSERT RETURNING extension to export a CSV mapping of surrogate keys. I didn't have any tables without a surrogate key, nor did I have any join tables, but it should be trivial to add support.

I've uploaded the [migration tool][gist] for you to use under MIT terms.

[gist]: https://gist.github.com/stevenkaras/9f6c5bd27faea525ba3f

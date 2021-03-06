Storage Engine: is the interface between the persistent storage, which we call
the disk (ssd or hdd), and the database itself (MongoDB).

So if you are writing a program in Nodejs:
The program will use the MongoDB driver to talk to the MongoDB server to perform
C.R.U.D tasks. The server will then talk to the storage engine, which will then
talk to the disk. All the different structures that hold the documents, indexes,
and metadata involving the documents are all written to the persistent storage (disk)
by this storage engine. The storage engine may use memory to optimize the process.
The storage engine has control over the memory on the computer, so it can decide
what to put in memory, what to take out of memory, what to persist to disk and
when.
MongoDB offer a pluggable storage engine architecture, where you can use more than
one.
Storage engine does not affect the communication between servers. It doesn't affect
the api that the database present to the programmer.

MMAPv1
-uses the mmap system call, which allocate memory, or map files or devices into
memory, in order to implement storage management.
-collection level locking(concurrency): multi readers single writer lock. Only one
write can happen at a time to a particular collection
-allow in place update
-automatically allocate power of two sized documents when inserting new documents

WiredTiger usually faster
-offers document level concurrency. Only one write can happen at a time to a
particular document
-offers compression of data and of indexes. WiredTiger manages the memory that is
used to access that file. It decides which blocks gets keeps in memory and which block
to send back to disk (this is when it can perform compression).
-no in place update. When you update a document in WiredTiger, it marks that document
as no longer used. Then it's going to allocate new space somewhere else on the disk and
write it there, and eventually reclaim the space that's no longer used.

mongod -dpath /path/for/the/db : This is how you set the path for the database to storage files
mongod -dpath /path/for/the/db -storageEngine wiredTiger : flags the storage engine to use wiredTiger

db.collection.createIndex({some_id:1}) : Creates an index. Where 1 is ascending and -1 is descending.
db.collection.dropIndex({some_index:1}) : Delete the some_index

Multi-key indexes are when you doing a compound index e.g. ({index1:1,index2:1})
and one of the index is an array. The restriction is that only one index can be an array
Dot notation and multi-key: just index key with dot notation or index for sub document
Unique index: db.collection.createIndex({"some_index": 1}, {unique: true});
Sparse index: db.collection.createIndex({"some_index": 1}, {unique: true, sparse:true});
create unique index for a collection and ignore documents that have empty
key values. So in other word you can have a index e.g. "c":1 where not every document
has this "c" field

Background index creation       vs         foreground index creation (default)
slower                                     faster
don't block reader/writer                  block reader/writer (more for deployment)
db.col.createIndex({'index':1}, {background:true})  db.col.createIndex({'index':1})
For advance deployment you have cluster of servers and use a not busy server to
perform foreground index creation so it's faster

explain function is use show what the database would do if it were to completely do
a query. It doesn't actually give user the output of the query
db.collection.explain() creates an explainable object. After the explain() it could
be find(), update(), remove(), aggregate()...etc except insert()
explain modes:
queryPlanner is the default mode. It shows the steps it would take to perform
an operation, whether it be find(), update(), remove()...etc
executionStats include queryPlanner and additional statistics about the process
of the operation, like # doc return, # doc examined, time it took etc...
allPlansExecution includes the previous 2 modes

When the number of total documents examined is zero, and we used an index,
and returned results greater than zero, that is a query. (query satisfied entirely by an index)
This will result in a faster query.

Steps in choosing index:
1. looks at the fields being search on aka query shape, and additional info such as sort
2. based on the criteria in 1., mongo will id a set of candidate indexes to satisfy the query
3. the 1st query plan to reach the goal state is the winner or 1st to get over
a threshold but it has to be sorted. The winner will be selected as the index
for queries of the same shape and stored in the cache.
The cache can be updated by threshold of writes (1000 by default), rebuilding
the index, if an index was added or dropped from collection, mongodb restarts

In mongodb, it is important that we are able to fit working set, which is frequently
access data by client, into memory, especially the index.
db.collection.stats() to look at the size of the index (more details)
db.colleciton.totalIndexSize() just return the size of the index
In MongoDB 3.0 with WiredTiger there's prefix compression to make index size smaller

Geospatial Indexes
1. have something in the documents that specifies x, y coordinates
e.g. 'location': [x.y]
2. have an index that tells the database that there are x,y coordinates store in the document
e.g. createIndex({"location":"2d", type:1})
3. you can find() and call the $near operator to get all documents near that
coordinate in increasing distance
e.g. find({location:{$near:[x,y]}}).limit(20)
Geospatial Spherical
e.g. createIndex({"location":"2dsphere"})
check geonear.js to see how to search using spherical geospatial index
Full text search, it applies the 'or' operation on the word search
1. you have to create the index for text search
e.g. db.collection.createIndex({'field':'text'})
2. search index using this
e.g. db.collection.find({$text:{$search:'some text'}})
It ignores cases and 'nonsignificant words' like 'a' 'the'
If you want to look for documents with best match for all the words
e.g. db.collection.find({$text:{$search:'dog tree obsidian'}},
{score:{$meta:'textScore'}}).sort({score:{$meta:'textScore'}})

Designing and using indexes:
the goal is Efficient read/write operations
- Selectivity : minimize records scanned. This means you want the totalKeysExamined
close to the # of result return. hint() is a way to increase selectivity
- other Operations: like how sorts are handled
using hint() can overwrite the index selection *be very careful when using This
e.g. db.collection.find({student_id:{$gt:500000}, class_id:54}).sort({
student_id}).hint({class_id:54})

Rules of thumb when designing index:
equality field > sort field > range field

equality field: field on which queries will perform an equality test
sort field: field on which queries will specify a sort
range field: field on which queries perform a range test

MongoDB automatically logs all slow queries (>100 ms). You can find this in mongod

Profiler systme.profile
3 levels: 0 (off), 1 (log slow queries), 2 (log all queries, good for debugging)
The way you set this in terminal is:
mongod -dbpath /path/to/mongo/data/db --profile 1 --slowms 200
db.system.profile.find().pretty()
db.system.profile.find({millis:{$gt:1}}).sort(ts:1).pretty()
db.getProfilingLevel() see which profiler level you are currently using
db.setProfilingLevel(lvl, millis) where lvl is one of 3 profiler lvls and
millis is the number of milliseconds you want to log beyond
mongotop time , where time is the interval in second you want mongo to show
what it's doing at the top level
Mongostat is a performance tuning command. It samples every second and show you
whats going in that 1 second
different result depending on your storage engine

Sharding is a technique for splitting up a large collection amongst multiple
servers.
Application -> mongoS (server) -> multiple mongoD (database) or multiple replica sets
aka shard. When you are sharding you will need to know your shard keys for better
performance otherwise mongoS will broadcast to all the shards

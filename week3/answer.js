var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db){
  if(err) throw err;
  var unwind = {'$unwind': '$scores'};

  var highAvgGroup = { '$group' : { '_id' : '$_id' , 'average' : { $avg : '$scores.score' } } };

  var sort = {'$sort':{'average':-1}};
  var limit = {'$limit':1};

  db.collection('students').aggregate(unwind, highAvgGroup, sort, limit, function(err, avg){
    if(err) throw err;

    console.log(avg);
  });
});

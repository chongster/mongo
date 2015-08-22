var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db){
  if(err) throw err;
  //unwind deconstructs array field into documents
  var unwind = {'$unwind': '$scores'};
  //filters the documents to pass only the documents that match the specified conditions
  var match = {'$match':{'scores.type':'homework'}};
  //group the outputs
  var minGroup = {'$group':{'_id':'$_id', 'minimum':{'$min':'$scores.score'}}};

  db.collection('students').aggregate(unwind, match, minGroup, function(err, doc){

    //console.log(doc);
    for (var i=0; i<doc.length; i++){
      var id = doc[i]._id;
      var minScore = doc[i].minimum;
      db.collection('students').update({'_id':id},{'$pull':{scores:{'score':minScore}}}, function(err, updated){
        //console.dir("successfully updated" + updated + "documents");
      });

    }
    console.log("finished removing lowest homework grade");
    db.close();


  });

});
//Find the student id with highest average
MongoClient.connect('mongodb://localhost:27017/school', function(err, db){
  if(err) throw err;
  var unwind = {'$unwind': '$scores'};

  var highAvgGroup = { '$group' : { '_id' : '$_id' , 'average' : { $avg : '$scores.score' } } };

  var sort = {'$sort':{'average':-1}};
  var limit = {'$limit':1};

  db.collection('students').aggregate(unwind, highAvgGroup, sort, limit, function(err, avg){
    if(err) throw err;

    console.log("The student with the highest grade average has id: " + avg[0]._id);
    db.close();
  });
});

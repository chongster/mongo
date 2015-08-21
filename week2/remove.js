//findAndModify finds, modify, return the resulting document right there and then. Can return old or new doc
//This is different from doing query then update by replacing the doc with the result of
//result of your query, because something might change about the doc earlier by the time the update occurs.
//In place update, so you do update then query the resulting document. Change might occur
//in that time frame

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err,db){
  if(err) throw err;

  var query = {'assignment': 'hw3'};

  db.collection('grades').remove(query, function(err, removed){
    if(err) throw err;

    console.dir("successully removed " + removed + "document");

    return db.close();
  })
});

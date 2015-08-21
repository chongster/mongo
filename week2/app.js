var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db){
  if(err) throw err;

  var query = {'grade' : 100};

  //find one occurance that meets the condition
  //db.collection('grades').findOne(query, function(err, doc){
  //find all occurance that meets the condition
  /*db.collection('grades').find(query).toArray(function(err, doc){
    if (err) throw err;

    console.dir(doc);

    db.close();
  });*/

  //using cursor
  var cursor = db.collection('grades').find(query);

  cursor.each(function(err, doc) {
    if(err) throw err;
    //when we exhaust the cursor close the connection
    if(doc == null) {
      return db.close();
    }
    console.dir(doc.student + " got a good grade!")
  });
});

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db){
  if(err) throw err;

  //var doc = {'student': 'Calvin', 'age': 6};
  var doc = [{'student': 'Calvin', 'age': 4},
              {'student': 'Susie', 'age': 8}];
  db.collection('students').insert(doc, function(err, inserted){
    //if(err) throw err;
    //nicer version
    if(err) {
      console.log(err.message);
      return db.close();
    }

    console.dir("successfully inserted: " + JSON.stringify(inserted));
    return db.close();
  });
});

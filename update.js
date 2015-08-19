//update with replacement not as efficient
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/course', function(err, db){
  if(err) throw err;

  var query = {'assignment': 'hw1'};
  var options = {
    'skip': 1
  };
  db.collection('grades').findOne(query,{}, options, function(err,doc){
    if (err) throw err;

    if(!doc){
      console.log('No documents for assignment ' + query.assignment + 'found');
      return db.close();
    }
    //make sure that the document is the same document we got in findOne
    query['_id'] = doc['_id'];
    //add a date return to the document
    doc['date_returned'] = new Date();

    db.collection('grades').update(query, doc, function(err, updated){
      if(err) throw err;
      console.dir("successfully updated " + updated + "document");
      return db.close();
    });
  });

});

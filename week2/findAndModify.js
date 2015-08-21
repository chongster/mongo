//findAndModify finds, modify, return the resulting document right there and then. Can return old or new doc
//This is different from doing query then update by replacing the doc with the result of
//result of your query, because something might change about the doc earlier by the time the update occurs.
//In place update, so you do update then query the resulting document. Change might occur
//in that time frame

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err,db){
  if(err) throw err;

  var query = {'student': 'Joe'};
  var sort = {};
  var operator = {'$inc' : {'counter': 1}};
  var options = {'new' : true};

  db.collection('students').findAndModify(query, sort, operator, options, function(err,doc){
    if(err) throw err;

    if(!doc.value) {
      console.log("No counter found for comments");
    }
    else {
      console.log("Number of comments: " + doc.value.counter);
    }

    return db.close();
  });
});

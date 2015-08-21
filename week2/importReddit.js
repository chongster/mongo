var MongoClient = require('mongodb').MongoClient,
    request = require('request');

MongoClient.connect('mongodb://localhost:27017/course', function(err, db){
  if(err) throw err;

  request('https://www.reddit.com/r/technology/.json', function(error, response, body){
    if(!error && response.statusCode == 200) {
      //parse the website body as json object (basically parsing our JSON string into the native javascript object)
      var obj = JSON.parse(body);
      //map the story array and return only the stories
      var stories = obj.data.children.map(function(story) {
        return story.data;
      });

      db.collection('reddit').insert(stories, function(err, data){
        if(err) throw err;

        console.dir(data);
        db.close();
      });
    }
  });

});

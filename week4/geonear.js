//mongo < geonear.js : This will run the query in mongo
db.places.find({
  location:{
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-122.2142323, 37.2341324]
      }
      , $maxDistance: 2000
    }
  }
}).pretty()

use zipcodes
db.zips.aggregate([
  {$group:{
    //get total population for each city
    _id: {state:"$state", city:"$city"},
    population: {$sum:"$pop"}
  }},
  //sort by state, population
  {$sort:{
    "_id.state":1, "population":1
  }},
  {$group:{
   _id:"$_id.state",
   city:{$last:"$_id.city"},
   population:{$last:"$population"}
 }},
 {$sort:{_id:1}},
 {$project:{
   _id:0,
   'state':"$_id",
   'name':"$city",
   'pop':"$population"
 }}
])

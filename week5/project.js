use agg
db.products.aggregate([
  {$project:{
    _id:0, //hide id
    'maker':{$toLower:"$manufacturer"}, 
    'details':{'category':"$category", 'price':{"$multiply":["$price":10]}},
    'item':"$name"
  }}
])

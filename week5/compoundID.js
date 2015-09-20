use agg
db.products.aggregate([
  {$group:{
    _id:{
      "maker":"$manufacturer",
      "category":"$category"
    },
    num_products:{$sum:1}
  }}
])

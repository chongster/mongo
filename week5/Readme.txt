Aggregate() is function is similar to Group By in SQL. It basically allows us to
pick out the fields in the collection and perform simple analysis on them like
sum, avg, min, max etc.

db.collection.aggregate([ //aggregate use array because there can be lot of options
  {$group: //choose what field to display
    _id:"$field",
    value:{$sum:1} //perform operation on the selected field
  }

])

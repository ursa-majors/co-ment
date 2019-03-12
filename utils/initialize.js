/***********************************************************
* INITIALIZE.JS
* =============
* A utility script to initialize mongoDB fields on
* existing collections.
*
* To use:
* 1. Update the Schema for the collection you want to modify,
*    adding the new fields to the Schema.
* 2. Modify the initialize function on the last line, below
*    Arg1 = the Collection you are updating. This is not a
*           string, it is the imported model object
*    Arg2 = An object representing the new field with the shape:
*           {
*             name: 'fieldname.may.be.nested',
*             defaultValue: < the default value you want to use>
*           }
*    The name property is a string. Nested levels separated by '.'
* 3. Run `node ./utils/initialize.js` from the base co/ment
*    directory (because .env file is needed)
************************************************************/
const dotenv = require('dotenv').config()
const db = require('../db')
const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const Connection = require('../models/connection')

console.log(db.getDbConnectionString())

// new Mongo ( >= 4.11.0 ) connection logic:
mongoose.connect(db.getDbConnectionString(), {
  useMongoClient: true
})

// set Mongoose promises = Node es6 promises
mongoose.Promise = global.Promise

/*
*  First identify the documents to be updated, by querying
*  where the field.name does not exist.
*
*  Update the set of documents with the default value
*  The result is an object describing the update that
*  occured.
*  Log the results (expect all document in collection
*   to be updated).
*  Close DB connection
*/
function initialize (collection, field) {
  const query = { [field.name]: { $exists: false } }
  const update = { [field.name]: field.defaultValue }
  const options = { multi: true }

  collection.update(query, update, options)
    .exec()
    .then(result => {
      console.log(`Documents modified: ${result.nModified}`)
      return result.nModified
    })
    .then(() => {
      mongoose.connection.close()
    })
    .catch(err => {
      console.log('hi', err)
      return console.log(err)
    })
}

initialize(User, { name: 'contactMeta.unSubbed', defaultValue: false })

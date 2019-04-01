/* mongo-add-student - 10am */

'use strict'
const log = console.log

// const MongoClient = require('mongodb').MongoClient
// const ObjectID = require('mongodb').ObjectID

const { MongoClient, ObjectID } = require('mongodb')

// Object 'destructuring'
const student = {name: 'Jimmy', year: 3}
const { name } = student
log(name)

// Connect to the local mongo database
MongoClient.connect('mongodb://localhost:27017/StudentAPI', (error, client) => {
	if (error) {
		log("Can't connect to Mongo server")
	} else {
		log('Connected to mongo server')
	}

	const db = client.db('StudentAPI')

	// Create a collection and insert into it
	db.collection('Students').insertOne({
		//_id: 7,
		name: 'Jimmy',
		year: 3
	}, (error, result) => {
		if (error) {
			log("Can't insert student", error)
		} else {
			log(result.ops)
			log(result.ops[0]._id.getTimestamp())
		}
	})

	// close connection
	client.close()


})












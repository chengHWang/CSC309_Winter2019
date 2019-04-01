/* server.js - mar13 - 10am - mongoose*/
'use strict'
const log = console.log

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')

// import the models
const { Student } = require('./models/student')

const app = express();
// body-parser middleware
app.use(bodyParser.json())

// Set up a POST route to *create* a student
app.post('/students', (req, res) => {
	// log(req.body)

	// Create a new student
	const student = new Student({
		name: req.body.name,
		year: req.body.year
	})

	// Save student to the database
	student.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})

})



app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 
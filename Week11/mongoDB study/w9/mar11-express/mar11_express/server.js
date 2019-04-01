/* server.js - mar 11 -10am*/
'use strict';
const log = console.log

const express = require('express')

const app = express();

// Setting up a static directory for your html files
// using Express middleware
app.use(express.static(__dirname + '/pub'))



// Let's make some express 'routes'
// Express has something called a Router, which 
// takes specific HTTP requests and handles them
// based on the HTTP method and URL

// Let's make a route for an HTTP GET request to the 
// 'root' of our app (i.e. top level domain '/')

app.get('/', (req, res) => {
	// sending a string
	//res.send('This should be the root route!')

	//sending some HTML
	res.send('<h1>This should be the root route!</h1>')
})

// contact
app.get('/contact', (req, res) => {
	res.send('<h2>This is the Contact page</h2>')
})

// Error codes
app.get('/problem', (req, res) => {
	// You can indicate a status code to send back
	// by default it is 200, but it's up to you
	// if you want to send something
	res.status(500).send('There was a problem on the server')
})

app.get('/someJSON', (req, res) => {

	res.send({
		name: 'John',
		year: 3,
		courses: ['csc309', 'csc301']
	})
})







const port = process.env.PORT || 3000
app.listen(port, () => {
	log('Listening on port 3000...')
})  // common local host development port 3000
   // we've bound that port to localhost to go to our express server
   // Must restart web server whenyou make changes to route handlers


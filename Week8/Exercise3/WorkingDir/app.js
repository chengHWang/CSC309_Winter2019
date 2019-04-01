/* E3 app.js */
'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

// datetime available if needed
const datetime = require('date-and-time') 

const yargs_argv = yargs.argv
// log(yargs_argv) // uncomment to see what is in the argument array


// Finished
if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		//mean no duplicate
		log("Added restaurant "+rest[0].name + ".");
	} else {
		//means the new restaurant is duplicate and the new restaurant list is empty
		log("Duplicate restaurant not added.");
	}
}
// Finished
if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);
	log("Added reservation at "+resv.restaurant+" on "+datetime.format(resv.time,"MMM DD YYYY, h:mm A")+" for "+resv.people+" people.")
}

// Finished
if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	for(let i=0;i<restaurants.length;i++){
		log(restaurants[i].name+": "+restaurants[i].description+" - "+restaurants[i].numReservations+" active reservations")
	}
}

// Finished
if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurantByName(yargs_argv['restInfo']);
	const wantedR = restaurants[0];
	log(wantedR.name+": "+wantedR.description+" - "+wantedR.numReservations+" active reservations")
}

// Finished
if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	log("Reservations for "+restaurantName+":")
	for(let i=0;i<reservationsForRestaurant.length;i++){
		log("- "+datetime.format(new Date(reservationsForRestaurant[i].time),"MMM DD YYYY, h:mm A")+", table for "+reservationsForRestaurant[i].people)
	}
}

// Finished
if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	log("Reservations in the next hours:");
	for(let i=0;i<reservationsForRestaurant.length;i++){
		log("- "+datetime.format(new Date(reservationsForRestaurant[i].time),"MMM DD YYYY, h:mm A")+", table for "+reservationsForRestaurant[i].people)
	}
	
}

// Finished
if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	log("Checked off reservation on "+datetime.format(new Date(earliestReservation.time),"MMM DD YYYY, h:mm A")+", table for "+earliestReservation.people)
}

// Finished
if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	
	log("Reservations for "+args[0]+":")
	for(let i=0;i<resv.length;i++){
		log("- "+datetime.format(new Date(resv[i].time),"MMM DD YYYY, h:mm A")+", table for "+resv[i].people)
	}	
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()
	log("Number of restaurants: "+status.numRestaurants);
	log("Number of total reservations: "+status.totalReservations);
	log("Busiest restaurant: "+status.currentBusiestRestaurantName);
	log("System started at: "+datetime.format(new Date(status.systemStartTime),"MMM DD YYYY, h:mm A"));
}


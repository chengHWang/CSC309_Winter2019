/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

/*********/


// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	const oldstatus = JSON.parse(fs.readFileSync('status.json'));
	const newstatus = updateSystemStatus(oldstatus);
	return newstatus
}

/* Helper functions to save JSON */
const updateSystemStatus = (oldstatus) => {
	let newstatus = oldstatus;
	let allrest = getAllRestaurants();
	const numOfRest = allrest.length;
	let numOfReser = 0;
	for(let i = 0;i<allrest.length;i++){
		numOfReser += allrest[i].numReservations;
	}
	allrest.sort((Ra,Rb)=>(Ra.numReservations<Rb.numReservations));
	const busiest = allrest[0];
	newstatus.numRestaurants = numOfRest;
	newstatus.totalReservations = numOfReser;
	newstatus.currentBusiestRestaurantName = busiest.name;
	fs.writeFileSync('status.json', JSON.stringify(newstatus))
	return newstatus;
}

//Finished
const saveRestaurantsToJSONFile = (restaurants) => {
	fs.writeFileSync('restaurants.json', JSON.stringify(restaurants))
};

//Finished
const saveReservationsToJSONFile = (reservations) => {
	for(let i=0;i<reservations.length;i++){
		reservations[i].time = reservations[i].time.toString();
	}
	fs.writeFileSync('reservations.json', JSON.stringify(reservations))
};

/*********/

// Should return an array of length 0 or 1.
// Finished
const addRestaurant = (name, description) => {
	// Check for duplicate names
	let wantedRest = getRestaurantByName(name);
	if (wantedRest.length > 0){
		return [];
	}
	// if no duplicate names:
	let newRestaurant = {
		name:name,
		description:description,
		numReservations:0,
	};
	let allRest = getAllRestaurants();
	allRest.push(newRestaurant);
	
	saveRestaurantsToJSONFile(allRest)
	return [newRestaurant];
}

// should return the added reservation object
//Finished
const addReservation = (restaurant, time, people) => {
	
	let newReservation = {
		restaurant:restaurant,
		time:new Date(time),
		people:people
	};
	
	let allReser = getAllReservations()
	allReser.push(newReservation)
	saveReservationsToJSONFile(allReser)
	for (let i = 0;i<allReser.length;i++){
		allReser[i].time=new Date(allReser[i].time);
	}
	
	//And here we need to update the restaurant's reservaton #
	let allRest = getAllRestaurants();
	for(let i=0;i<allRest.length;i++){
		if(allRest[i].name == restaurant){
			allRest[i].numReservations += 1;	
		}
	}
	saveRestaurantsToJSONFile(allRest);
	
	return newReservation;
}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
// Finished 
const getAllRestaurants = () => {
	let allRestaurants = [];
	try{
		allRestaurants = JSON.parse(fs.readFileSync('restaurants.json'));
	}catch(e){
		fs.writeFileSync('restaurants.json',JSON.stringify(allRestaurants))
	}
	return allRestaurants;
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
// Finished
const getRestaurantByName = (name) => {
	let allRestaurants = getAllRestaurants();
	let theWantedRestaurant = allRestaurants.filter((restaurant) => restaurant.name == name)
	return theWantedRestaurant;
};

// Should return an array - check to make sure reservations.json exists
// Finished
const getAllReservations = () => {
	let allReservation = [];
	try{
		allReservation = JSON.parse(fs.readFileSync('reservations.json'));
	}catch(e){
		fs.writeFileSync('reservations.json',JSON.stringify(allReservation))
	}
	for (let i = 0;i<allReservation.length;i++){
		allReservation[i].time=new Date(allReservation[i].time);
	}
	return allReservation;
};

// Should return an array
// Finished
const getAllReservationsForRestaurant = (name) => {
	const allReservations = getAllReservations();
	const reservationsForThisRest = allReservations.filter((reservation)=>reservation.restaurant==name);
	reservationsForThisRest.sort((RA,RB)=>(RA.time)>(RB.time));
	return reservationsForThisRest;
};


// Should return an array
// Finished
const getReservationsForHour = (time) => {
	const allRes = getAllReservations();
	let dueTime = new Date(time);
	dueTime.setHours(dueTime.getHours()+1);
	const nextHourRes = allRes.filter((res)=>(new Date(res.time))>=new Date(time) && (new Date(res.time))<dueTime)
	return nextHourRes
}

// should return a reservation object
// Finished
const checkOffEarliestReservation = (restaurantName) => {
	let allRes = getAllReservations();
	let allResForRest = getAllReservationsForRestaurant(restaurantName);
	const checkedOffReservation = allResForRest[0]; 
	
	let index = -1;
	for (let i = 0;i<allRes.length;i++){
		if((allRes[i].restaurant==checkedOffReservation.restaurant)&&(allRes[i].time.toString() == checkedOffReservation.time.toString())){
			index = i;
		}
	}
	if(index > -1){
		allRes.splice(index,1);
	}
	
	//And here we need to update the restaurant's reservaton #
	let allRest = getAllRestaurants();
	for(let i=0;i<allRest.length;i++){
		if(allRest[i].name == restaurantName){
			allRest[i].numReservations -= 1;	
		}
	}
	saveRestaurantsToJSONFile(allRest);
	
	
	saveReservationsToJSONFile(allRes);
 	return checkedOffReservation;
}

// Finished
const addDelayToReservations = (restaurant, minutes) => {
	let allRes = getAllReservations();
	for (let i=0;i<allRes.length;i++){
		if(allRes[i].restaurant == restaurant){
			let time = allRes[i].time;
			time.setTime(time.getTime() + (minutes*60*1000));
		}
	}
	saveReservationsToJSONFile(allRes)
	let output = [];
	output = getAllReservationsForRestaurant(restaurant)
	return output;
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in appapp.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}


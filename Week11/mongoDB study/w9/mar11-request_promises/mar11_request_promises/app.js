'use strict';
const log = console.log
log('Mar. 6 - 10am')

const request = require('request');

const bikes = require('./bike-location-promise')
const address = require('./address-promise')

/*
bikes.stationInformation(7000, (errorMessage, result) => {
	if (errorMessage) {
		log(errorMessage)
	} else {
		log(result) // we know that result exists here

		address.getAddress(result.lat, result.lon, (errorMessage, addressResult) => {
			if (errorMessage) {
				log(errorMessage)
			} else {
				log(`The address for bike station ${result.name} is ${addressResult.address}`)
			}
		})
	}
})

*/



bikes.stationInformation(7001).then((result) => {
	log(result) // we know that result exists here
	return address.getAddress(result.lat, result.lon)
}).then((addressResult) => {
	log(`The address for bike station is ${addressResult.address}`)
}).catch((error) => {
	log(error)
})












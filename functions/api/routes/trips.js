const express = require('express');
const router = express.Router();

const trips = require('../../database/tripsData');

// get trips given user id and status
// get a trips details for given trip id

/**
 * Gets a list of trips for a given user for the given status (planned, active, complete).
 */
router.get('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    const status = req.query.status;
    console.log(status);
    try {
        const data = await trips.getUsersTrips(id, status);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({data});
    } catch (err) {
        next(err);
    }
});

/**
 * Gets a trips details given the user id and trip id.
 */
router.get('/trip/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const tripId = req.query.trip;
    console.log(tripId);
    try {
        //const data = await trips.getTrip(userId, tripId);
        const users = await trips.getTripUsers(tripId);
        const legs = await trips.getTripLegs(tripId);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({"users": users, "legs": legs});
    } catch (err) {
        next(err);
    }
});

/**
 * Updates a trips details.
 */
router.patch('/trip/:id', async(req, res, next) => {
    const tripId = parseInt(req.params.id);
    const updates = req.body;
    try {
        const response = await trips.patchTrip(tripId, updates);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({"message": "success"});
    } catch (err) {
        next(err);
    }
});

/**
 * Creates a new trip - entries in the tripuser table and trip details table. Also creates a default leg which has the info taken from
 * the trip and links the leg to the trip.
 */
router.post('/trip/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const data = req.body;
    try {
        const response = await trips.postTrip(userId, data);
        data.tripId = response[5][0].ID;
        const leg = await trips.postLeg(userId, data);
        console.log(response);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({data: response[5], leg: leg[5]});
    } catch (err) {
        next(err);
    }
});

/**
 * Adds a user to a trip
 */
router.post('/trip/user/:tripId', async(req, res, next) => {
 const tripId = parseInt(req.params.tripId);
 const userId = req.body.user;
 try {
    const response = await trips.addTripUser(userId, tripId);
    //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
    res.status(200).json({"message": "success"});
    } catch (err) {
        next(err);
    }
});

/**
 * Deletes a user from a trip and subseuqently any activities associated with that trip.
 */
router.delete('/trip/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const tripId = req.query.trip;
    // remove from all activities then remove from trip.
    const response = await trips.removeTripUser(userId, tripId);
    //res.json({status: 'success', data: {user}});
    res.status(200).json({message: "user removed from trip"});
});


module.exports = router;

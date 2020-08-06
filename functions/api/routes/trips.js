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
        const legs = await trips.getTripLegs(tripId, userId);
        const activities = await trips.getLegActivities(tripId, userId);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({"users": users, "legs": legs, "activities": activities});
    } catch (err) {
        next(err);
    }
});

/**
 * Updates details for an entry.
 */
router.patch('/trip/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const type = req.body.type;
    try {
        if (type === 'trip') {
            await trips.patchTrip(id, updates);
        } else if (type === 'leg') {
            await trips.patchLeg(id, updates);
        } else {
            await trips.patchActivity(id, updates);
        }
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
        data.trip = response[5][0].ID;
        const leg = await trips.postLeg(userId, data);
        console.log(response);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({data: response[5], leg: leg[5]});
    } catch (err) {
        next(err);
    }
});

/**
 * Creates a new leg and links it to the trip and user.
 */
router.post('/leg/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const data = req.body;
    try {
        const response = await trips.postLeg(userId, data);
        console.log(response);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({data: response[5]});
    } catch (err) {
        next(err);
    }
});

router.post('/activity/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const data = req.body;
    try {
        const response = await trips.postActivity(userId, data);
        console.log(response);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({data: response[5]});
    } catch (err) {
        next(err);
    }
});

/**
 * Adds a user to a trip
 */
router.post('/trip/user/:id', async(req, res, next) => {
 const id = parseInt(req.params.id);
 const values = req.body;
 try {
     if (values.type === 'trip') {
        await trips.addTripUser(values.user, id);
     } else if(values.type === 'leg') {
        await trips.addLegUser(parseInt(values.user), id, parseInt(values.tripId));
     } else {
        await trips.addActivityUser(values.user, id, parseInt(values.legId));
     }
    //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
    res.status(200).json({"message": "success"});
    } catch (err) {
        next(err);
    }
});

/**
 * Deletes a user from a an itinerary item (trip, leg or activity) and any other associated items.
 * If a trip removes from trip, legs and activities. If a leg removes leg and activities. If an activity removes from activity.
 */
router.delete('/leave/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const id = parseInt(req.query.id);
    const type = req.query.type;
    try {
        if (type === 'trip') {
            console.log("about to await trip");
            await trips.removeTripUser(userId, id);
        } else if (type === 'leg') {
            await trips.removeLegUser(userId, id);
        } else {
            await trips.removeActivityUser(userId, id);
        }
        res.status(200).json({message: "user removed from trip"});
    } catch(err) {
        next(err);
    }

    // remove from all activities then remove from trip.
    //const removeTrip = await trips.removeTripUser(userId, tripId);
    //const removeLegs = await trips.removeLegUser(userId, tripId);
    //await Promise.all([trips.removeTripUser(userId, tripId), trips.removeLegUser(userId, tripId)]);
    //res.json({status: 'success', data: {user}});
    
});

module.exports = router;

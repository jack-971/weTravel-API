const db = require('./database');
const { param } = require('../api/routes/trips');

/**
 * Queries database for a set of user trips for a given user id and a given trip status.
 * @param {*} userId 
 */
function getUsersTrips(userId, status) {
    var sql = "SELECT * FROM WT_Trip INNER JOIN WT_TripUsers ON WT_Trip.ID = WT_TripUsers.TripID \
    INNER JOIN WT_TripStatus ON WT_TripUsers.TripStatusID = WT_TripStatus.TripStatusID\
    WHERE userID = ? AND TripStatus = ? ORDER BY DateStart IS NULL, DateStart"
    if (status === 'complete') {
        sql = sql + " DESC;";
    } else {
        sql = sql + ";"
    }
    const parameter = [userId, status];
    const errorMessage = "Error retrieving user trip list from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database for a set of user trips for a given user id and a given trip status.
 * @param {*} userId 
 */
function getTripUsers(tripId) {
    var sql = "SELECT WT_TripUsers.UserID, Name FROM `WT_TripUsers` INNER JOIN WT_UserProfile ON WT_TripUsers.UserID = WT_UserProfile.UserID \
    WHERE TripID = ?;";
    const parameter = [tripId];
    const errorMessage = "Error retrieving trips users from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database for a list of legs associated with a trip Id.
 * @param {*} tripId 
 */
function getTripLegs(tripId) {
    var sql = "SELECT * FROM WT_TripLeg INNER JOIN WT_Leg ON WT_TripLeg.LegID = WT_Leg.ID WHERE TripID = ? \
                ORDER BY DateStart IS NULL, DateStart;";
    const parameter = [tripId];
    const errorMessage = "Error retrieving trip legs from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database to add a new trips details. 
 * @param {*} tripId 
 * @param {*} updates 
 */
function postLeg(userId, updates) {
    const sql = "START TRANSACTION; \
    INSERT INTO WT_Leg VALUES (NULL, ?, ?, ?, ?, ?); \
    SET @last_leg_id = LAST_INSERT_ID(); \
    INSERT INTO WT_TripLeg VALUES (?, @last_leg_id, ?); \
    COMMIT; \
    SELECT * FROM WT_Leg WHERE ID = @last_leg_id;";
    parameter = [updates.name, db.checkNull(updates.startDate), db.checkNull(updates.finishDate), db.checkNull(updates.description), 
        db.checkNull(updates.location), userId, updates.tripId];
    const errorMessage = "Error adding leg to database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

/**
 * Queries database to update a trips details. 
 * @param {*} tripId 
 * @param {*} updates 
 */
function patchTrip(tripId, updates) {
    const sql = "UPDATE WT_Trip SET Name = ?, DateStart=?, DateFinish=?, Description=?, Location=?, Picture = ? \
     WHERE ID = ?;"
    parameter = [updates.name, db.checkNull(updates.startDate), db.checkNull(updates.finishDate), db.checkNull(updates.description), 
        db.checkNull(updates.location), db.checkNull(updates.picture), tripId];
    const errorMessage = "Error updating trip in database";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database to add a new trips details. 
 * @param {*} tripId 
 * @param {*} updates 
 */
function postTrip(userId, updates) {
    const sql = "START TRANSACTION; \
    INSERT INTO WT_Trip VALUES (NULL, ?, ?, ?, ?, ?, ?); \
    SET @last_trip_id = LAST_INSERT_ID(); \
    INSERT INTO WT_TripUsers VALUES (?, @last_trip_id, 1); \
    COMMIT; \
    SELECT * FROM WT_Trip WHERE ID = @last_trip_id;";
    parameter = [updates.name, db.checkNull(updates.picture), db.checkNull(updates.startDate), db.checkNull(updates.finishDate), db.checkNull(updates.description), 
        db.checkNull(updates.location), userId];
    const errorMessage = "Error updating trip in database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

/**
 * Query to add a user to a trip in the database. Automatically inserts trip status in planned phase.
 * @param {*} userId 
 * @param {*} tripId 
 */
function addTripUser(userId, tripId) {
    const sql = "INSERT INTO WT_TripUsers VALUES (?, ?, ?);";
    parameter = [userId, tripId, 1];
    const errorMessage = "Error adding user to trip";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query deletes a user from the trip user table so they are no longer linked to that trip.
 * @param {*} userId 
 * @param {*} tripId 
 */
function removeTripUser(userId, tripId) {
    const sql = "DELETE FROM WT_TripUsers WHERE UserID = ? AND TripID = ?;";
    parameter = [userId, tripId];
    const errorMessage = "Error removing user from trip";
    return db.queryDb(sql, parameter, errorMessage);
}


module.exports = {
    getUsersTrips,
    getTripUsers,
    getTripLegs,
    patchTrip,
    addTripUser,
    removeTripUser,
    postTrip,
    postLeg
}

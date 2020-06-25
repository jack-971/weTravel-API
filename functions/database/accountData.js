const db = require('./database');
const { param } = require('../api/routes/account/account-profile');

function getAccountProfile(userId) {
    const sql = 'SELECT * FROM WT_UserProfile WHERE UserProfileID = (SELECT ProfileID FROM WT_User WHERE UserId=?);'
    const parameter = userId;
    const errorMessage = "Error retrieving user from database."
    return db.queryDb(sql, parameter, errorMessage);
}

function patchAccountProfile(userId, query) {
    const sql = "UPDATE `WT_UserProfile` SET `Name` = ?, `HomeLocation` = ?, `ProfilePicture` = ?, `Description` = ? WHERE UserProfileID = \
                (SELECT ProfileId FROM WT_User WHERE UserId = ?);"
    const parameter = [query.name, query.home, query.image, query.description, userId,];
    const errorMessage = "Error updating profile in database."
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    getAccountProfile,
    patchAccountProfile
}


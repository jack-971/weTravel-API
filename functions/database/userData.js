const db = require('./database');

function getUserAccount(userId) {
    const sql = 'SELECT * FROM WT_UserProfile WHERE UserProfileID = (SELECT ProfileID FROM WT_User WHERE UserId=?);'
    const parameter = userId;
    const errorMessage = "Error retrieving user from database."
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    getUserAccount
}


const mysql = require("mysql");

const pool = mysql.createPool({
    /*connectionLimit : 1,
    host: Config.appSettings().database.host,
    user: Config.appSettings().database.username,
    password: Config.appSettings().database.password,
    database: Config.appSettings().database.database*/
    connectionLimit: 1,
    //host: '34.89.126.80',
    user: 'user_1',//process.env.SQL_USER,
    password: 'user_123',//process.env.SQL_PASSWORD,
    database: 'jmccambridge06',//process.env.SQL_NAME
    socketPath: '/cloudsql/travel-with-4cd49:europe-west2:csc7057-instance'
});

/**
 * Takes an sql line with insert parameter and returns an error or result.
 * @param {*} sql 
 * @param {*} parameter 
 * @param {*} errorMessage 
 */
function queryDb(sql, parameter, errorMessage) {
    return new Promise(function(resolve,reject) {
            userAccountInfo = pool.query(sql, [parameter], (err, result) => {
                if (err) {
                    console.log(errorMessage);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
}

module.exports = {
    pool: pool,
    queryDb
}

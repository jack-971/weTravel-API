const functions = require('firebase-functions');
const express = require('express');

const app = express();

const mysql = require('mysql');
const bodyparser = require('body-parser');

app.use(bodyparser.json());
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('REST API listening on PORT '+port);
});

app.get('/', async(req, res) => {
    res.json({status: 'API is ready to serve in Ulster'});
});

app.get('/users/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    const user = await getUser(id);
    res.json({status: 'success', data: {user}});
});

let cachedDbPool;
function getDbPool() {
    console.log("going to attempt db");
    if (!cachedDbPool) {
        
        cachedDbPool = mysql.createPool({
            connectionLimit: 1,
            //host: '34.89.126.80',
            user: 'user_1',//process.env.SQL_USER,
            password: 'user_123',//process.env.SQL_PASSWORD,
            database: 'csc7057db',//process.env.SQL_NAME
            socketPath: '/cloudsql/travel-with-4cd49:europe-west2:csc7057-instance'
        });
    }
    return cachedDbPool;
}

async function getUser(id) {
    return new Promise(function(resolve,reject) {
        const sql = 'SELECT * FROM users WHERE id=?;';
        getDbPool().query(sql, [id], (err,result) => {
            resolve(result);
        });

    });
}

app.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
});

app.get('/employees', (req, res) => {
    res.json({ username: 'tester-1' })
});

app.get('/timestamp-cached', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.send(`${Date.now()}`);
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);

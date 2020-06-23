const functions = require('firebase-functions');

const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const errorHandlers = require('./api/middleware/errorhandlers');

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('REST API listening on PORT '+port);
});

app.get('/', async(req, res) => {
    res.json({status: 'API is ready to serve in Ulster'});
});

// Connect routes
const userRoute = require('./api/routes/user');
app.use('/user', userRoute);

// Handle invalid routes and any thrown errors
app.use(errorHandlers.errorHandling.notFound);
app.use(errorHandlers.errorHandling.handleError);

/*
app.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
});

app.get('/employees', (req, res) => {
    res.json({ username: 'tester-1' })
});

app.get('/timestamp-cached', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.send(`${Date.now()}`);
});*/
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);

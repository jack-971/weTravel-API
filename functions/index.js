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
    res.json({status: 'API is ready to go'});
});

// Connect routes
const profileRoute = require('./api/routes/profile');
app.use('/profile', profileRoute);
const usersRoute = require('./api/routes/users');
app.use('/users', usersRoute);
const settingsRoute = require('./api/routes/settings');
app.use('/settings', settingsRoute);


// Handle invalid routes and any thrown errors
app.use(errorHandlers.errorHandling.notFound);
app.use(errorHandlers.errorHandling.handleError);

exports.app = functions.https.onRequest(app);

const express = require('express');
const router = express.Router();

const user = require('../../database/usersData');

/**
 * Get the user account information for the given id. 
 */
router.get('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const data = await user.getUserFriends(id);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({data});
    } catch (err) {
        next(err);
    }
});

/**
 * Returns a list of users matching or closely matching a search query string
 */
router.get('/search/:query', async(req, res, next) => {
    const query = req.params.query;
    console.log("here we go");
    try {
        const data = await user.getUserSearch(query);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({data});
    } catch (err) {
        next(err);
    }
});

/**
 * Adds a new relationship between two users into the database.
 */
router.post('/:id', async(req, res, next) => {
    const requestorId = parseInt(req.params.id);
    //const body = req.query.requestee;
    const body = req.body;
    console.log(body);
    const requestee = body.requestee;
    try {
        const sendRequest = await user.newFriendRequest(requestorId, requestee);
        res.status(200).json({"message": "Success"});
    } catch (err) {
        next(err);
    }
});

/**
 * Updates a relationship to friend in the database.
 */
router.patch('/:id', async(req, res, next) => {
    const requesteeID = parseInt(req.params.id);
    const body = req.body;
    console.log(body);
    const requestorID = parseInt(body.requestor);
    try {
        const sendRequest = await user.acceptFriendRequest(requestorID, requesteeID);
        res.status(200).json({"message": "Success"});
    } catch (err) {
        next(err);
    }
});

/*
router.patch('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    console.log(updates);
    const data = await user.patchAccountProfile(id, updates);
    res.status(200).json({status: 'success'});
});





router.delete('/:id', async(req, res, next) => {
    //const id = parseInt(req.params.id);
    //const user = await getUser(id);
    //res.json({status: 'success', data: {user}});
    res.status(200).json({
        message: "Handling delete requests"
    });
});*/

module.exports = router;

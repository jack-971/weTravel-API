const express = require('express');
const router = express.Router();

const pool = require('../../database/database');
const user = require('../../database/userData');

const functions = require('firebase-functions');

/**
 * Get the user account information for the given id. Method takes advantage of firebase caching on local CDN.
 */
router.get('/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await user.getUserAccount(id);
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.json({status: 'success', data: {data}});
    } catch (err) {
        console.log(err);
    }
});



router.post('/', async(req, res) => {
    //const id = parseInt(req.params.id);
    //const user = await getUser(id);
    //res.json({status: 'success', data: {user}});
    const user = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(200).json({
        message: "Handling post requests",
        createdUser: user
    });
});

router.put('/:id', async(req, res) => {
    //const id = parseInt(req.params.id);
    //const user = await getUser(id);
    //res.json({status: 'success', data: {user}});
    res.status(200).json({
        message: "Handling put requests"
    });
});

router.delete('/:id', async(req, res) => {
    //const id = parseInt(req.params.id);
    //const user = await getUser(id);
    //res.json({status: 'success', data: {user}});
    res.status(200).json({
        message: "Handling delete requests"
    });
});

module.exports = router;


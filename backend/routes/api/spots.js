// backend/routes/api/spots.js
const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required.'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required.'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required.'),
    check('country')
        .exists({ checkFalsy: true })
        .isIn(['United States of America'])
        .withMessage('Country is required.'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is required.')
        .isNumeric()
        .withMessage('Latitude is not valid.'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is required.')
        .isNumeric()
        .withMessage('Longitude is not valid.'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required.')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters.'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required.'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required.'),
    handleValidationErrors
];



// GET all spots
router.get('/', async (req, res) => {
    try {
        // Retrieve all spots from the database
        const spots = await Spot.findAll();

        // Return the spots as a response
        res.json({ Spots: spots });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// GET all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
    try {
        // Retrieve all spots owned by the current user from the database
        const spots = await Spot.findAll({});

        // Return the spots as a response
        res.status(200).json({ Spots: spots });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorResponse = {
            message: 'Bad Request',
            errors: {},
        };
        errors.array().forEach((error) => {
            errorResponse.errors[error.param] = error.msg;
        });
        return res.status(400).json(errorResponse);
    }

    try {
        const spot = await Spot.create({
            ownerId: req.user.id,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            lat: req.body.lat,
            lng: req.body.lng,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        });

        await setTokenCookie(res, spot);

        return res.status(201).json({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
        });
    } catch (error) {
        console.error('Error creating spot:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

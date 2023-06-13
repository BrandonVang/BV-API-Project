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

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    try {
        // Check if the spot exists and belongs to the current user
        const spot = await Spot.findAll({
        });

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Create a new spot image
        const spotImage = await SpotImage.create({
            spotId,
            url,
            preview
        });

        return res.status(200).json(spotImage);
    } catch (error) {
        console.error('Error adding image to spot:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


// GET details of a spot by ID
router.get('/:spotId', async (req, res) => {
    try {
        const { spotId } = req.params;

        // Retrieve the spot from the database
        const spot = await Spot.findByPk(spotId, {
            include: [
                { model: SpotImage, as: 'SpotImages' },
                { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Return the spot details as a response
        res.json({
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
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: spot.numReviews,
            avgStarRating: spot.avgStarRating,
            SpotImages: spot.SpotImages.map(image => ({
                id: image.id,
                url: image.url,
                preview: image.preview
            })),
            Owner: {
                id: spot.Owner.id,
                firstName: spot.Owner.firstName,
                lastName: spot.Owner.lastName
            }
        });
    } catch (error) {
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

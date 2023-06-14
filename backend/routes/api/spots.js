// backend/routes/api/spots.js
const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const AVG = require('./review.js')
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
        .isNumeric()
        .withMessage('Price per day is required.'),
    handleValidationErrors
];



// GET all spots
router.get('/', async (req, res) => {
    try {
        const spots = await Spot.findAll({
            attributes: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'description',
                'price',
                'createdAt',
                'updatedAt',
                [
                    sequelize.literal(`
                        COALESCE(
                            (SELECT AVG(stars)
                            FROM "Reviews"
                            WHERE "Reviews"."spotId" = "Spot"."id"),
                            0
                        )`),
                    'avgRating',
                ],
            ],
            group: ['Spot.id'],
        });

        const spotsWithPreviewImage = spots.map((spot) => ({
            ...spot.toJSON(),
            createdAt: spot.createdAt.toISOString(), // Convert to desired date format
            updatedAt: spot.updatedAt.toISOString(), // Convert to desired date format
            avgRating: parseFloat(spot.getDataValue('avgRating')), // Parse the average rating to a number
            previewImage: "image url",
        }));

        res.json({ Spots: spotsWithPreviewImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET all spots owned by current user
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const spots = await Spot.findAll({
            where: {
                ownerId: userId
            },
            attributes: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'description',
                'price',
                'createdAt',
                'updatedAt',
                [
                    sequelize.literal(`
            COALESCE(
              (SELECT AVG(stars)
              FROM "Reviews"
              WHERE "Reviews"."spotId" = "Spot"."id"),
              0
            )`),
                    'avgRating',
                ],
            ],
        });

        const spotsWithPreviewImage = spots.map((spot) => ({
            ...spot.toJSON(),
            createdAt: spot.createdAt.toISOString(), // Convert to desired date format
            updatedAt: spot.updatedAt.toISOString(), // Convert to desired date format
            previewImage: "image url",
        }));

        res.json({ Spots: spotsWithPreviewImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the spot belongs to the current user (Authorization)
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "You don't have permission to add an image to this spot" });
        }

        const { url, preview } = req.body;

        const spotImage = await SpotImage.create({
            spotId: spot.id,
            url,
            preview,
        });

        res.status(200).json({
            id: spotImage.id,
            url: spotImage.url,
            preview: spotImage.preview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId, {
            attributes: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'description',
                'price',
                'createdAt',
                'updatedAt',
            ],
            include: [
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview'],
                },
                {
                    model: User,
                    as: 'User', // Use the correct alias defined in the association
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const numReviews = await Review.count({ where: { spotId: spot.id } });
        const avgStarRating = await Review.aggregate('stars', 'avg', { where: { spotId: spot.id } });

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
            createdAt: spot.createdAt.toISOString(),
            updatedAt: spot.updatedAt.toISOString(),
            numReviews,
            avgStarRating,
            SpotImages: spot.SpotImages.map((image) => ({
                id: image.id,
                url: image.url,
                preview: image.preview,
            })),
            Owner: {
                id: spot.User.id, // Access the associated user using the correct alias
                firstName: spot.User.firstName,
                lastName: spot.User.lastName,
            },
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
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
        });
    } catch (error) {
        console.error('Error creating spot:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
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
        const spot = await Spot.findByPk(req.params.spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the spot belongs to the current user (Authorization)
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "You don't have permission to edit this spot" });
        }

        // Update spot details
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        } = req.body;

        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;

        await spot.save();

        res.status(200).json({
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
            updatedAt: spot.updatedAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the spot belongs to the current user (Authorization)
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "You don't have permission to delete this spot" });
        }

        await spot.destroy();

        res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

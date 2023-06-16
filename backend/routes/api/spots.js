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


const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required.'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars rating is required.')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];




// GET all spots
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 20;
        const minLat = parseFloat(req.query.minLat);
        const maxLat = parseFloat(req.query.maxLat);
        const minLng = parseFloat(req.query.minLng);
        const maxLng = parseFloat(req.query.maxLng);
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);

        // Validation
        const errors = {};

        if (page < 1 || page > 10) {
            errors.page = 'Page must be between 1 and 10';
        }

        if (size < 1 || size > 20) {
            errors.size = 'Size must be between 1 and 20';
        }

        if (!isNaN(minLat) && !isNaN(maxLat) && minLat > maxLat) {
            errors.minLat = 'Minimum latitude is invalid';
            errors.maxLat = 'Maximum latitude is invalid';
        }

        if (!isNaN(minLng) && !isNaN(maxLng) && minLng > maxLng) {
            errors.minLng = 'Minimum latitude is invalid';
            errors.maxLng = 'Maximum longitude is invalid';
        }

        if (!isNaN(minPrice) && minPrice < 0) {
            errors.minPrice = 'Minimum price must be greater than or equal to 0';
        }

        if (!isNaN(maxPrice) && maxPrice < 0) {
            errors.maxPrice = 'Maximum price must be greater than or equal to 0';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: 'Bad Request',
                errors: errors,
            });
        }

        const filters = {};

        if (!isNaN(minLat) && !isNaN(maxLat)) {
            filters.lat = {
                [Op.between]: [minLat, maxLat],
            };
        }

        if (!isNaN(minLng) && !isNaN(maxLng)) {
            filters.lng = {
                [Op.between]: [minLng, maxLng],
            };
        }

        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            filters.price = {
                [Op.between]: [minPrice, maxPrice],
            };
        }

        const spots = await Spot.findAll({
            where: filters,
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
            limit: size,
            offset: (page - 1) * size,
        });

        const spotsWithPreviewImage = spots.map((spot) => ({
            ...spot.toJSON(),
            createdAt: spot.createdAt.toISOString(), // Convert to desired date format
            updatedAt: spot.updatedAt.toISOString(), // Convert to desired date format
            avgRating: parseFloat(spot.getDataValue('avgRating')), // Parse the average rating to a number
            previewImage: 'image url',
        }));

        res.json({ Spots: spotsWithPreviewImage, page, size });
    } catch (error) {
        throw error
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
        throw error
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
        throw error
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
        throw error
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
        throw error
    }

});


//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    try {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        const response = {
            Reviews: reviews.map(review => ({
                id: review.id,
                userId: review.userId,
                spotId: review.spotId,
                review: review.review,
                stars: review.stars,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                User: {
                    id: review.User.id,
                    firstName: review.User.firstName,
                    lastName: review.User.lastName
                },
                ReviewImages: review.ReviewImages.map(image => ({
                    id: image.id,
                    url: image.url
                }))
            }))
        };

        return res.status(200).json(response);
    } catch (error) {
        throw error
    }

});

//Create a review for a spot base on spot id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Bad Request',
                errors: errors.mapped()
            });
        }

        const spotId = parseInt(req.params.spotId, 10); // Parse the spotId as an integer
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const existingReview = await Review.findOne({
            where: { userId: req.user.id, spotId }
        });

        if (existingReview) {
            return res.status(500).json({ message: "User already has a review for this spot" });
        }

        const { review, stars } = req.body;

        const newReview = await Review.create({
            userId: req.user.id,
            spotId,
            review,
            stars
        });

        res.status(201).json({
            id: newReview.id,
            userId: newReview.userId,
            spotId: newReview.spotId,
            review: newReview.review,
            stars: newReview.stars,
            createdAt: newReview.createdAt.toISOString(),
            updatedAt: newReview.updatedAt.toISOString()
        });
    } catch (error) {
        throw error
    }

});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    try {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId === req.user.id) {
            // If the user is the owner of the spot
            const bookings = await Booking.findAll({
                where: { spotId },
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            });

            const formattedBookings = bookings.map((booking) => {
                return {
                    User: {
                        id: booking.User.id,
                        firstName: booking.User.firstName,
                        lastName: booking.User.lastName,
                    },
                    id: booking.id,
                    spotId: booking.spotId,
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt.toISOString(),
                    updatedAt: booking.updatedAt.toISOString(),
                };
            });

            res.status(200).json({ Bookings: formattedBookings });
        } else {
            // If the user is not the owner of the spot
            const bookings = await Booking.findAll({
                where: { spotId },
                attributes: ['spotId', 'startDate', 'endDate']
            });

            const formattedBookings = bookings.map(booking => ({
                spotId: booking.spotId,
                startDate: booking.startDate.toISOString().split('T')[0],
                endDate: booking.endDate.toISOString().split('T')[0]
            }));

            res.status(200).json({ Bookings: formattedBookings });
        }
    } catch (error) {
        throw error
    }

});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    try {
        const spotId = parseInt(req.params.spotId, 10); // Parse the spotId as an integer
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId === req.user.id) {
            return res.status(403).json({ message: "You are not authorized to create a booking for your own spot" });
        }

        const { startDate, endDate } = req.body;

        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    endDate: "endDate cannot be on or before startDate",
                },
            });
        }

        const existingBooking = await Booking.findOne({
            where: {
                spotId,
                [Op.or]: [
                    {
                        startDate: {
                            [Op.lte]: endDate,
                        },
                        endDate: {
                            [Op.gte]: startDate,
                        },
                    },
                    {
                        startDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                    {
                        endDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                ],
            },
        });

        if (existingBooking) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking",
                },
            });
        }

        const newBooking = await Booking.create({
            spotId,
            userId: req.user.id,
            startDate,
            endDate,
        });

        res.status(200).json({
            id: newBooking.id,
            spotId: newBooking.spotId,
            userId: newBooking.userId,
            startDate: newBooking.startDate,
            endDate: newBooking.endDate,
            createdAt: newBooking.createdAt.toISOString(),
            updatedAt: newBooking.updatedAt.toISOString(),
        });
    // } catch (error) {
    //     if (error.name === 'SequelizeValidationError') {
    //         const errors = error.errors.reduce((acc, curr) => {
    //             acc[curr.path] = curr.message;
    //             return acc;
    //         }, {});
    //         return res.status(400).json({
    //             message: 'Validation error',
    //             errors,
    //         });
    //     }
    //     console.error('Error creating booking:', error);
    //     res.status(500).json({ message: 'Internal server error' });
    // }
    } catch (error) {
        throw error
    }
})


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
        throw error
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
        throw error
    }

});


module.exports = router;

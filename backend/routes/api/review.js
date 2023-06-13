// backend/routes/api/review.ks
const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const router = express.Router();



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


// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    try {
        // Retrieve the current user's reviews and include associated spot and user information
        const reviews = await Review.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'],
                    include: [
                        {
                            model: ReviewImage,
                            attributes: ['id', 'url']
                        }
                    ]
                }
            ]
        });

        // Construct the response object
        const response = {
            Reviews: reviews.map(review => {
                return {
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
                    Spot: {
                        id: review.Spot.id,
                        ownerId: review.Spot.ownerId,
                        address: review.Spot.address,
                        city: review.Spot.city,
                        state: review.Spot.state,
                        country: review.Spot.country,
                        lat: review.Spot.lat,
                        lng: review.Spot.lng,
                        name: review.Spot.name,
                        price: review.Spot.price,
                        previewImage: review.Spot.previewImage
                    },
                    ReviewImages: review.Spot.ReviewImages.map(image => {
                        return {
                            id: image.id,
                            url: image.url
                        };
                    })
                };
            })
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


// middleware/averageRating.js
const calculateAverageRating = (req, res, next) => {
    const { reviews } = req.body;

    // Calculate the average rating
    let totalStars = 0;
    let totalReviews = reviews.length;

    for (let i = 0; i < totalReviews; i++) {
        totalStars += reviews[i].stars;
    }

    const averageRating = totalReviews > 0 ? totalStars / totalReviews : 0;

    // Add the average rating to the request object
    req.averageRating = averageRating;

    next();
};

module.exports = router, calculateAverageRating;

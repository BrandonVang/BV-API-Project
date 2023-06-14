// backend/routes/api/review.ks
const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
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
router.get('/reviews/current', requireAuth, async (req, res) => {
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
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'URL']
                }
            ]
        });

        // Fetch the spot IDs from the reviews
        const spotIds = reviews.map(review => review.spotId);

        // Retrieve the spots with the provided IDs
        const spots = await Spot.findAll({
            where: { id: spotIds },
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        });

        // Add the previewImage field to spots
        const spotsWithPreviewImage = spots.map(spot => ({
            ...spot.toJSON(),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            previewImage: "image url" // Replace "image url" with the actual URL for the preview image
        }));

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
                    Spot: spotsWithPreviewImage.find(spot => spot.id === review.spotId),
                    ReviewImages: review.ReviewImages.map(image => ({
                        id: image.id,
                        url: image.URL
                    }))
                };
            })
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Get all Reviews by a Spot's id
router.get('/spots/:spotId/reviews', async (req, res) => {
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
                    attributes: ['id', 'URL']
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
                    url: image.URL
                }))
            }))
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Create a review for a spot base on spot id
router.post('/spots/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
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
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Add an Image to a Review based on the Review's id
router.post('/reviews/:reviewId/images', requireAuth, async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Check if the review belongs to the current user
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: Review doesn't belong to the current user" });
        }

        // Check the maximum number of images per review
        const maxImagesPerReview = 10;
        const existingImagesCount = await ReviewImage.count({ where: { reviewId } });
        if (existingImagesCount >= maxImagesPerReview) {
            return res.status(403).json({ message: "Maximum number of images for this review was reached" });
        }

        const { URL } = req.body;

        const newImage = await ReviewImage.create({ reviewId, URL });

        res.status(200).json({
            id: newImage.id,
            url: newImage.URL,
        });
    } catch (error) {
        console.error('Error adding image to review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Edit a Review
router.put('/reviews/:reviewId', requireAuth, async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Check if the review belongs to the current user
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: Review doesn't belong to the current user" });
        }

        const { review: newReviewText, stars: newStars } = req.body;

        // Validate the review and stars fields
        if (!newReviewText) {
            return res.status(400).json({ message: "Bad Request", errors: { review: "Review text is required" } });
        }

        if (!Number.isInteger(newStars) || newStars < 1 || newStars > 5) {
            return res.status(400).json({ message: "Bad Request", errors: { stars: "Stars must be an integer from 1 to 5" } });
        }

        // Update the review
        review.review = newReviewText;
        review.stars = newStars;
        await review.save();

        res.status(200).json({
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        });
    } catch (error) {
        console.error('Error editing review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Delete a Review
router.delete('/reviews/:reviewId', requireAuth, async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Check if the review belongs to the current user
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: Review doesn't belong to the current user" });
        }

        // Delete the review
        await review.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Internal server error' });
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

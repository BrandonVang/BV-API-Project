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
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
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
                        url: image.url
                    }))
                };
            })
        };

        return res.status(200).json(response);
    } catch (error) {
        throw error
    }

});



// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
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

        const { url } = req.body;

        const newImage = await ReviewImage.create({ reviewId, url });

        res.status(200).json({
            id: newImage.id,
            url: newImage.url,
        });
    // } catch (error) {
    //     console.error('Error adding image to review:', error);
    //     res.status(500).json({ message: 'Internal server error' });
    // }
    } catch(error) {
        throw error
    }
});

// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
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
        throw error
    }

});


// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
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
        throw error
    }

});


// Delete a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
    try {
        const imageId = req.params.imageId;
        const image = await ReviewImage.findByPk(imageId);

        if (!image) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        const review = await Review.findByPk(image.reviewId);

        if (!review || review.userId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this Review Image" });
        }

        await image.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        throw error
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

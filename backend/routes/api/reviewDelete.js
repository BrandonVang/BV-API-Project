// backend/routes/api/review.ks
const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const router = express.Router();




// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
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


module.exports = router

// backend/routes/api/booking.js
const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const router = express.Router();


const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('Start date is required.')
        .isDate()
        .withMessage('Start date must be a valid date.'),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('End date is required.')
        .isDate()
        .withMessage('End date must be a valid date.'),
    handleValidationErrors
];

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [{ model: Spot }]
        });

        const formattedBookings = bookings.map((booking) => {
            return {
                id: booking.id,
                spotId: booking.spotId,
                Spot: {
                    id: booking.Spot.id,
                    ownerId: booking.Spot.ownerId,
                    address: booking.Spot.address,
                    city: booking.Spot.city,
                    state: booking.Spot.state,
                    country: booking.Spot.country,
                    lat: booking.Spot.lat,
                    lng: booking.Spot.lng,
                    name: booking.Spot.name,
                    price: booking.Spot.price,
                    previewImage: "image url"
                },
                userId: booking.userId,
                startDate: booking.startDate.toISOString().split('T')[0],
                endDate: booking.endDate.toISOString().split('T')[0],
                createdAt: booking.createdAt.toISOString(),
                updatedAt: booking.updatedAt.toISOString()
            };
        });

        res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
        throw error
    }
});


//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        if (booking.userId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to modify this booking" });
        }

        if (booking.endDate < new Date()) {
            return res.status(403).json({ message: "Past bookings can't be modified" });
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


        const conflictingBooking = await Booking.findOne({
            where: {
                spotId: booking.spotId,
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

        if (conflictingBooking) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking",
                },
            });
        }

        await booking.update({
            startDate,
            endDate,
        });

        res.status(200).json({
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt.toISOString(),
            updatedAt: booking.updatedAt.toISOString(),
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
        //     console.error('Error updating booking:', error);
        //     res.status(500).json({ message: 'Internal server error' });
    } catch (error) {
        throw error
    }

});

// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        if (new Date() >= new Date(booking.startDate)) {
            return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
        }

        if (booking.userId !== req.user.id) {
            const spot = await Spot.findByPk(booking.spotId);

            if (!spot || spot.userId !== req.user.id) {
                return res.status(403).json({ message: "You are not authorized to delete this booking" });
            }
        }

        await booking.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        throw error
    }
});


module.exports = router;

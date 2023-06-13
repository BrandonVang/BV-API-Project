





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

module.exports = calculateAverageRating;

import React, { useState, useEffect } from "react";
import { fetchReviews, createReviews } from "../../store/review";
import OpenModalButton from "../OpenModalButton";
import './ReviewDetails.css'
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import StarRating from "./StarRating.js"


const ReviewDetails = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [reviewText, setReviewText] = useState("");
    const [stars, setStars] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Perform the logic to submit the review to the specified spot ID
        const reviewData = {
            review: reviewText,
            stars,
        };

        dispatch(createReviews(reviewData, spotId));
        dispatch(fetchReviews(spotId));
     
        closeModal();
        setReviewText("");
        setStars(0);
    };

    useEffect(() => {
        if (submitted) {
            // Fetch the updated reviews after submission
            dispatch(fetchReviews(spotId));
            setSubmitted(false); // Reset the submission status
        }
    }, [dispatch, spotId, submitted]);


    return (
        <div className="review-container">
            <h2 className="review-box-title">How was your stay?</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    type="text"
                    placeholder="Leave your review here..."
                    value={reviewText}
                    className="review-comment"
                    onChange={(e) => setReviewText(e.target.value)}
                />

                <StarRating
                    rating={stars}
                    onChange={newRating => setStars(newRating)}
                />

                <button type="submit" disabled={reviewText.length < 10 || stars === 0}>
                    Submit Your Review
                </button>
            </form>
        </div>
    );
};

export default ReviewDetails

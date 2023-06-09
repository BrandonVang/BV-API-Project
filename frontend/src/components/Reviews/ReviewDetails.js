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
        e.preventDefault();
        const reviewData = {
            review: reviewText,
            stars,
        };
        closeModal();
        await dispatch(createReviews(reviewData, spotId));
        setReviewText("");
        setStars(0);
        setSubmitted(true);
        dispatch(fetchReviews(spotId)); // Fetch the updated reviews
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

                <div className="review-sub">
                    <button type="submit" disabled={reviewText.length < 10 || stars === 0}>
                        Submit Your Review
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewDetails

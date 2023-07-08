import { csrfFetch } from "./csrf";


// Action Type Constants
export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
export const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// Action Creators
export const loadReviews = (reviews, spotId) => ({
    type: LOAD_REVIEWS,
    reviews,
    spotId,
});
export const createReview = (review) => ({
    type: CREATE_REVIEW,
    review,
});

export const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    review,
});

export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId,
});


//thunks
export const fetchReviews = () => async (dispatch) => {
    const res = await csrfFetch('/api/reviews');

    if (res.ok) {
        const { reviews } = await res.json();
        dispatch(loadReviews(reviews));
    }
};

export const createReviews = (reviewData) => async (dispatch) => {
    const res = await csrfFetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });

    if (res.ok) {
        const { review } = await res.json();
        dispatch(createReview(review));
        return review;
    }
};

export const updateReviews = (reviewData) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });

    if (res.ok) {
        const { review } = await res.json();
        dispatch(updateReview(review));
        return review;
    }
};

export const deleteReviews = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if (res.ok) {
        dispatch(deleteReview(reviewId));
    }
};

// Initial state
const initialState = {
    spot: {},
    user: {},
};


// Reducer
const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const { reviews } = action;
            const nextState = { ...state };
            reviews.forEach((review) => {
                if (review.SpotId) {
                    nextState.spot[review.id] = review;
                } else if (review.UserId) {
                    nextState.user[review.id] = review;
                }
            });
            return nextState;
        }
        case CREATE_REVIEW:
        case UPDATE_REVIEW: {
            const { review } = action;
            const nextState = { ...state };
            if (review.SpotId) {
                nextState.spot[review.id] = review;
            } else if (review.UserId) {
                nextState.user[review.id] = review;
            }
            return nextState;
        }
        case DELETE_REVIEW: {
            const { reviewId } = action;
            const nextState = { ...state };
            Object.keys(nextState.spot).forEach((reviewId) => {
                if (nextState.spot[reviewId].id === reviewId) {
                    delete nextState.spot[reviewId];
                }
            });
            Object.keys(nextState.user).forEach((reviewId) => {
                if (nextState.user[reviewId].id === reviewId) {
                    delete nextState.user[reviewId];
                }
            });
            return nextState;
        }
        default:
            return state;
    }
};

export default reviewReducer;

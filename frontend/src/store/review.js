import { csrfFetch } from "./csrf";


// Action Type Constants
export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
export const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// Action Creators
export const loadReviews = (spotId, review) => ({
    type: LOAD_REVIEWS,
    spotId,
    review,
});

export const createReview = (review, spotId) => ({
    type: CREATE_REVIEW,
    review,
    spotId,
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
export const fetchReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
        const { Reviews: reviews } = await res.json();
        dispatch(loadReviews(spotId, reviews));
    }
};

export const createReviews = (reviewData, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
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
    spot: {

    },
    user: {

    },
};


// Reducer
const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const newState = { ...state, spot: {} }
            action.review.forEach((review) => {
                newState.spot[review.id] = review
            })

            return newState;
        }
        case CREATE_REVIEW:
            const { review } = action;

            return {
                ...state,
                spot: {
                    ...state.spot,
                    [review.id]: review,
                },
                user: {
                    ...state.user,
                    [review.id]: review,
                },

            };
        case UPDATE_REVIEW: {
            const { review } = action;
            const nextState = {
                ...state,
                spot: {
                    ...state.spot,
                    [review.spotId]: [
                        ...(state.spot[review.spotId] || []),
                        review,
                    ],
                },
            };
            return nextState;
        }
        case DELETE_REVIEW: {
            const { reviewId } = action;

            const newSpotReviews = { ...state.spot };
            delete newSpotReviews[reviewId];

            const newUserReviews = { ...state.user };
            delete newUserReviews[reviewId];

            return {
                ...state,
                spot: newSpotReviews,
                user: newUserReviews,
            };
        }
        default:
            return state;
    }
};

export default reviewReducer;

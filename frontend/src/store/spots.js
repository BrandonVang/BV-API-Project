import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';
export const ADD_SPOT_IMAGE = 'spots/ADD_SPOT_IMAGE';
export const CREATE_SPOT = 'spots/CREATE_SPOT';

/**  Action Creators: */
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

export const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot,
});

export const editSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot,
});

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId,
});

export const addSpotImage = (spotId, imageUrl) => ({
    type: ADD_SPOT_IMAGE,
    spotId,
    imageUrl,
});

export const createSpot = (spot) => ({
    type: CREATE_SPOT,
    spot,
});


/** Thunk Action Creators: */

export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const { Spots: spots } = await res.json();
        dispatch(loadSpots(spots));
    }
};

export const addSpotImages = (spotId, images) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images }),
        });

        if (res.ok) {
            const spotImages = await res.json();
            dispatch(addSpotImage(spotId, spotImages.imageUrl));
        } else {
            throw new Error('Failed to add spot images');
        }
    } catch (error) {
        console.error('Error adding spot images:', error);
    }
};

export const deleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    });

    if (res.ok) {
        dispatch(removeSpot(spotId));
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const fetchDetailedSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const spotDetails = await res.json();
        dispatch(receiveSpot(spotDetails));
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const createSpots = (spot) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot),
    });

    if (res.ok) {
        const createdSpot = await res.json();
        dispatch(receiveSpot(createdSpot));
        return createdSpot;
    } else {
        const errors = await res.json();
        return errors;
    }
};
export const updateSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot),
    });

    if (res.ok) {
        const updatedSpot = await res.json();
        dispatch(editSpot(updatedSpot));
        return updatedSpot;
    } else {
        const errors = await res.json();
        return errors;
    }
};

const initialState = {}

/** The spots reducer */
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            const loadedSpots = {};
            action.spots.forEach((spot) => {
                loadedSpots[spot.id] = spot;
            });
            return {
                ...state,
                ...loadedSpots,
            };
        case RECEIVE_SPOT:
        case UPDATE_SPOT:
            return {
                ...state,
                [action.spot.id]: action.spot,
            };
        case ADD_SPOT_IMAGE:
            return {
                ...state,
                [action.spotId]: {
                    ...state[action.spotId],
                    images: [...state[action.spotId].images, action.imageUrl],
                },
            };
        case REMOVE_SPOT:
            const { [action.spotId]: _, ...updatedState } = state;
            return updatedState;
        case CREATE_SPOT:
            return {
                ...state,
                [action.spot.id]: action.spot,
            };
        default:
            return state;
    }

};

export default spotsReducer;

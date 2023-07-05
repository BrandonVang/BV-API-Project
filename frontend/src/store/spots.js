/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';

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

/** Thunk Action Creators: */

export const fetchSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');

    if (res.ok) {
        // const spots = await res.json();array
        const { Spots: spots } = await res.json();
        dispatch(loadSpots(spots));
    }
};

export const addSpotImages = (spotId, images) => async (dispatch) => {
    try {
        const res = await fetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images }),
        });

        if (res.ok) {
            const spotImages = await res.json();
            // Dispatch an action to update the state with the newly added images
            // For example: dispatch(updateSpotImages(spotId, spotImages));
            // You can define the "updateSpotImages" action creator accordingly.
        } else {
            const errors = await res.json();
            // Handle error scenario if necessary
        }
    } catch (error) {
        // Handle error scenario if necessary
        console.error('Error adding spot images:', error);
    }
};


export const deleteSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`, {
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
    const res = await fetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const spotDetails = await res.json();
        dispatch(receiveSpot(spotDetails));
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const createSpot = (spot) => async (dispatch) => {
    const res = await fetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot),
    });

    if (res.ok) {
        const newSpot = await res.json();
        dispatch(receiveSpot(newSpot));
        return newSpot;
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const updateSpot = (spot) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spot.id}`, {
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
            const spotsState = {};
            action.spots.forEach((spot) => {
                spotsState[spot.id] = spot;
            });
            return spotsState;
        case RECEIVE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case REMOVE_SPOT:
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        default:
            return state;
    }
};

export default spotsReducer;

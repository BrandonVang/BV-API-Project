import { csrfFetch } from "./csrf";
import { fetchReviews } from "./review";

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

export const addSpotImage = (spotId, url) => ({
    type: ADD_SPOT_IMAGE,
    spotId,
    SpotImages: url
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

export const addSpotImages = (spotId, url) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (res.ok) {
            const { imageUrl } = await res.json();

            // Dispatch the action to add the image to the spot
            dispatch({
                type: ADD_SPOT_IMAGE,
                spotId,
                url: imageUrl,
            });
        } else {
            throw new Error('Failed to add spot image');
        }
    } catch (error) {
        console.error('Error adding spot image:', error);
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
        dispatch(fetchReviews(spotDetails.id)); // Fetch reviews for the spot using spot.id
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const createSpots = (newSpot) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot),
    });

    if (res.ok) {
        const createdSpot = await res.json();

        // Prepare the image URLs array
        const images = [newSpot.previewImage, newSpot.image1, newSpot.image2, newSpot.image3, newSpot.image4];
        const validImages = images.filter((url) => url !== null);

        // Create the SpotImages array
        const spotImages = validImages.map((url, index) => ({
            id: null,
            url,
            preview: !!url, // Set preview to true if there's a URL
        }));

        // Update the createdSpot object with the SpotImages array
        createdSpot.SpotImages = spotImages;

        dispatch(createSpot(createdSpot));

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



const initialState = {
    allSpots: {

    },

    singleSpot: {

    },
    orderedSpots: []

}

/** The spots reducer */
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {

            const newState = { ...state, allSpots: {} };
            action.spots.forEach((spot) => {
                newState.allSpots[spot.id] = spot;
            });
            return newState
        };

        case RECEIVE_SPOT: {
            const { spot } = action;
            return {
                ...state,
                singleSpot: {
                    ...state.singleSpot,
                    ...spot,
                    SpotImages: spot.SpotImages || [], // Make sure SpotImages is an array
                },
            };
        }
        case UPDATE_SPOT: {
            return { ...state, singleSpot: action.spot }
        }
        case REMOVE_SPOT:
            const { [action.spotId]: _, ...updatedAllSpots } = state.allSpots;
            return {
                ...state,
                allSpots: updatedAllSpots,
                singleSpot: {},
            };
        case CREATE_SPOT:
        case ADD_SPOT_IMAGE: {
            const newState = { ...state };
            const { spotId, url } = action;

            // Update the preview image for the spot in allSpots
            newState.allSpots = { ...newState.allSpots };
            newState.allSpots[spotId] = { ...newState.allSpots[spotId], previewImage: url };

            // Update the preview image for the spot in orderedSpots (if applicable)
            newState.orderedSpots = [...newState.orderedSpots];
            const spotIndex = newState.orderedSpots.findIndex((spot) => spot.id === spotId);
            if (spotIndex !== -1) {
                newState.orderedSpots[spotIndex] = { ...newState.orderedSpots[spotIndex], previewImage: url };
            }

            return newState;
        }

        default:
            return state;
    }

};

export default spotsReducer;

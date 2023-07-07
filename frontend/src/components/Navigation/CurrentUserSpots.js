import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots, deleteSpot } from '../../store/spots';
import { Link, useHistory, useParams } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import fallbackImage from '../../images/3.jpg';
import { useModal } from "../../context/Modal";

import './CurrentUserSpot.css'

const SpotManagementPage = () => {
    const dispatch = useDispatch();
    const spots = Object.values(
        useSelector((state) => (state.spots ? state.spots : []))
    );
    const userId = useSelector((state) => state.session.user?.id);
    const history = useHistory();
    const [deleteSpotId, setDeleteSpotId] = useState(null);
   const { modalContent, setModalContent, closeModal } = useModal();

    const handleDelete = async (spotId) => {
        try {
            await dispatch(deleteSpot(parseInt(spotId)));
            setDeleteSpotId(null);
            closeModal();
        } catch (error) {
            console.error("Error deleting spot:", error);
        }
    };

    const handleCancel = () => {
        closeModal();
    };


    useEffect(() => {
        if (userId) {
            dispatch(fetchSpots());
        }
    }, [dispatch, userId]);

    if (spots.length === 0) {
        return (
            <div>
                <h2>Manage Spots</h2>
                <p>No spots posted yet.</p>
                <button className="create-button" onClick={() => history.push("/spots/new")}>
                    Create a New Spot
                </button>
            </div>
        );
    }

    const userSpots = spots.filter((spot) => spot.ownerId === userId);

    return (
        <div className="manage-spots">
            <div className="manage-spots">
                <h2 className="man">Manage Spots</h2>
                <button className="create-button" onClick={() => history.push("/spots/new")}>
                    Create a New Spot
                </button>
            </div>

            <div className="manage-container">
                {userSpots.map((spot) => (
                    <div key={spot.id}>
                        <Link to={`/spots/${spot.id}`}>
                            <div className="previews">
                                {spot.previewImage ? (
                                    <img src={spot.previewImage} alt="Spot Thumbnail" />
                                ) : (
                                    <img src={fallbackImage} alt="Fallback Thumbnail" />
                                )}
                            </div>
                        </Link>
                        <div>
                            <div className="location-rating">
                                <p>{spot.city}, {spot.state}, {spot.country}</p>
                                <p><i className="fa fa-star"></i>{spot.avgRating}</p>
                            </div>

                            <div className="molla">
                                <p>Price: ${spot.price}</p>
                            </div>

                            <div className="button-group">
                                <button className="Up" onClick={() => history.push(`/spots/${spot.id}/edit`)}>
                                    Update
                                </button>

                                <OpenModalButton
                                    buttonText="Delete"
                                    onButtonClick={() => setDeleteSpotId(spot.id)}
                                    modalComponent={
                                        <>
                                            <h2 className="title-delete">Confirm Delete</h2>
                                            <p className="conf">Are you sure you want to remove this spot from the listings?</p>
                                            <div className="bye">
                                                <button className="red-button" onClick={() => handleDelete(spot.id)}>
                                                    Yes (Delete Spot)
                                                </button>
                                                <button className="dark-grey-button" onClick={handleCancel}>
                                                    No (Keep Spot)
                                                </button>
                                            </div>
                                        </>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpotManagementPage;

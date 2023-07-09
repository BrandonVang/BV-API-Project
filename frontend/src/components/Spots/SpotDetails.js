import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDetailedSpot } from '../../store/spots';
import { fetchReviews, deleteReviews } from '../../store/review';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalButton from '../OpenModalButton';
import image from '../../images/3.jpg';
import { useModal } from "../../context/Modal";
import ReviewDetails from '../Reviews/ReviewDetails';
import './SpotDetail.css';

const SpotDetail = ({ match }) => {
    const spotId = match.params.spotId;
    const spot = useSelector((state) => state.spots.singleSpot);
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews.spot);
    const userId = useSelector((state) => state.session.user?.id);
    const user = useSelector((state) => state.session.user);
    const [deleteSpotId, setDeleteSpotId] = useState(null);
    const { closeModal } = useModal();

    const handleCancel = () => {
        closeModal();
    };

    const handleDelete = async (reviewId) => {
        try {
            await dispatch(deleteReviews(parseInt(reviewId)));
            setDeleteSpotId(null);
            closeModal();
        } catch (error) {
            console.error("Error deleting spot:", error);
        }
    };

    useEffect(() => {
        dispatch(fetchDetailedSpot(spotId));
        dispatch(fetchReviews(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.SpotImages) {
        return <div>Loading...</div>;
    }

    const { name, city, state, country, SpotImages = [], description, price, Owner, avgStarRating, numReviews, ownerId } = spot;
    const ownerName = Owner ? `${Owner.firstName} ${Owner.lastName}` : 'Unknown';
    const formattedRating = spot.avgStarRating !== undefined && spot.avgStarRating !== null && spot.avgStarRating !== 0
        ? spot.avgStarRating
        : 'New';

    let previewImage;
    let renderedImages = [];

    if (SpotImages.length > 0) {
        previewImage = SpotImages[0].url;
        const remainingImagesCount = Math.max(5 - renderedImages.length, 0)
        const remainingImages = Array(remainingImagesCount).fill(
            <img src={image} className="img2 img" alt="Image2" />
        );

        if (renderedImages.length >= 1 && renderedImages.length <= 2) {
            renderedImages = [
                ...renderedImages,
                ...remainingImages.slice(0, Math.max(0, 5 - renderedImages.length))
            ];
        }
    }

    const handleReserveClick = () => {
        alert('Feature coming soon');
    };

    return (
        <div className="spot-detail">
            <h2>{name}</h2>
            <div className="location">
                {city}, {state}, {country}
            </div>

            <div className="spot-images">
                <div className="imgs">
                    {previewImage && (
                        <>
                            <img src={previewImage} className="img1" alt="Image1" />
                            {renderedImages.length > 0 ? (
                                renderedImages.map((image, index) => (
                                    <img
                                        key={`rendered-${index}`}
                                        src={image.props.src}
                                        className={`img${index + 2} img`}
                                        alt={`Image${index + 2}`}
                                    />
                                ))
                            ) : (
                                <>
                                    {[...Array(4)].map((_, index) => (
                                        <img
                                            key={`placeholder-${index}`}
                                            src={image}
                                            className={`img${index + 2} img`}
                                            alt={`Image${index + 2}`}
                                        />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="callout-box">
                <div className="info-row1">
                    <div className="hosted-by">Hosted by {ownerName}</div>
                    <p className="description">{description}</p>
                </div>
                <div className="info-row2">
                    <div className="price">
                        <div className='amount'>
                            $ {price} night

                        </div>
                        <div className="review">
                            <i className="fa fa-star"></i>
                            {formattedRating} {numReviews !== 0 && `· ${numReviews} ${numReviews === 1 && 0 ? "Review" : "Reviews"}`}
                        </div>
                    </div>
                    <button className="reserve" onClick={handleReserveClick}>
                        Reserve
                    </button>
                </div>

                <div className="place-review">
                    <i className="fa fa-star"></i>
                    {formattedRating} {numReviews !== 0 && `· ${numReviews} ${numReviews === 1 && 0 ? "Review" : "Reviews"}`}

                    <div>
                        {user !== null && (
                            <>
                                {user !== null && userId !== ownerId && !Object.values(reviews).find(review => review.userId === userId) && (
                                    <OpenModalMenuItem
                                        itemText="Post Your Review"
                                        className="custom-menu-item"
                                        modalComponent={<ReviewDetails spotId={spotId} />}
                                    />
                                )}
                            </>
                        )}
                        <div className="reviews-list">
                            {Object.values(reviews).length === 0 && userId !== undefined && ownerId !== undefined && userId !== ownerId ? (
                                <p className="no-reviews-text">Be the first to post a review!</p>
                            ) : (
                                Object.values(reviews).map((review, index) => {
                                    const reviewDate = review.createdAt ? new Date(review.createdAt) : null;
                                    const monthYear = reviewDate ? reviewDate.toLocaleString('en-US', {
                                        month: 'long',
                                        year: 'numeric',
                                    }) : '';

                                    return (
                                        <div key={`${review.id}-${index}`} className="review-item">
                                            <p>{review?.User?.firstName} {review?.User?.lastName}</p>
                                            <p className="review-date">{monthYear}</p>
                                            <p className="user-comment">{review.review}</p>
                                            {userId === review?.User?.id &&  (
                                                <OpenModalButton
                                                    className="Del"
                                                    buttonText="Delete"
                                                    buttonClassName="Delete-review"
                                                    onButtonClick={() => setDeleteSpotId(review.id)}
                                                    modalComponent={
                                                        <>
                                                            <h2 className="title-delete">Confirm Delete</h2>
                                                            <p className="conf">Are you sure you want to delete this review?</p>
                                                            <div className="bye">
                                                                <button className="red-button" onClick={() => handleDelete(review.id)}>
                                                                    Yes (Delete Review)
                                                                </button>
                                                                <button className="dark-grey-button" onClick={handleCancel}>
                                                                    No (Keep Review)
                                                                </button>
                                                            </div>
                                                        </>
                                                    }
                                                />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SpotDetail;

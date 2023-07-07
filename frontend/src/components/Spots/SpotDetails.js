import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDetailedSpot } from '../../store/spots';
import image from '../../images/3.jpg';
import './SpotDetail.css'

const SpotDetail = ({ match }) => {
    const spotId = match.params.spotId;
    const spot = useSelector((state) => state.spots[spotId]);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDetailedSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot) {
        return <div>Loading...</div>;
    }

    const { name, city, state, country, SpotImages = [], description, price, Owner, avgStarRating } = spot;
    const ownerName = Owner ? `${Owner.firstName} ${Owner.lastName}` : 'Unknown';
    const previewImage = SpotImages.length > 0 ? SpotImages[0].url : '';


    const handleReserveClick = () => {
        alert('Feature coming soon');
    };

    return (
        <div className="spot-detail">
            <h2>{name}</h2>
            <div className='location'>{city}, {state}, {country}</div>

            <div className="spot-images">
                <div className="imgs">
                    {previewImage ? (
                        <img src={previewImage} className="img1" alt="Image1" />
                    ) : (
                        <img src={image} className="img1" alt="Image1" />
                    )}
                    <img src={image} className="img2" alt="Image2" />
                    <img src={image} className="img3" alt="Image3" />
                    <img src={image} className="img4" alt="Image4" />
                    <img src={image} className="img5" alt="Image5" />
                </div>
            </div>

            <div className="callout-box">
                <div className="info-row1">
                    <div className="hosted-by">Hosted by {ownerName}</div>
                    <p className="description">{description}</p>
                </div>
                <div className="info-row2">
                    <div className="price">
                        {price} night
                        <div className="review">
                            <i className="fa fa-star"></i>
                            {avgStarRating}
                        </div>
                    </div>
                    <button className="reserve" onClick={handleReserveClick}>
                        Reserve
                    </button>
                </div>

                <div className="place-review">
                    <i className="fa fa-star"></i>
                    {avgStarRating}
                </div>
            </div>
        </div>
    );
};
export default SpotDetail;

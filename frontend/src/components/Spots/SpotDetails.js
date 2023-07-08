import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDetailedSpot } from '../../store/spots';
import image from '../../images/3.jpg';
import './SpotDetail.css';

const SpotDetail = ({ match }) => {
    const spotId = match.params.spotId;
    const spot = useSelector((state) => state.spots.singleSpot);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDetailedSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.SpotImages) {
        return <div>Loading...</div>;
    }

    const { name, city, state, country, SpotImages = [], description, price, Owner, avgStarRating } = spot;
    const ownerName = Owner ? `${Owner.firstName} ${Owner.lastName}` : 'Unknown';

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
                    {previewImage ? (
                        <>
                            <img src={previewImage} className="img1" alt="Image1" />
                            {renderedImages.length > 0 ? (
                                <>
                                    {renderedImages.map((image, index) => (
                                        <img
                                            key={`rendered-${index}`}
                                            src={image.props.src}
                                            className={`img${index + 2} img`}
                                            alt={`Image${index + 2}`}
                                        />
                                    ))}
                                    {renderedImages.length < 2 && (
                                        <img src={image} className="img2 img" alt="Image2" />
                                    )}
                                </>
                            ) : (
                                <>
                                    <img src={image} className="img3 img" alt="Image3" />
                                    <img src={image} className="img2 img" alt="Image2" />
                                    <img src={image} className="img4 img" alt="Image4" />
                                    <img src={image} className="img5 img" alt="Image5" />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {renderedImages.length > 0 ? (
                                <>
                                    <img src={renderedImages[0].props.src} className="img1" alt="Image1" />
                                    {renderedImages.slice(1).map((image, index) => (
                                        <img
                                            key={`rendered-${index}`}
                                            src={image.props.src}
                                            className={`img${index + 2} img`}
                                            alt={`Image${index + 2}`}
                                        />
                                    ))}
                                    {renderedImages.length < 2 && (
                                        <img src={image} className="img2 img" alt="Image2" />
                                    )}
                                </>
                            ) : (
                                <>
                                    <img src={image} className="img2 img" alt="Image2" />
                                    <img src={image} className="img3 img" alt="Image3" />
                                    <img src={image} className="img4 img" alt="Image4" />
                                    <img src={image} className="img5 img" alt="Image5" />
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

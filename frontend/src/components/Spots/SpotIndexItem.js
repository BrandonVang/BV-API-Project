import React from "react";
import { Link } from "react-router-dom";
import image from '../../images/3.jpg';
import './Spot.css'

const SpotIndexItem = ({ spot }) => {
    const { name, id, previewImage, city, state, avgRating, price } = spot;
    const formattedRating = avgRating !== undefined && avgRating !== 0 ? avgRating.toFixed(2) : 'New'

    return (
        <div title={name}>
            <Link to={`/spots/${id}`} className ="detail-container">
                <div className="spot-item">
                    <div className="spot-details">
                        <div className="pics">
                            <img
                                src={previewImage ? previewImage : image}
                                alt={name}
                                className="spot-thumbnail"
                            />
                        </div>
                        <div className="spot-info">
                            <div className="city-state">
                                {city}, {state}
                            </div>
                            <div className="rating">
                                <i className="fa fa-star"></i>
                                {formattedRating}
                            </div>
                        </div>
                        <div className="cost">${price} night</div>
                    </div>
                </div>
            </Link>
        </div>
    );
};


export default SpotIndexItem;

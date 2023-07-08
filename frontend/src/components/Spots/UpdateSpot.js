import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createSpots, addSpotImages } from '../../store/spots';
import { updateSpot, fetchDetailedSpot } from '../../store/spots';


const UpdateSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);
    const [country, setCountry] = useState(spot?.country || '');
    const [address, setAddress] = useState(spot?.address || '');
    const [city, setCity] = useState(spot?.city || '');
    const [state, setState] = useState(spot?.state || '');
    const [lat, setLat] = useState(spot?.lat || '');
    const [lng, setLng] = useState(spot?.lng || '');
    const [description, setDescription] = useState(spot?.description || '');
    const [name, setName] = useState(spot?.name || '');
    const [price, setPrice] = useState(spot?.price || '');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        dispatch(fetchDetailedSpot(spotId));
    }, [dispatch, spotId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create spot object
        const updatedSpot = {
            id: spot?.id,
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price,
        };

        await dispatch(updateSpot(updatedSpot));
        history.push(`/spots/${spot?.id}`);
    };

    return (
        <div className="container">
            <div className="column">
                <h1 className="title">Update your Spot</h1>
                <h3 className="sub-title">Where's your place located?</h3>
                <p className="writing">Guests will only get your exact address once they book a reservation</p>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        id="country"
                        className="input-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                    />
                    <label htmlFor="streetAddress">Street Address</label>
                    <input
                        type="text"
                        id="streetAddress"
                        className="input-street-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street Address"
                    />

                    <div className='area-container'>
                        <div className='area'>
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                className="input-city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                            />
                        </div>

                        <div className='st'>
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                id="state"
                                className="input-state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="State"
                            />
                        </div>
                    </div>

                    <div className='coord-container'>
                        <div className='coord'>
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                type="text"
                                id="latitude"
                                className="input-latitude"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                placeholder="Latitude"
                            />
                        </div>
                        <div className='coord2'>
                            <label htmlFor="longitude">Longitude</label>
                            <input
                                type="text"
                                id="longitude"
                                className="input-longitude"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                placeholder="Longitude"
                            />
                        </div>
                    </div>

                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="textarea-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters"
                    ></textarea>

                    <label htmlFor="title">Create a Title for your spot</label>
                    <input
                        type="text"
                        id="title"
                        className="input-title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name of your spot'
                    />

                    <div className='cost-container'>
                        <h4>Set a base price for your spot</h4>
                        <p>
                            Competitive pricing can help your listing stand out and rank higher in search results.
                        </p>
                    </div>

                    <div className='cost'>
                        <label className="dollar" htmlFor="price">$</label>
                        <input
                            type="number"
                            id="price"
                            className="input-price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per night"
                        />
                    </div>

                    <h4>Liven up your spot with photos</h4>
                    <p>Submit a link to at least one photo to publish your spot.</p>

                    <label htmlFor="previewImage">Preview Image URL</label>
                    <input
                        type="text"
                        id="previewImage"
                        className="input-preview-image"
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        placeholder="Preview Image URL"
                    />

                    <label htmlFor="image1">Image URL</label>
                    <input
                        type="text"
                        id="image1"
                        className="input-image1"
                        value={image1}
                        onChange={(e) => setImage1(e.target.value)}
                        placeholder="Image URL"
                    />

                    <label htmlFor="image2">Image URL</label>
                    <input
                        type="text"
                        id="image2"
                        className="input-image2"
                        value={image2}
                        onChange={(e) => setImage2(e.target.value)}
                        placeholder="Image URL"
                    />

                    <label htmlFor="image3">Image URL</label>
                    <input
                        type="text"
                        id="image3"
                        className="input-image3"
                        value={image3}
                        onChange={(e) => setImage3(e.target.value)}
                        placeholder="Image URL"
                    />

                    <label htmlFor="image4">Image URL</label>
                    <input
                        type="text"
                        id="image4"
                        className="input-image4"
                        value={image4}
                        onChange={(e) => setImage4(e.target.value)}
                        placeholder="Image URL"
                    />

                    <div className='create-but'>
                        <button type="submit" className="submit-button">
                            Update Spot
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateSpot

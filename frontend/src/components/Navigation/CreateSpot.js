import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createSpots, addSpotImages } from '../../store/spots';
import { restoreUser } from '../../store/session';
import './CreateSpot.css'
import image from '../../images/3.jpg';

function CreateSpotForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [validationErrors, setValidationErrors] = useState({});



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform form validation
        const errors = {};

        if (!country) {
            errors.country = 'Country is required';
        }

        if (!address) {
            errors.address = 'Street Address is required';
        }

        if (!city) {
            errors.city = 'City is required';
        }

        if (!state) {
            errors.state = 'State is required';
        }

        if (!description) {
            errors.description = 'Description needs to be at least 30 characters long';
        }

        if (!name) {
            errors.name = 'Name is required';
        }

        if (!price) {
            errors.price = 'Price is required';
        }

        if (!previewImage) {
            errors.previewImage = 'Preview Image is required';
        }

        if (!image1) {
            errors.image1 = 'Image URL must end in .png, .jpg, or .jpeg'
        }

        if (!lng) {
            errors.lng = 'Longitude is required'
        }

        if (!lat) {
            errors.lat = 'Latitude is required'
        }

        setValidationErrors(errors);

        // Check if there are any validation errors
        if (Object.keys(errors).length > 0) {
            return;
        }

        // Create spot object
        const newSpot = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price,
            images: [previewImage, image1, image2, image3, image4],
        };

        const createdSpot = await dispatch(createSpots(newSpot));

        if (createdSpot) {
            newSpot.images.forEach((imageUrl) => {
                dispatch(addSpotImages(createdSpot.id, imageUrl));
            });

            await dispatch(restoreUser());
            history.push(`/spots/${createdSpot.id}`);
        }
    };

    return (
        <div className="container">
            <div className="column">
                <h1 className="title">Create a New Spot</h1>
                <h3 className="sub-title">Where's your place located?</h3>
                <p className="writing">Guests will only get your exact address once they book a reservation</p>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="country">Country</label>
                    {validationErrors.country && <p className="error-message">{validationErrors.country}</p>}
                    <input
                        type="text"
                        id="country"
                        className="input-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                    />
                    <label htmlFor="streetAddress">Street Address</label>
                    {validationErrors.address && (<p className="error-message">{validationErrors.address}</p>)}
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

                            {validationErrors.city && <p className="error-message">{validationErrors.city}</p>}
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

                            {validationErrors.state && <p className="error-message">{validationErrors.state}</p>}
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
                            <label htmlFor="latitude">Latitude </label>
                            {validationErrors.lat && <p className="error-message">{validationErrors.lat}</p>}
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
                            {validationErrors.lng && <p className="error-message">{validationErrors.lng}</p>}
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
                    <p className="writing">
                        Mention the best features of your space, any special amenities like fast WiFi or parking,
                        and what you love about the neighborhood.
                    </p>
                    <textarea
                        id="description"
                        className="textarea-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters"
                    ></textarea>
                    {validationErrors.description && (
                        <p className="error-message">{validationErrors.description}</p>
                    )}

                    <label htmlFor="title">Create a Title for your spot</label>
                    <p className="writing">
                        Catch guests' attention with a spot title that highlights what makes your place special
                    </p>
                    <input
                        type="text"
                        id="title"
                        className="input-title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name of your spot'
                    />
                    {validationErrors.name && <p className="error-message">{validationErrors.name}</p>}

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
                            className="price-box"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per night"
                        />
                    </div>
                    {validationErrors.price && <p className="error-message">{validationErrors.price}</p>}

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
                    {validationErrors.previewImage && (
                        <p className="error-message">{validationErrors.previewImage}</p>
                    )}

                    <label htmlFor="image1">Image URL</label>
                    <input
                        type="text"
                        id="image1"
                        className="input-image1"
                        value={image1}
                        onChange={(e) => setImage1(e.target.value)}
                        placeholder="Image URL"
                    />
                    {validationErrors.image1 && (
                        <p className="error-message">{validationErrors.image1}</p>
                    )}

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
                            Create Spot
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSpotForm;

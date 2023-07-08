// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { createSpot, addImageToSpot } from "../../store/spots";
// import { useHistory } from "react-router-dom";
// import "./Spots.css";

// const CreateSpotForm = () => {
//     const dispatch = useDispatch();
//     const history = useHistory();
//     const [values, setValues] = useState({
//         address: "",
//         city: "",
//         state: "",
//         country: "",
//         lat: "",
//         lng: "",
//         name: "",
//         price: "",
//         description: "",
//         previewImage: "",
//         previewImage1: "",
//         previewImage2: "",
//         previewImage3: "",
//         previewImage4: "",
//         isPreview: false,
//         previewSelection: "",
//     });

//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         const newErrors = {};

//         if (!values.address) {
//             newErrors.address = "Address is required";
//         }

//         if (!values.city) {
//             newErrors.city = "City is required";
//         }

//         if (!values.state) {
//             newErrors.state = "State is required";
//         }

//         if (!values.country) {
//             newErrors.country = "Country is required";
//         }
//         if (!values.lat) {
//             newErrors.lat = "Latitude is required";
//         }
//         if (!values.lng) {
//             newErrors.lng = "Longitude is required";
//         }

//         if (!values.name) {
//             newErrors.name = "Name is required";
//         }

//         if (!values.price) {
//             newErrors.price = "Price is required";
//         }

//         if (!values.description || values.description.length < 30) {
//             newErrors.description = "Description needs a minimum of 30 characters";
//         }

//         if (!values.previewImage) {
//             newErrors.previewImage = "Preview image is required.";
//         } else if (
//             !(
//                 values.previewImage.endsWith(".jpg") ||
//                 values.previewImage.endsWith(".jpeg") ||
//                 values.previewImage.endsWith(".png")
//             )
//         ) {
//             newErrors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
//         }
//         if (
//             values.previewImage1 &&
//             !(
//                 values.previewImage1.endsWith(".jpg") ||
//                 values.previewImage1.endsWith(".jpeg") ||
//                 values.previewImage1.endsWith(".png")
//             )
//         ) {
//             newErrors.previewImage1 = "Image URL must end in .png, .jpg, or .jpeg";
//         }
//         if (
//             values.previewImage2 &&
//             !(
//                 values.previewImage2.endsWith(".jpg") ||
//                 values.previewImage2.endsWith(".jpeg") ||
//                 values.previewImage2.endsWith(".png")
//             )
//         ) {
//             newErrors.previewImage2 = "Image URL must end in .png, .jpg, or .jpeg";
//         }
//         if (
//             values.previewImage3 &&
//             !(
//                 values.previewImage3.endsWith(".jpg") ||
//                 values.previewImage3.endsWith(".jpeg") ||
//                 values.previewImage3.endsWith(".png")
//             )
//         ) {
//             newErrors.previewImage3 = "Image URL must end in .png, .jpg, or .jpeg";
//         }
//         if (
//             values.previewImage4 &&
//             !(
//                 values.previewImage4.endsWith(".jpg") ||
//                 values.previewImage4.endsWith(".jpeg") ||
//                 values.previewImage4.endsWith(".png")
//             )
//         ) {
//             newErrors.previewImage4 = "Image URL must end in .png, .jpg, or .jpeg";
//         }

//         setErrors(newErrors);
//     }, [values]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setValues((prevValues) => ({ ...prevValues, [name]: value }));
//     };
//     //taking the previous values, spreading them to create a new object,
//     //and then overriding the value of the input field that changed.

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (Object.keys(errors).length === 0) {
//             const {
//                 address,
//                 city,
//                 state,
//                 country,
//                 lat,
//                 lng,
//                 name,
//                 price,
//                 description,
//                 previewImage,
//                 isPreview,
//             } = values;
//             const spot = {
//                 address,
//                 city,
//                 state,
//                 country,
//                 lat,
//                 lng,
//                 name,
//                 description,
//                 price,
//             };
//             const imageUrl = previewImage;

//             const newSpot = await dispatch(createSpot(spot));

//             if (newSpot && newSpot.errors) {
//                 setErrors(newSpot.errors);
//             } else if (newSpot) {
//                 await dispatch(addImageToSpot(newSpot.id, imageUrl, isPreview));

//                 history.push(`/spots/${newSpot.id}`);
//             }
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div className="section">
//                 <h1>Create a new Spot</h1>
//                 <h2>Where's your place located?</h2>
//                 <p>
//                     Guests will only get your exact address once they booked a
//                     reservation.
//                 </p>

//                 <label htmlFor="address">Street Address</label>
//                 <input
//                     name="address"
//                     value={values.address}
//                     onChange={handleInputChange}
//                     placeholder="Street Address"
//                 />
//                 {errors.address && <p className="error">{errors.address}</p>}

//                 <div className="field-group">
//                     <div style={{ flex: 0.7 }}>
//                         <label htmlFor="city">City</label>
//                         {errors.city && <span className="error">{errors.city}</span>}
//                         <input
//                             name="city"
//                             value={values.city}
//                             onChange={handleInputChange}
//                             placeholder="City"
//                         />
//                     </div>
//                     <span className="comma"></span>
//                     <div style={{ flex: 0.3 }}>
//                         <label htmlFor="state">State</label>
//                         {errors.state && <span className="error">{errors.state}</span>}
//                         <input
//                             name="state"
//                             value={values.state}
//                             onChange={handleInputChange}
//                             placeholder="State"
//                         />
//                     </div>
//                 </div>

//                 <div className="field-group">
//                     <div style={{ flex: 0.5 }}>
//                         <label htmlFor="lat">Latitude</label>
//                         {errors.lat && <span className="error">{errors.lat}</span>}
//                         <input
//                             name="lat"
//                             value={values.lat}
//                             onChange={handleInputChange}
//                             placeholder="Latitude"
//                         />
//                     </div>
//                     <span className="comma"></span>
//                     <div style={{ flex: 0.5 }}>
//                         <label htmlFor="lng">Longitude</label>
//                         {errors.lng && <span className="error">{errors.lng}</span>}
//                         <input
//                             name="lng"
//                             value={values.lng}
//                             onChange={handleInputChange}
//                             placeholder="Longitude"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="section">
//                 <h2>Create a title for your spot</h2>
//                 <p>
//                     Catch guests' attention with a spot title that highlights what makes
//                     your place special.
//                 </p>

//                 <input
//                     name="name"
//                     value={values.name}
//                     onChange={handleInputChange}
//                     placeholder="Name of your spot"
//                 />
//                 {errors.name && <p className="error">{errors.name}</p>}
//             </div>
//             <div className="section">
//                 <h2>Set a base price for your spot</h2>
//                 <p>
//                     Competitive pricing can help your listing stand out and rank higher in
//                     search results.
//                 </p>
//                 <div className="field-group-price">
//                     <p>$</p>
//                     <input
//                         name="price"
//                         value={values.price}
//                         onChange={handleInputChange}
//                         placeholder="Price per night (USD)"
//                     />
//                 </div>
//                 {errors.price && <p className="error">{errors.price}</p>}
//             </div>
//             <div className="section">
//                 <h2>Describe your place to guests</h2>
//                 <p>
//                     Mention the best features of your space, any special amenities like
//                     fast wifi or parking, and what you love about the neighborhood.
//                 </p>

//                 <textarea
//                     name="description"
//                     value={values.description}
//                     onChange={handleInputChange}
//                     placeholder="Describe your place to guests"
//                     rows="10"
//                     cols="60"
//                 />
//                 {errors.description && <p className="error">{errors.description}</p>}
//             </div>
//             <div className="section">
//                 <h2>Liven up your spot with photos</h2>
//                 <p>Submit a link to at least one photo to publish your spot.</p>

//                 <input
//                     name="previewImage"
//                     value={values.previewImage}
//                     onChange={handleInputChange}
//                     placeholder="Preview Image URL"
//                 />
//                 {errors.previewImage && <p className="error">{errors.previewImage}</p>}
//                 <label htmlFor="previewImage">Set as Preview</label>
//                 <input
//                     type="radio"
//                     name="previewSelection"
//                     value="previewImage"
//                     checked={values.previewSelection === "previewImage"}
//                     onChange={handleInputChange}
//                 />

//                 <input
//                     name="previewImage1"
//                     value={values.previewImage1}
//                     onChange={handleInputChange}
//                     placeholder="Preview Image URL"
//                 />
//                 {errors.previewImage1 && (
//                     <p className="error">{errors.previewImage1}</p>
//                 )}
//                 <label htmlFor="previewImage1">Set as Preview</label>
//                 <input
//                     type="radio"
//                     name="previewSelection"
//                     value="previewImage1"
//                     checked={values.previewSelection === "previewImage1"}
//                     onChange={handleInputChange}
//                 />

//                 <input
//                     name="previewImage2"
//                     value={values.previewImage2}
//                     onChange={handleInputChange}
//                     placeholder="Preview Image URL"
//                 />
//                 {errors.previewImage2 && (
//                     <p className="error">{errors.previewImage2}</p>
//                 )}
//                 <label htmlFor="previewImage2">Set as Preview</label>
//                 <input
//                     type="radio"
//                     name="previewSelection"
//                     value="previewImage2"
//                     checked={values.previewSelection === "previewImage2"}
//                     onChange={handleInputChange}
//                 />

//                 <input
//                     name="previewImage3"
//                     value={values.previewImage3}
//                     onChange={handleInputChange}
//                     placeholder="Preview Image URL"
//                 />
//                 {errors.previewImage3 && (
//                     <p className="error">{errors.previewImage3}</p>
//                 )}
//                 <label htmlFor="previewImage3">Set as Preview</label>
//                 <input
//                     type="radio"
//                     name="previewSelection"
//                     value="previewImage3"
//                     checked={values.previewSelection === "previewImage3"}
//                     onChange={handleInputChange}
//                 />

//                 <input
//                     name="previewImage4"
//                     value={values.previewImage4}
//                     onChange={handleInputChange}
//                     placeholder="Preview Image URL"
//                 />
//                 {errors.previewImage4 && (
//                     <p className="error">{errors.previewImage4}</p>
//                 )}
//                 <label htmlFor="previewImage4">Set as Preview</label>
//                 <input
//                     type="radio"
//                     name="previewSelection"
//                     value="previewImage4"
//                     checked={values.previewSelection === "previewImage4"}
//                     onChange={handleInputChange}
//                 />
//             </div>
//             <button type="submit">Create Spot</button>
//         </form>
//     );
// };

// export default CreateSpotForm;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { Link, useHistory } from 'react-router-dom';
import './CurrentUserSpot.css'

const SpotManagementPage = () => {
    const dispatch = useDispatch();
    const spots = Object.values(
        useSelector((state) => (state.spots ? state.spots : []))
    );
    const userId = useSelector((state) => state.session.user?.id);
    const history = useHistory();

    useEffect(() => {
        if(userId) {

            dispatch(fetchSpots());
        }
    }, [dispatch]);

    if (spots.length === 0) {
        // No spots posted by the user, render the "Create a New Spot" link
        return (
            <div>
                <h2>Manage Spots</h2>
                <p>No spots posted yet.</p>

            </div>
        );
    }

    const userSpots = spots.filter((spot) => spot.ownerId === userId)

    return (
        <div className = "manage-spots">
            <div className="manage-spots">
            <h2 className='man'>Manage Spots</h2>
                <button className="create-button" onClick={() => history.push("/spots/new")}>
                    Create a New Spot
                </button>
            </div>

            <div className='manage-container'>
                {userSpots.map((spot) => (
                    <div key={spot.id}>
                        <Link to={`/spots/${spot.id}`}>
                            <div className="previews">
                                <img src={spot.previewImage} alt="Spot Thumbnail" />
                            </div>
                        </Link>
                        <div>
                            <div class="location-rating">
                            <p>{spot.city}, {spot.state}, {spot.country}</p>
                                <p><i className="fa fa-star"></i>{spot.avgRating}</p>
                            </div>

                            <div className='molla'>
                            <p>Price: ${spot.price}</p>
                            </div>

                            <div className="button-group">
                                <button className='Up'>Update</button>
                                <button className='Del'>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default SpotManagementPage;

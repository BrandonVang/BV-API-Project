import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { Link } from 'react-router-dom';

const SpotManagementPage = () => {
    const dispatch = useDispatch();
    const spots = Object.values(
        useSelector((state) => (state.spots ? state.spots : []))
    );
    const userId = useSelector((state) => state.session.user?.id);

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
        <div>
            <div>
            <h2>Manage Spots</h2>
            <Link to="/spots/new">Create a New Spot</Link>
            </div>

            <ul>
                {userSpots.map((spot) => (
                    <li key={spot.id}>
                        <div>
                            <img src={spot.previewImage} alt="Spot Thumbnail" />
                        </div>
                        <div>
                            <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
                            <p>Rating: {spot.avgRating}</p>
                            <p>Price: ${spot.price}</p>
                            <div>
                                <button>Update</button>
                                <button>Delete</button>
                            </div>
                        </div>
                        <Link to={`/spot/${spot.id}`}>View Details</Link>
                    </li>
                ))}
            </ul>


        </div>
    );
};

export default SpotManagementPage;

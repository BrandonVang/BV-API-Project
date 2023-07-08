// import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import SpotIndexItem from './SpotIndexItem';
import './Spot.css'


const SpotIndex = () => {
    const spotsObj = useSelector((state) => state.spots.allSpots)
    const spots = Object.values(spotsObj );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <section>
            <ul className="spot-grid">
                {spots.map((spot) => (
                    <SpotIndexItem
                        spot={spot}
                        key={spot.id}
                    />
                ))}
            </ul>

        </section>
    );
};

export default SpotIndex;

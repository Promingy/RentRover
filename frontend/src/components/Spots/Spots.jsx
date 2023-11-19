import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetAllSpots } from "../../store/spotsRedcuer"
import { NavLink, useNavigate } from "react-router-dom";
import './Spots.css';

export default function Spots() {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state.spots.Spots);
    const navigate = useNavigate();
    console.log('spots', allSpots)


    useEffect(() => {
        dispatch(thunkGetAllSpots());
    }, [dispatch])



    return (
        <div className="spotsWrapper">
            <h1>Spots</h1>
            <ul className='spotsContainer'>
                {allSpots && allSpots.map(spot => (
                    <li className='spots' key={`${spot.id}`} onClick={(e) => navigate(`/spot/${spot.id}`)}>
                            <img className='previewImage' src={`${spot.previewImage}`} alt={`${spot.previewImage}`} />
                            <p>{spot.city}, {spot.state}</p>
                            <p>{spot.avgRating || 'New'}</p>
                            <p>${spot.price} night</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

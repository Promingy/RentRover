import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetAllSpots } from "../../store/spotsRedcuer"
import { useNavigate } from "react-router-dom";
import './Spots.css';

export default function Spots() {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state.spots.Spots);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(thunkGetAllSpots());
    }, [dispatch])

    return (
        <div className="spotsWrapper">
            <h1>Spots</h1>
            <ul className='spotsContainer'>
                {allSpots && Array.isArray(allSpots) && allSpots.map(spot => (
                    spot &&
                    <li title={`${spot.name}`} className='spots' key={`${spot.id}`} onClick={() => navigate(`/spots/${spot.id}`)}>
                            <img className='previewImage' src={`${spot.previewImage}`} alt={`${spot.previewImage}`} />
                            <span className="locationRating">
                                <p>{spot.city}, {spot.state}</p>
                                <p className='starRating'>
                                    <i className='fa-solid fa-star star' />
                                    {spot.avgRating.toFixed(1) || 'New'}
                                </p>
                            </span>
                            <p className='locationPrice'>${spot.price} night</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { thunkGetCurrentUserSpots } from "../../store/spotsRedcuer";
import OpenModalButton from "../OpenModalButton";
import { useEffect } from "react";
import './ManageSpots.css'
import DeleteSpotModal from "../DeleteSpotModal";

export default function ManageSpots() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const allSpots = spots.userSpots && Object.values(spots.userSpots)

    useEffect(() => {
        dispatch(thunkGetCurrentUserSpots())
    }, [dispatch])


    //most styling and formatting is in Spots.css
    return (
        <div className="manageWrapper">
            <header className="manageHeader">
                <h1>Manage Your Spots</h1>
                <button className='newSpotButton' onClick={() => navigate('/spots/new')}>Create a New Spot</button>
            </header>
            <ul className="spotsContainer">
                {allSpots && Array.isArray(allSpots) && allSpots.map(spot => (
                    <li title={`${spot.name}`} className='spots manageSpotsWrapper' key={`${spot.id}`} >
                        <label className='manageSpots' onClick={() => navigate(`/spots/${spot.id}`)}>
                            <img className='previewImage' src={`${spot.previewImage}`} alt={`${spot.previewImage}`} />
                            <span className="locationRating">
                                <p>{spot.city}, {spot.state}</p>
                                <p className='starRating'>
                                    <i className='fa-solid fa-star star' />
                                    {typeof spot?.avgRating === 'number' && spot?.avgRating?.toFixed(1) || 'New'}
                                </p>
                            </span>
                            <p className='locationPrice'>${spot.price} night</p>

                        </label>
                        <div className="manageButtonsContainer">
                            <button className="updateButton" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                            <label className='deleteButtonContainer'>
                                <p className="deleteButtonText">Delete </p>
                                <OpenModalButton modalComponent={<DeleteSpotModal spotId={spot.id}/>}/>
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

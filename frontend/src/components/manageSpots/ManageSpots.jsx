import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { thunkGetCurrentUserSpots } from "../../store/spotsRedcuer";
import { useEffect } from "react";

export default function ManageSpots() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state.spots.userSpots)
    console.log(allSpots)

    useEffect(() => {
        dispatch(thunkGetCurrentUserSpots())
    }, [dispatch])

    return (
        <div>
            <header>
                <h1>Manage Your Spots</h1>
                <button onClick={() => navigate('/spots/new')}>Create a New Spot</button>
            </header>
            <main>
                <ul className="spotsContainer">
                    {allSpots && Array.isArray(allSpots) && allSpots.map(spot => (
                        spot &&
                        <li title={`${spot.name}`} className='spots' key={`${spot.id}`} onClick={() => navigate(`/spots/${spot.id}`)}>
                            <img className='previewImage' src={`${spot.previewImage}`} alt={`${spot.previewImage}`} />
                            <span className="locationRating">
                                <p>{spot.city}, {spot.state}</p>
                                <p className='starRating'>
                                    <i className='fa-solid fa-star star' />
                                    {typeof spot?.avgRating === 'number' && spot?.avgRating?.toFixed(1) || 'New'}
                                </p>
                            </span>
                            <p className='locationPrice'>${spot.price} night</p>
                            <div className="manageButtonsContainer">
                                <button className="updateButton">Update</button>
                                <button className="deleteButton">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    )
}

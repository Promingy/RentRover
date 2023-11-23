import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetAllSpots } from "../../store/spotsRedcuer"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import './Spots.css';

export default function Spots() {
    const dispatch = useDispatch();
    const location = useLocation();
    const reset = location.state?.reset
    const spots = useSelector(state => state.spots.Spots);
    const allSpots = spots && Object.values(spots)
    const navigate = useNavigate();


    const [searchparams] = useSearchParams()

    const [page, setPage] = useState(+searchparams.get("page") || 1)
    const [size, setSize] = useState(+searchparams.get("size") || 20)

    useEffect(() => {
        console.log('am I getting hit')
        if (reset) {
            dispatch(thunkGetAllSpots('page=1&size=20'))
            setPage(1)
        }else {
            dispatch(thunkGetAllSpots(`${page && `page=${page}`}${size ? `&size=${size}` : ''}`));
        }
    }, [dispatch, reset])

    return (
        <div className="spotsWrapper">
            {/* <h1>Spots</h1> */}
            <ul className='spotsContainer'>
                {allSpots && Array.isArray(allSpots) && allSpots.map(spot => (
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
                    </li>
                ))}
            </ul>
            <div className='pageButtonContainer'>
                <button className='pageButton' onClick={() => {
                    page > 1 && setPage(prevPage => --prevPage)
                    dispatch(thunkGetAllSpots(`${page && `page=${page - 1}`}${size ? `&size=${size}` : ''}`));
                    }}>
                        previous
                    </button>
                <p className='pageNumber'>{page}</p>
                <button className='pageButton' onClick={() => {
                    allSpots.length == size && setPage(prevPage => ++prevPage)
                    dispatch(thunkGetAllSpots(`${page ? `page=${page + 1}` : ''}${size ? `&size=${size}` : ''}`));
                    }}>
                        next
                    </button>
            </div>
        </div>
    )
}

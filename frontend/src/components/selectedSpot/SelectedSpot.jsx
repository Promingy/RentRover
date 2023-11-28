import { useDispatch, useSelector } from "react-redux"
import './SelectedSpot.css'
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { thunkGetSingleSpot } from "../../store/spotsRedcuer";
import Reviews from "./Reviews";

export default function SelectedSpot () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spots = useSelector(store => store.spots);
    const spot = spots.Spots !== undefined && spots.Spots[spotId]
    const spotImages = spot && spot.SpotImages
    const previewImage = spotImages && spotImages.find(image => image.preview)
    let reviewTitle;

    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId));
    }, [dispatch, spotId])

    reviewTitle = spot?.numReviews > 1 ? 'Reviews' : 'Review'


    ///Function for properly formatting the review headers
    function reviewFormatter() {
        return (
            <>
                <i className='fa-solid fa-star star' />
                {typeof spot?.avgRating == 'number' && spot?.avgRating?.toFixed(1) || 'New'} &nbsp;{spot?.numReviews > 0 && <span>·</span>} &nbsp; {spot?.numReviews > 0 && <span>{spot?.numReviews}</span>}
                {<span>&nbsp; {spot?.numReviews > 0 && reviewTitle} </span>}
            </>
        )
    }
    return (
        <>
        { spot &&
        <div className="spotWrapper">
            <h1 className='spotHeader'>{spot?.name}</h1>
            <span className='spotLocation'>{spot?.city}, &nbsp;{spot?.state}, &nbsp;{spot?.country}</span>
            <div className='spotImagesWrapper'>
                <img className='spotBigImage' src={previewImage?.url} alt={previewImage?.url}/>
                <div className='spotSmallImageContainer'>
                    {/* {spotImages && spotImages?.map((spot, idx) => (
                        idx != 0 && <img className='spotSmallImage' src={spot?.url} />
                    ))} */}
                    <img className='spotSmallImage' src={spotImages?.[1]?.url} alt={spotImages?.[1]?.url || 'No Image Available'}/>
                    <img className='spotSmallImage' src={spotImages?.[2]?.url} alt={spotImages?.[2]?.url || 'No Image Available'}/>
                    <img className='spotSmallImage' src={spotImages?.[3]?.url} alt={spotImages?.[3]?.url || "No Image Available"}/>
                    <img className='spotSmallImage' src={spotImages?.[4]?.url} alt={spotImages?.[4]?.url || 'No Image Available'}/>
                </div>
            </div>
            <div className='descriptionReserveWrapper'>
                <div className='descriptionContainer'>
                    <h2 className='hostedBy'>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</h2>
                    <p className='spotDescription'>{spot?.description}</p>
                </div>
                <div className='reserveContainer'>
                    <span className="reserveHeader">
                        <h2>${spot?.price} night</h2>
                        <h3>
                            {reviewFormatter()}
                        </h3>
                    </span>
                    <button className='reserveButton' onClick={() => alert('Feature coming soon!')}>RESERVE!</button>
                </div>
            </div>
            <h2 className='reviewsHeader'>
                {reviewFormatter()}
            </h2>
            <Reviews spotId={spotId} ownerId={spot?.ownerId}/>
        </div>
    }
        </>
    )
}

import { useDispatch, useSelector } from "react-redux"
import './SelectedSpot.css'
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { thunkGetSingleSpot } from "../../store/spotsRedcuer";
import Reviews from "./Reviews";

export default function SelectedSpot () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spots = useSelector(store => store.spots.Spots);
    const spot = spots && spots[spotId]
    const spotImages = spot && spot.SpotImages
    const previewImage = spotImages && spotImages.find(image => image.preview)

    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId));
    }, [dispatch, spotId])

    ///Function for properly formatting the review headers
    function reviewFormatter() {
        return (
            <>
                <i className='fa-solid fa-star star' />
                {spot?.avgRating.toFixed(1)} &nbsp; · &nbsp; {spot?.numReviews} {spot?.numReviews > 0 && spot?.numReviews > 1 ? 'Reviews' : 'Review'}
            </>
        )
    }
    return (
        <div className="spotWrapper">
            <h1 className='spotHeader'>{spot?.name}</h1>
            <span className='spotLocation'>{spot?.city}, &nbsp;{spot?.state}, &nbsp;{spot?.country}</span>
            <div className='spotImagesWrapper'>
                <img className='spotBigImage' src={previewImage?.url} alt={previewImage?.url}/>
                <div className='spotSmallImageContainer'>
                    <img className='spotSmallImage' src={spotImages?.[1]?.url}/>
                    <img className='spotSmallImage' src={spotImages?.[2]?.url}/>
                    <img className='spotSmallImage' src={spotImages?.[3]?.url}/>
                    <img className='spotSmallImage' src={spotImages?.[4]?.url}/>
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
    )
}

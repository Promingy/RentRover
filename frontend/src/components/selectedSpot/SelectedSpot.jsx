import { useDispatch, useSelector } from "react-redux"
import './SelectedSpot.css'
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { thunkGetSingleSpot } from "../../store/spotsRedcuer";

export default function SelectedSpot () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spots = useSelector(store => store.spots.spots);
    const spot = spots && spots[spotId]
    const spotImages = spot && spot.SpotImages
    const previewImage = spotImages && spotImages.find(image => image.preview)

    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId))
    }, [dispatch, spotId])


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
            <h2 className='hostedBy'>Hosted by {spot?.Owner.firstName} {spot?.Owner.lastName}</h2>
            <p className='spotDescription'>{spot?.description}</p>
        </div>
    )
}

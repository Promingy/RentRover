import { useEffect } from "react";
import { thunkGetSpotReviews } from "../../store/reviewsReducer";
import { useDispatch, useSelector } from "react-redux";
import './Reviews.css'

export default function Reviews ({ spotId, ownerId }) {
    const dispatch = useDispatch();
    const reviews = useSelector(store => store.reviews.Reviews)
    const sessionUser = useSelector((state) => state.session.user)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',' August', 'September', 'October', 'November', 'December']

    useEffect(() => {
        dispatch(thunkGetSpotReviews(spotId));
    }, [dispatch, spotId])


    return (
    <div className='reviewsWrapper'>
        <button className='postReviewButton' disabled={!sessionUser || ownerId == sessionUser.id}>{reviews?.length ? 'Post a Review' : 'Be the first to post a review'}</button>
        <ul className="reviewsWrapper">
            {reviews?.toReversed().map(review => {
                const date = new Date(review.updatedAt)
                const monthPosted = date.getMonth();
                const yearPosted = date.getFullYear();

                return (<li key={`${review.id}`} className='reviewContainer'>
                    <h4 className='reviewerName'>{review.User.firstName}</h4>
                    <p className="reviewPostDate">Posted on: {months[monthPosted]} {yearPosted}</p>
                    <p className='reviewText'>{review.review}</p>
                </li>)
            })}
        </ul>
    </div>
    )
}

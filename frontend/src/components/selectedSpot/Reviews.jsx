import { useEffect } from "react";
import { thunkGetSpotReviews } from "../../store/reviewsReducer";
import { useDispatch, useSelector } from "react-redux";
import ReviewFormModal from "./ReviewFormModal";
import './Reviews.css'
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

export default function Reviews ({ spotId, ownerId }) {
    const dispatch = useDispatch();
    let allReviews = useSelector(store => store?.reviews)
    const reviews = allReviews.Reviews !== undefined && Object.values(allReviews.Reviews)
    const sessionUser = useSelector((state) => state.session.user)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',' August', 'September', 'October', 'November', 'December']

    // find review posted by user
    const userPostedReview = reviews && reviews.find(review => review?.userId == sessionUser?.id)


    // set conditions to determine if button should be present
    const buttonCondition = (!userPostedReview && sessionUser && ownerId !== sessionUser?.id)

    // load all data from reviews
    useEffect(() => {
        dispatch(thunkGetSpotReviews(spotId));
    }, [dispatch, spotId])


    return (
    <div className='reviewsWrapper'>

        { buttonCondition &&
            <label className={reviews?.length ? 'postReviewButtonContainer' : 'postReviewButtonContainer2'}>
                <p className={reviews?.length ? 'postReviewButtonText' : 'postReviewButtonText2'}>{reviews?.length ? 'Post Your Review' : 'Be the first to post a review'}</p>
                <OpenModalButton modalComponent={<ReviewFormModal spotId={spotId} spot={spot} />} />
            </label>
        }

        <ul className="reviewsWrapper">
            { reviews && reviews?.toReversed().map(review => {
                const date = new Date(review?.updatedAt)
                const monthPosted = date.getMonth();
                const yearPosted = date.getFullYear();
                return (<li key={`${review?.id}`} className='reviewContainer'>
                    <h4 className='reviewerName'>{review?.userId == sessionUser?.id ? sessionUser?.firstName : review.User?.firstName}</h4>
                    <p className="reviewPostDate">Posted on: {months[monthPosted]} {yearPosted}</p>
                    <p className='reviewText'>{review?.review}</p>
                    {
                    review?.userId == sessionUser?.id &&
                    <label className="deleteReviewButtonContainer">
                        <p className="deleteReviewButtonText">Delete Review</p>
                        <OpenModalButton modalComponent={<DeleteReviewModal reviewId={review?.id} spotId={spotId}/>} />
                    </label>
                        }
                </li>)
            })}
        </ul>
    </div>
    )
}

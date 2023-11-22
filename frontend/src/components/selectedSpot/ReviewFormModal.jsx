import { useState } from 'react'
import './ReviewFormModal.css'
import { useDispatch } from 'react-redux'
import { thunkPostReview } from '../../store/reviewsReducer';
import { useModal } from '../../context/Modal';
import { thunkGetSingleSpot } from '../../store/spotsRedcuer';
export default function ReviewFormModal ({ spotId }) {
    const dispatch = useDispatch();
    const [activeRating, setActiveRating] = useState(0)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const { closeModal } = useModal()

    function createStars() {
        const returnArr = []

        for (let i = 1; i <= 5; i++) {
            returnArr.push(
                <div
                    className={activeRating >= i ? 'filled' : 'empty'}
                    onMouseEnter={() => setActiveRating(i)}
                    onClick={() => setRating(i)}
                    key={i}
                >
                    <i className='fa-sharp fa-solid fa-star' />
                </div>
            )
        }

        return returnArr
    }

    function handleSubmit (e) {
        e.preventDefault();

         dispatch(thunkPostReview(spotId, {review, stars: rating}))
            .then(closeModal).then(() => dispatch(thunkGetSingleSpot(spotId)))
    }

    return (
        <form className='postReviewForm' onSubmit={handleSubmit}>
            <h2 className='reviewFormHeader'>How was your stay?</h2>
            <textarea
                className="reviewTextArea"
                placeholder="Leave your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                />
            <div className='starRatingContainer' onMouseLeave={() => setActiveRating(rating)}>
                {createStars()}
                <h4 className='starsLabel'>Stars</h4>
            </div>
            <button className='postReviewButton' disabled={review.length < 10 || !rating}>Submit Your Review</button>
        </form>
    )
}

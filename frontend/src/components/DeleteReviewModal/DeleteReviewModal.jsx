import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal";
import { thunkDeleteReview } from "../../store/reviewsReducer";
import { thunkGetSingleSpot } from "../../store/spotsRedcuer";

export default function DeleteReviewModal ({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    async function handleSubmit(e) {
        e.preventDefault();

        await dispatch(thunkDeleteReview(reviewId))
            .then(closeModal).then(() => dispatch(thunkGetSingleSpot(spotId)))
    }
    return(
        <form className="confirmDeleteForm" onSubmit={handleSubmit}>
            <h2 className="deleteHeader">Confirm Delete</h2>
            <h3 className='deleteSubHeader'>Are you sure you want to delete this review?</h3>

            <button type='submit' className="confirmDelete">Yes (Delete Review)</button>
             <button type='button' onClick={() => closeModal()} className="dontDelete">No (Keep Review)</button>
        </form>
    )
}

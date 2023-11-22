import { useDispatch } from 'react-redux';
import './DeleteSpot.css'
import { thunkDeleteSpot } from '../../store/spotsRedcuer';
import { useModal } from '../../context/Modal';

export default function DeleteSpotModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    async function onSubmit(e) {
        e.preventDefault();

        await dispatch(thunkDeleteSpot(spotId))
        .then(closeModal)

    }

    return (
        <>
            <form className="confirmDeleteForm" onSubmit={onSubmit}>
                <h2 className='deleteHeader'>Confirm Delete</h2>
                <h3 className='deleteSubHeader'>Are you sure you want to remove this spot from the listings?</h3>

                <button type='submit' className="confirmDelete">Yes (Delete Spot)</button>
                <button type='button' onClick={() => closeModal()} className="dontDelete">No (Keep Spot)</button>
            </form>
        </>
    )
}

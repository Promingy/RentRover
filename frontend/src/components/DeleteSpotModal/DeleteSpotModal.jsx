import './DeleteSpot.css'

export default function DeleteSpotModal({ spotId }) {
    return (
        <>
            <form className="confirmDeleteForm">
                <h2 className='deleteHeader'>Confirm Delete</h2>
                <h3 className='deleteSubHeader'>Are you sure you want to remove this spot from the listings?</h3>

                <label className='deleteButtonWrapper'>
                    <button className="confirmDelete">Yes (Delete Spot)</button>
                    <button className="dontDelete">No (Keep Spot)</button>
                </label>
            </form>
        </>
    )
}

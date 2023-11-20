import './NewSpot.css'

export default function NewSpot() {
    return (
        <form className='newSpotForm'>
            <div className='newSpotHeaderWrapper'>
                <h1 className='newSpotFormHeader'>Create a New Spot</h1>
                <h2 className='newSpotFormSubHeader'>Where's your place located?</h2>
                <p className='subHeaderDetails'>Guests will only get your exact address once they booked a reservation.</p>
            </div>
        </form>
    )
}

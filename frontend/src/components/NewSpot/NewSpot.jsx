import { useState } from 'react'
import './NewSpot.css'

export default function NewSpot() {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [long, setLong] = useState('');
    const [lat, setLat] = useState('');
    const [description, setDescription] = useState('')
    const [spotName, setSpotName] = useState('');

    return (
        <form className='newSpotForm'>
            <h1 className='newSpotFormHeader'>Create a New Spot</h1>
            <h2 className='newSpotFormSubHeader'>Where&apos;s your place located?</h2>
            <p className='subHeaderDetails'>Guests will only get your exact address once they booked a reservation.</p>

            <label className='country'>
                <p>Country</p>
                <input
                    className='newSpotInput'
                    type='text'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder='Country'
                    />
            </label>
            <label className='streetAddress'>
                <p>Street Address</p>
                <input
                    className='newSpotInput'
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder='Street Address'
                    />
            </label>
            <label className='cityAndState'>
                <p>City</p>
                <input
                    className='newSpotInput'
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder='City'
                    />
                <p>, STATE</p>
                <input
                    className='newSpotInput'
                    type='text'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder='State'
                    />
            </label>
            <label className='latAndLong'>
                <p>Latitude</p>
                <input
                    type='text'
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder='Latitude'
                    />
                <p>, Longitude</p>
                <input
                    type='text'
                    value={long}
                    onChange={(e) => setLong(e.target.value)}
                    placeholder='Longitude'
                    />
            </label>
            <label className='seperator' />
            <h2 className='newSpotFormSubHeader'>Describe your place to guests</h2>
            <p className='subHeaderDetails'>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
            <label className='descriptionTextContainer'>
                <textarea
                    className='descriptionTextArea'
                    placeholder='Please write at least 30 characters'
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
            </label>

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Create a title for your spot</h2>
            <p className='subHeaderDetails'>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>

            <label>
                <input
                    className='newSpotInput'
                    type='text'
                    required
                    placeholder='Name of your spot'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    />
            </label>

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Set a base price for your spot</h2>
            <p className='subHeaderDetails'>Competitive pricing can help your listing stand out and rank higher in search results.</p>

            <label className='setPriceContainer'>
                <p>$</p>
                <input
                    className='newSpotInput'
                    type='text'
                    required
                    placeholder='Name of your spot'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    />
            </label>

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Liven up your spot with photos</h2>
            <p className='subHeaderDetails'>Submit a link to at least one photo to publish your spot.</p>

            <label>
                <input
                    className='photoInput'
                    type='text'
                    required
                    placeholder='Preview Image URL'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    />
            </label>
            <label>
                <input
                    className='photoInput'
                    type='text'
                    required
                    placeholder='Image URL'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    />
            </label>
            <label>
                <input
                    className='photoInput'
                    type='text'
                    required
                    placeholder='Image URL'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    />
            </label>
            <label>
                <input
                    className='photoInput'
                    type='text'
                    required
                    placeholder='Image URL'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    />
            </label>
            <label>
                <input
                    className='photoInput'
                    type='text'
                    required
                    placeholder='Image URL'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    />
            </label>

            <label className='seperator' />

            <button className='submitSpot'>Create Spot</button>

        </form>
    )
}

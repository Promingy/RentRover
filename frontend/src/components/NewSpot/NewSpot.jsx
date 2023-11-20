import { useState } from 'react'
import './NewSpot.css'

export default function NewSpot() {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [long, setLong] = useState('');
    const [lat, setLat] = useState('');
    const [spotName, setSpotName] = useState('');
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('')

    // creates spot object on submit and calls thunktion to flesh out any errors that may be present
    function onSubmit(e) {
        e.preventDefault();

        const newSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng: long,
            name: spotName,
            description
        }

    }

    // dynamically create input sections
    function inputCreator(className, type, placeholder, value, setValue, labelClass, pInput) {
        return (
            <label className={labelClass ? labelClass : ''}>
                {pInput && <p>{pInput}</p>}
                <input
                    className={className}
                    type={type}
                    required
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    />
            </label>
        )
    }

    // create the image input sections
    function createImageInput() {
        const returnArr = []

        for (let i = 1; i < 5; i++) {
            // create dynamic image and setImage variables to dry up code
            const [image, setImage] = useState('');


            // populate the return array with all needed input sections
            returnArr.push((
                <label>
                    <input
                        className='photoInput'
                        type='url'
                        required
                        placeholder='Image URL'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        />
                </label>
            ))
        }
        return returnArr
    }

    return (
        <form className='newSpotForm' onSubmit={onSubmit}>
            <h1 className='newSpotFormHeader'>Create a New Spot</h1>
            <h2 className='newSpotFormSubHeader'>Where&apos;s your place located?</h2>
            <p className='subHeaderDetails'>Guests will only get your exact address once they booked a reservation.</p>

            <label className='country sectionOneInputs'>
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
            <label className='streetAddress sectionOneInputs'>
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
            <label className='cityAndState sectionOneInputs'>
                <div className='nestedInputContainer'>
                    <p>City</p>
                    <input
                        className='newSpotInput cityInput'
                        type='text'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder='City'
                        />
                </div>
                <p className='inputComma'>,</p>
                <div className='stateInputContainer'>
                    <p>STATE</p>
                    <input
                        className='newSpotInput stateInput'
                        type='text'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        placeholder='State'
                        />
                </div>
            </label>
            <label className='latAndLong sectionOneInputs'>
                {/* <div className='nestedInputContainer'>
                    <p>Latitude</p>
                    <input
                        className='newSpotInput'
                        type='text'
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder='Latitude'
                        />
                </div> */}

                {inputCreator('newSpotInput', 'text', 'Latitude', lat, setLat, 'nestedInputContainer', 'Latitude')}
                <p className='inputComma'>,</p>
                {/* <div className='nestedInputContainer'>
                    <p>Longitude</p>
                    <input
                        className='newSpotInput'
                        type='text'
                        value={long}
                        onChange={(e) => setLong(e.target.value)}
                        placeholder='Longitude'
                        />
                </div> */}

                {inputCreator('newSpotInput', 'text', 'Longitude', long, setLong, 'nestedInputContainer', 'Longitude')}
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

            {/* <label>
                <input
                    className='newSpotInput'
                    type='text'
                    required
                    placeholder='Name of your spot'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    />
            </label> */}

            {inputCreator('newSpotInput', 'text', 'Name of your Spot', spotName, setSpotName)}

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Set a base price for your spot</h2>
            <p className='subHeaderDetails'>Competitive pricing can help your listing stand out and rank higher in search results.</p>

            {/* <label className='setPriceContainer'>
                <p>$</p>
                <input
                    className='newSpotInput'
                    type='text'
                    required
                    placeholder='Name of your spot (USD)'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    />
            </label> */}

            {inputCreator('newSpotInput', 'text', 'Name of your spot (USD)', price, setPrice, 'setPriceContainer', '$')}

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Liven up your spot with photos</h2>
            <p className='subHeaderDetails'>Submit a link to at least one photo to publish your spot.</p>
{/*
            <label>
                <input
                    className='photoInput'
                    type='text'
                    required
                    placeholder='Preview Image URL'
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    />
            </label> */}

            {inputCreator('photoInput', 'url', 'Preview Image Url', previewImage, setPreviewImage)}

            {createImageInput()}

            <label className='seperator' />

            <button className='submitSpot'>Create Spot</button>

        </form>
    )
}

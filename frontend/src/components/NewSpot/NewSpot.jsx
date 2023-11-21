import { useState } from 'react'
import { thunkCreateSpot } from '../../store/spotsRedcuer';
import './NewSpot.css'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function NewSpot() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    // const [file, setFile] = useState('');

    const [errors, setErrrors] = useState({});

    function errorHandler() {
        // error message for all required fields
        // error message for description length
        //create error obj
        // test all possible errors
        // if error, add err msg to obj
        //set err state above to empty obj
        // in return setstate of err  to new obj
        const errors = {};

        const images = [image1, image2, image3, image4]
        const imageEndings = ['.png', '.jpg', '.jpeg']

        for (let image in images) {
            if (image && imageEndings.some(ext => image.endsWith(ext))){
                errors[image] = 'Image URL must end in .png, .jpg, .jpeg'
            }
        }


        !city ? errors.city = 'City is required' : '';
        !state ? errors.state = 'State is requried': '';
        !price ? errors.price = 'Price is required' : '';
        // !lat ? errors.lat = 'Latitude is requried' : '';
        // !long ? errors.long = 'Longitude is required' : '';
        !spotName ? errors.name = 'Name is required' : '';
        !address ? errors.address = 'Address is required' : '';
        !country ? errors.country = 'Country is required' : '';
        !description ? errors.description = 'Description is required' : '';
        description.length < 30 ? errors.description = "Description needs to be a minimum 30 characters or more" : '';
        !previewImage ? errors.preview = 'Preview Image is required' : '' ;


        spotName.length < 3 ? errors.name = "Name must be at least 3 characters" : ''
        spotName.length > 50 ? errors.name = "Name must be less than 50 characters" : ''
         lat && lat > 90 || lat < -90 ? errors.lat = 'Latitude must be between 90 and -90' : ''
        long && long > 190 || long < -180 ? errors.lat = 'Longitude must be between 180 and -180' : ''

        if (previewImage && !imageEndings.some( ext => previewImage.endsWith(ext))) {
            errors.previewImage = 'Image URL must end in .png, .jpg, .jpeg'
        }



        setErrrors(errors)
    }

    // creates spot object on submit and calls thunktion to flesh out any errors that may be present
    async function onSubmit(e) {
        e.preventDefault();

        errorHandler();

        const newPreviewImage = {
            url: previewImage,
            preview: true
        }

        let newSpot = {
            Spot: {
                address,
                city,
                state,
                country,
                lat: lat || 0,
                lng: long || 0,
                name: spotName,
                price,
                description
            },
            Images: [
                newPreviewImage,
                // file && {url: file, preview: false} || undefined,
                image1 && {url: image1, preview: false} || undefined,
                image2 && {url: image2, preview: false} || undefined,
                image3 && {url: image3, preview: false} || undefined,
                image4 && {url: image4, preview: false} || undefined
            ]
        }

        if (!Object.values(errors).length){
            newSpot = await dispatch(thunkCreateSpot(newSpot))

            navigate(`/spots/${newSpot.id}`)
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
                    placeholder={placeholder}
                    // required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    />
            </label>
        )
    }

    // create the image input sections
    function createImageInput() {
        const returnArr = []
        const images = [image1, image2, image3, image4]
        const setImage = [setImage1, setImage2, setImage3, setImage4]

        for (let i = 0; i < 4; i++) {
            // populate the return array with all needed input sections
            returnArr.push((
                <label key={i}>
                    <input
                        className='photoInput'
                        type='url'
                        placeholder='Image URL'
                        value={images[i]}
                        onChange={(e) => setImage[i](e.target.value)}
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

            {Object.values(errors).length != 0 &&
                <>
                    <p className='errors'>{errors.country}</p>
                    <p className='errors'>{errors.address}</p>
                    <p className='errors'>{errors.city}</p>
                    <p className='errors'>{errors.state}</p>
                    <p className='errors'>{errors.lat}</p>
                    <p className='errors'>{errors.long}</p>
                    <p className='errors'>{errors.name}</p>
                    <p className='errors'>{errors.description}</p>
                    <p className='errors'>{errors.price}</p>
                    <p className='errors'>{errors.preview}</p>
                </>
            }

            {inputCreator('newSpotInput', 'text', 'Country', country, setCountry, 'country sectionOneInputs', 'Country')}

            {inputCreator('newSpotInput', 'text', 'Street Address',  address, setAddress, 'streetAddress sectionOneInputs', 'Street Address')}

            <label className='cityAndState sectionOneInputs'>

                {inputCreator('newSpotInput cityInput', 'text', 'City', city, setCity, 'nestedInputContainer', 'City')}

                <p className='inputComma'>,</p>

                {inputCreator('newSpotInput stateInput', 'text', 'State',state, setState, 'stateInputContainer', 'STATE')}
            </label>

            <label className='latAndLong sectionOneInputs'>

                {inputCreator('newSpotInput', 'text', 'Latitude', lat, setLat, 'nestedInputContainer', 'Latitude')}

                <p className='inputComma'>,</p>

                {inputCreator('newSpotInput', 'text', 'Longitude', long, setLong, 'nestedInputContainer', 'Longitude')}

            </label>

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Describe your place to guests</h2>
            <p className='subHeaderDetails'>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>

            <label className='descriptionTextContainer'>
                <textarea
                    className='descriptionTextArea'
                    placeholder='Please write at least 30 characters'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
            </label>

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Create a title for your spot</h2>
            <p className='subHeaderDetails'>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>

            {inputCreator('newSpotInput', 'text', 'Name of your Spot', spotName, setSpotName)}

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Set a base price for your spot</h2>
            <p className='subHeaderDetails'>Competitive pricing can help your listing stand out and rank higher in search results.</p>

            {inputCreator('newSpotInput', 'text', 'Name of your spot (USD)',price, setPrice, 'setPriceContainer', '$')}

            <label className='seperator' />

            <h2 className='newSpotFormSubHeader'>Liven up your spot with photos</h2>
            <p className='subHeaderDetails'>Submit a link to at least one photo to publish your spot.</p>

            {inputCreator('photoInput', 'url', 'Preview Image Url', previewImage, setPreviewImage)}

            {createImageInput()}


            {/* The below code is how to allow file uploads, and extract the url from it */}
            {/* <label>
                <input
                    type='file'
                    value={file}
                    onChange={(e) => setFile(e.target.value)}
                />
            </label> */}

            <label className='seperator' />

            <button className='submitSpot'>Create Spot</button>

        </form>
    )
}

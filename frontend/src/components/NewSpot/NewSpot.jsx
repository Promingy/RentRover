import { useEffect, useState } from 'react'
import { thunkCreateSpot, thunkUpdateSpot } from '../../store/spotsRedcuer';
import './NewSpot.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewSpot({ isUpdate, formType }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const { spotId } = useParams()

    let spot
    const spots = useSelector(state => state.spots.Spots)
    spot = spots && spots[spotId]

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
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    // const [file, setFile] = useState('');

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!sessionUser) navigate('/');
        if (spot && isUpdate) {
            setCity(spot.city || '')
            setState(spot.state || '')
            setAddress(spot.address || '')
            setCountry(spot.country || '')
            setLong(spot.lng || '')
            setLat(spot.lat || '')
            setSpotName(spot.name || '')
            setDescription(spot.description || '')
            setPrice(spot.price || '')
            setPreviewImage(spot.previewImage || '')
            setImage1(spot.SpotImages[1]?.url || '')
            setImage2(spot.SpotImages[2]?.url || '')
            setImage3(spot.SpotImages[3]?.url || '')
            setImage4(spot.SpotImages[4]?.url || '')
        }
    }, [spot, isUpdate, sessionUser, navigate])


    // creates spot object on submit and calls thunktion to flesh out any errors that may be present
    async function onSubmit(e) {
        e.preventDefault();

        setErrors({});

        const imageEndings = ['.png', '.jpg', '.jpeg']

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
                image1 && {url: image1, preview: false} || undefined,
                image2 && {url: image2, preview: false} || undefined,
                image3 && {url: image3, preview: false} || undefined,
                image4 && {url: image4, preview: false} || undefined
            ]
        }

        if (previewImage && imageEndings.some(ext => previewImage.endsWith(ext))){
            dispatch(formType ? thunkUpdateSpot(spot?.id, newSpot) : thunkCreateSpot(newSpot))
                .then(spot => {navigate(`/spots/${spot.id}`)})
                .catch(async (res) => {
                    const data = await res.json();

                    if (data?.errors) {
                        setErrors(data.errors)
                    }
                })
        } else {
            setErrors({...errors, preview: 'Preview image is required and must end in .png, .jpg or .jpeg'})
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
        <>
        {sessionUser && <form className='newSpotForm' onSubmit={onSubmit}>
                <h1 className='newSpotFormHeader'>{formType ? 'Update your Spot' : 'Create a New Spot'}</h1>
                <h2 className='newSpotFormSubHeader'>Where&apos;s your place located?</h2>
                <p className='subHeaderDetails'>Guests will only get your exact address once they booked a reservation.</p>

                {Object.values(errors).map(error => (
                    <p className='errors' key={error}>{error}</p>
                ))}

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


                {!isUpdate &&
                <>
                    <label className='seperator' />
                    <h2 className='newSpotFormSubHeader'>Liven up your spot with photos</h2>
                    <p className='subHeaderDetails'>Submit a link to at least one photo to publish your spot.</p>

                    {inputCreator('photoInput', 'url', 'Preview Image Url', previewImage, setPreviewImage)}

                    {createImageInput()}
                </>}


                {/* The below code is how to allow file uploads, and extract the url from it */}
                {/* <label>
                    <input
                        type='file'
                        value={file}
                        onChange={(e) => setFile(e.target.value)}
                    />
                </label> */}

                <label className='seperator' />

                <button className='submitSpot'>{isUpdate ? "Update Spot" : "Create Spot"}</button>

            </form>}
        </>
    )
}

import { useEffect } from 'react'
import { thunkGetSingleSpot } from '../../store/spotsRedcuer';
import '../NewSpot/NewSpot.css'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import NewSpot from '../NewSpot/NewSpot';


export default function UpdateSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();


    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId))
    }, [dispatch, spotId])

    return (
        <NewSpot formType='update' isUpdate={true}/>
    )
}

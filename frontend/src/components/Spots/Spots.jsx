import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { thunkGetAllSpots } from "../../store/spotsRedcuer"

export default function Spots() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetAllSpots());
    }, [dispatch])
    
    return (
        <h1>Spots</h1>
    )
}

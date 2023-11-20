import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom';
import * as sessionActions from './store/session';

import Navigation from './components/Navigation/Navigation';
import Spots from './components/Spots'
import SelectedSpot from './components/selectedSpot';
import NewSpot from './components/NewSpot/NewSpot';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.thunkRestoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])

  return (
    <>
    { isLoaded &&
      <>
        <Navigation isLoaded={isLoaded}/>
        <Routes>
          <Route path='/' element={<Spots />} />
          <Route path='/spots/:spotId' element={<SelectedSpot />} />
          <Route path='/spots/new' element={<NewSpot />} />
        </Routes>
      </>
    }
   </>
  )
}

export default App;

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as sessionActions from './store/session';

import Navigation from './components/Navigation/Navigation';
import Spots from './components/Spots'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.thunkRestoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])

  return (
    <BrowserRouter>
    { isLoaded &&
      <>
        <Navigation isLoaded={isLoaded}/>
        <Routes>
          <Route path='/' element={<h1 className='welcomeHeader'>Welcome!</h1>} />
          <Route path='/spots' element={<Spots />} />
        </Routes>
    </>
        }
        </BrowserRouter>
  )
}

export default App;

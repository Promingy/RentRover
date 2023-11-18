import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';

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
        </Routes>
    </>
        }
        </BrowserRouter>
  )
}

export default App;

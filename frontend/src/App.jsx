import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPageForm from './components/LoginPageForm';
import SignupFormPage from './components/SignupFormPage/SignupFormPage';
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
      <Routes>
        <Route path='/' element={<h1>Welcome!</h1>} />
        <Route path='/login' element={<LoginPageForm />} />
        <Route path='/signup' element={<SignupFormPage />} />
      </Routes> }
    </BrowserRouter>
  )
}

export default App;

import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

export default function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

    useEffect(() => {
      if(sessionUser) navigate('/')
    }, [sessionUser])
  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});
    return dispatch(sessionActions.thunkLogin({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data) {
          setErrors(data);
        }
      });
  };

  const demoUserLogin = async (e) => {
    e.preventDefault();

     return dispatch(sessionActions.thunkLogin({ credential: 'Eminem', password: 'password'}))
     .then(closeModal)
  }

    return(
        <>
            <h1 className='loginHeader'>Log In</h1>
            <form onSubmit={handleSubmit} className='loginForm'>
                <label className='loginCredential'>
                    Username or Email:
                    {errors.message && <p className='loginErrors'>The provided credentials were invalid</p>}
                    <input
                        className='loginInput'
                        type='text'
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label className='loginPassword'>
                    Password:
                    <input
                        className='loginInput'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type='submit' className='loginButton' disabled={credential.length < 4 || password.length < 6}>Log In</button>
                <button type='button' onClick={demoUserLogin} className='demoLoginButton'>Demo User</button>
            </form>
        </>
    )
}

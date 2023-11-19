import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

export default function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.thunkLogin({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data) {
          setErrors(data);
        }
      });
  };

  const demoUserLogin = (e) => {
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
                    {errors.message && <p className='loginErrors'>{errors.message}.</p>}
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
                <button type='submit' className='loginButton'>Log In</button>
                <button type='button' onClick={demoUserLogin} className='demoLoginButton'>Demo User</button>
            </form>
        </>
    )
}

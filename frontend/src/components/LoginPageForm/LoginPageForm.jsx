import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import './LoginForm.css'

export default function LoginPageForm () {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    if(sessionUser) return <Navigate to='/' replace={true} />;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.thunkLogin({ credential, password })).catch(
            async (res) => {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        );
    };

    return(
        <>
            <h1 className='loginHeader'>Log In</h1>
            <form onSubmit={handleSubmit} className='loginForm'>
                <label className='loginCredential'>
                    Username or Email:
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
                {errors.credential && <p>{errors.credential}</p>}
                <button type='submit' className='loginButton'>Log In</button>
            </form>
        </>
    )
}

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './Signup.css'

export default function SignupFormPage () {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    if (sessionUser) return <Navigate to='/' replace={true} />;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            return dispatch(
                sessionActions.thunkSignup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            ).catch(async (res) => {
                const data = await res.json();
                if(data?.errors) {
                    setErrors(data.errors)
                }
            });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    return (
        <>
            <h1 className='signupHeader'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='signupForm'>
                <label className='signupLabel signupEmail'>
                    Email:
                    <input
                        className='signupInput'
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <p>{errors.email}</p>}
                <label className='signupLabel signupUsername'>
                    Username:
                    <input
                        className='signupInput'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                    {errors.username && <p>{errors.username}</p>}
                <label className='signupLabel signupFName'>
                    First Name:
                    <input
                        className='signupInput'
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                        {errors.firstName && <p>{errors.firstName}</p>}
                <label className='signupLabel signupLName'>
                    Last Name:
                    <input
                        className='signupInput'
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {errors.lastName && <p>{errors.lastName}</p>}
                <label className='signupLabel signupPassword'>
                    Password:
                    <input
                        className='signupInput'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.password && <p>{errors.password}</p>}
                <label className='signupLabel signupConfirmPassword'>
                    Confirm Password:
                    <input
                        className='signupInput'
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                    <button type='submit' className='signupButton'>Sign Up</button>
                </label>
            </form>
        </>
    )
}

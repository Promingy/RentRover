import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const [signupButton, setSignupButton] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.thunkSignup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        })
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  useEffect(() => {
    setSignupButton(true)


    if(email &&
      username.length >= 4 &&
      firstName && lastName &&
      password.length >= 6 &&
      confirmPassword) {
        setSignupButton(false)
      }

}, [email, username, firstName, lastName, password, confirmPassword])

  return (
    <>
      <h1 className='signupHeader' >Sign Up</h1>
      <form onSubmit={handleSubmit} className='signupForm'>
      <label className='signupLabel signupFName'>
          First Name
          <input
            className='signupInput'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className='signupErrors'>{errors.firstName}</p>}
        <label className='signupLabel signupLName'>
          Last Name
          <input
            className='signupInput'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className='signupErrors'>{errors.lastName}</p>}
        <label className='signupLabel signupEmail'>
          Email
          <input
            className='signupInput'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className='signupErrors'>{errors.email}</p>}
        <label className='signupLabel signupUsername'>
          Username
          <input
            className='signupInput'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className='signupErrors'>{errors.username}</p>}
        <label className='signupLabel signupPassword'>
          Password
          <input
            className='signupInput'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className='signupErrors'>{errors.password}</p>}
        <label className='signupLabel signupConfirmPassword'>
          Confirm Password
          <input
            className='signupInput'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (<p className='signupErrors'>{errors.confirmPassword}</p>)}
        <button type="submit" className='signupButton' disabled={signupButton}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;

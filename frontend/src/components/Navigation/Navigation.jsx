import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css'

export default function Navigation ({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.thunkLogout());
    };

    const sessionLinks = sessionUser ? (
        <>
          <li className='navButton profileButton'>
            <ProfileButton user={sessionUser} />
          </li>
          <li className='navButton'>
            <button onClick={logout}>Log Out</button>
          </li>
        </>
      ) : (
        <>
          <li className='navButton'>
            <NavLink to="/login">Log In</NavLink>
          </li>
          <li className='navButton'>
            <NavLink to="/signup">Sign Up</NavLink>
          </li>
        </>
      );

      return (
        <ul>
          <li className='navButton'>
            <NavLink to="/">Home</NavLink>
          </li>
          {isLoaded && sessionLinks}
        </ul>
      );
}

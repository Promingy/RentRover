import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <>
        <li className='navBar'>
          <OpenModalButton
            className="loginButton"
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </li>
        <li className='navBar'>
          <OpenModalButton
            className='navButton'
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </li>
      </>
    );
  }

  return (
    <ul>
      <li className='logoContainer' onClick={navigate('/')}>
        <i className='fa-brands fa-airbnb fa-bounce fa-2xl logo' />
      </li>
      <li className='navBar'>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;

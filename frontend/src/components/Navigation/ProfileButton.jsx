import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useNavigate } from 'react-router-dom';
export default function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false);
  const ulClassName = "profileDropdown" + (showMenu ? "" : " hidden");

  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu)
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
    navigate('/');
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)){
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const menuItems = user ? (
    <ul className={`${ulClassName} dropDownLoggedIn`} ref={ulRef}>
      <li className='dropDown'>Hello, {user.firstName}</li>
      <li className='dropDown'>{user.email}</li>
      <li>
        <button className='manageSpotsButton' onClick={() => navigate('/spots/current')}>Manage Spots</button>
      </li>
      <li className='dropDownLogout'>
        <button onClick={logout} className='logoutButton'>Log Out</button>
      </li>
    </ul>
  )
  :
  (
    <>
    <ul className={ulClassName} ref={ulRef}>
      <li className='dropDownLoginContainer'>
        <OpenModalButton
          className='TEST'
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
      </li>
      <li className='dropDownSignupContainer'>
        <OpenModalButton
          className='dropDownSignupButton'
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    </ul>
  </>
  )

  return (
    <>
      <button onClick={toggleMenu} className={`profileButton ${showMenu ? 'dropDownActive' : ''}`}>
        <i className="fa-solid fa-bars fa-2x pic" />
        <i className="fas fa-user-circle fa-2x pic" />
      </button>
      {menuItems}
    </>
  );
}

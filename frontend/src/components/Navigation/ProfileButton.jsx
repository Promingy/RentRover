import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
export default function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu)
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
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

  const ulClassName = "profileDropdown" + (showMenu ? "" : " hidden");
  return (
    <>
      <button onClick={toggleMenu} className='profileButton'>
        <i className="fas fa-user fa-2x pic" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li className='drowDown'>{user.username}</li>
        <li className='drowDown'>{user.firstName} {user.lastName}</li>
        <li className='drowDown'>{user.email}</li>
        <li className='drowDown'>
          <button onClick={logout} className='logoutButton'>Log Out</button>
        </li>
      </ul>
    </>
  );
}

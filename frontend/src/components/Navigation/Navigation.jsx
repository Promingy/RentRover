import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useEffect, useState } from 'react';

function Navigation({ isLoaded }) {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [navClass, setNavClass] = useState(true)


  // Implements the dynamic class/css settings for home and profile button
  useEffect(() => {
    const profileButton = document.getElementsByClassName('profileButtonContainer')[0];

     profileButton && profileButton.addEventListener('click', () => setNavClass(!navClass));

    return () => profileButton && profileButton.removeEventListener('click', () => setNavClass(!navClass));
  }, [navClass])


  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className='profileButtonContainer'>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <>
        <li className='profileButtonContainer'>
          <ProfileButton />
        </li>
      </>
    );
  }

  function logoClick () {
    navigate('/')
  }

  return (
    <ul className={`navBarContainer ${navClass ? '' : 'navBarContainerActive'}`}>
      <li className='logoContainer' onClick={logoClick}>
        {/* /// in order to rotate this icon, remove the bounce animation */}
        <i className='fa-brands fa-airbnb fa-bounce logoIcon' />
        <span className='logoName logo'>airbnb</span>
      </li>
      <li>
        <NavLink to="/" className='homeButton'>Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;

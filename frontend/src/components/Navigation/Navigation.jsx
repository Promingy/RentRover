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
  const [test, setTest] = useState(true)
  function logoClick () {
    setTest(!test)
    navigate('/',{state: {reset: test ? 'test' : 'test2' }})
  }

  return (
    <ul className={`navBarContainer ${navClass ? '' : 'navBarContainerActive'}`}>
      <li className='logoContainer' onClick={logoClick}>
        {/* /// in order to rotate this icon, remove the bounce animation */}
        <img className='rentrover-icon' src="./rentrover.svg"/>
        <span className='logoName logo'>RentRover</span>
      </li>
      {sessionUser &&
      <li>
        <NavLink to="/spots/new" className='homeButton'>Create a Spot</NavLink>
      </li>
      }
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;

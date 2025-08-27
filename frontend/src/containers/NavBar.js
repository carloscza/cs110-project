// HomePage.js

import '../styles/NavBar.css';
//import { Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import trackboxdlogo from '../navlogo.png';


function NavBar({ isLoggedIn, setIsLoggedIn })
{
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };
  return (
      <nav>
        <Link to="/" className="nav-link"><img src={trackboxdlogo} alt='trackboxd' className="nav-text-logo" /></Link>
        <li><Link to="/" className="nav-link">HOME</Link></li>
        <li><Link to="/profile" className="nav-link">PROFILE</Link></li>
        {isLoggedIn ? (
        <li><button onClick={handleLogout} className="nav-link-button">LOGOUT</button></li>
      ) : (
        <>
          <li><Link to="/login" className="nav-link">LOGIN</Link></li>
          <li><Link to="/signup" className="nav-link">SIGNUP</Link></li>
        </>
      )}

        <li>ACTIVITY</li>
        <li>POST</li>
      </nav>
  );
}

export default NavBar;
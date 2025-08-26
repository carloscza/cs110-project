// HomePage.js

import '../styles/NavBar.css';
import { Link } from 'react-router-dom';
import trackboxdlogo from '../navlogo.png';

function NavBar()
{
  return (
      <nav>
        <Link to="/" className="nav-link"><img src={trackboxdlogo} alt='trackboxd' className="nav-text-logo" /></Link>
        <li><Link to="/" className="nav-link">HOME</Link></li>
        <li><Link to="/profile" className="nav-link">PROFILE</Link></li>
        <li>LOGIN</li>
        <li>SIGNUP</li>
        <li>ACTIVITY</li>
        <li>POST</li>
      </nav>
  );
}

export default NavBar;
import '../styles/NavBar.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import trackboxdlogo from '../navlogo.png';

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
      setQuery("");
    }
  };

  return (
    <nav>
      <Link to="/" className="nav-link">
        <img src={trackboxdlogo} alt="trackboxd" className="nav-text-logo" />
      </Link>
      <ul className="nav-links-container">
        <li><Link to="/" className="nav-link">HOME</Link></li>

        {isLoggedIn ? (
          <>
            <li><Link to="/profile" className="nav-link">PROFILE</Link></li>
            <li><button onClick={handleLogout} className="nav-link-button">LOGOUT</button>
            </li>
            <li>
              <form onSubmit={handleSearchSubmit}>
                <input type="text" className="nav-input" placeholder="search user..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <button type="submit" className="nav-submit-btn"></button>
              </form>
            </li>
            <li className="post-btn"><Link to="/postreview" className="nav-link"><span className='plus'>+</span> REVIEW</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="nav-link">LOGIN</Link></li>
            <li><Link to="/signup" className="nav-link">SIGNUP</Link></li>
            <li><Link to="/activity" className="nav-link">ACTIVITY</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
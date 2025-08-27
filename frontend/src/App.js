import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './containers/NavBar';
import HomePage from './containers/HomePage';

import ProfilePage from './containers/ProfilePage';
import profilepic from './profilepic.png';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import React, { useState, useEffect } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
        <div className="App">
          <header className="Header">
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </header>
          <div className="Content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>
          </div>
        </div>
    </Router>
  );
}

export default App;
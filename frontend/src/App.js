import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Page Components
import NavBar from './containers/NavBar';
import HomePage from './containers/HomePage';
import ProfilePage from './containers/ProfilePage';
import ActivityPage from './containers/ActivityPage'; // <-- ADDED
import PostsPage from './containers/PostsPage';       // <-- ADDED

import ReviewPage from './containers/ReviewPage';
import AlbumReviewsPage from './containers/AlbumReviewsPage';
import PostReviewPage from './containers/PostReviewPage';
import CreateReviewPage from './containers/CreateReviewPage';
import SearchResults from './containers/SearchResults';
import FollowPage from './containers/FollowPage';

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
              {/* --- UPDATED ROUTES --- */}
              <Route path="/" element={<HomePage />} />

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userid" element={<ProfilePage />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />

              <Route path="/activity" element={<ActivityPage />} /> {/* <-- ADDED */}
              <Route path="/posts" element={<PostsPage />} />       {/* <-- ADDED */}

              <Route path="/reviewpage/:reviewId/:albumId" element={<ReviewPage isLoggedIn={isLoggedIn} />} /> {/* <-- ADDED */}
              <Route path="/albumreviewpage/:albumId" element={<AlbumReviewsPage />} />       {/* <-- ADDED */}
              <Route path="/postreview" element={<PostReviewPage />} />       {/* <-- ADDED */}
              <Route path="/createreview/:albumId" element={<CreateReviewPage />} />       {/* <-- ADDED */}

              <Route path="/search/:query" element={<SearchResults />} />       {/* <-- ADDED */}
              <Route path="/followpage/:userId" element={<FollowPage />} />       {/* <-- ADDED */}
              

            </Routes>
          </div>
        </div>
    </Router>
  );
}

export default App;

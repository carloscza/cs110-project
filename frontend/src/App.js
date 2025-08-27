import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Page Components
import NavBar from './containers/NavBar';
import HomePage from './containers/HomePage';
import ProfilePage from './containers/ProfilePage';
import ActivityPage from './containers/ActivityPage'; // <-- ADDED
import PostsPage from './containers/PostsPage';       // <-- ADDED

import profilepic from './profilepic.png';


function App() {
  return (
    <Router>
        <div className="App">
          <header className="Header">
            <NavBar />
          </header>
          <div className="Content">
            <Routes>
              {/* --- UPDATED ROUTES --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/activity" element={<ActivityPage />} /> {/* <-- ADDED */}
              <Route path="/posts" element={<PostsPage />} />       {/* <-- ADDED */}
              <Route path="/profile" element={<ProfilePage profilePic={profilepic} username={"user123"} reviewsCnt={"7"} followersCnt={"1"} followingCnt={"123"} about={"hello trackboxd"} />} />
            </Routes>
          </div>
        </div>
    </Router>
  );
}

export default App;

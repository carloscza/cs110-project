import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './containers/NavBar';
import HomePage from './containers/HomePage';

import ProfilePage from './containers/ProfilePage';
import profilepic from './profilepic.png';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';


function App() {
  return (
    <Router>
        <div className="App">
          <header className="Header">
            <NavBar />
          </header>
          <div className="Content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage profilePic={profilepic} username={"user123"} reviewsCnt={"7"} followersCnt={"1"} followingCnt={"123"} about={"hello trackboxd"} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
    </Router>
  );
}

export default App;
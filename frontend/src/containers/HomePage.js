// HomePage.js

import "../styles/HomePage.css";
import React, { useState, useEffect } from 'react';
import hiphopbanner from "../hiphopbanner.png";
import AlbumList from "../components/AlbumList";

function HomePage() {

  return (
    <div className="home-page-container">
      <div className="home-banner-container">
        <img src={hiphopbanner} className="banner-img" alt="Hip-hop banner" />
        <div className="home-banner-text-container">
          <p className="home-banner-main-text">Trackboxd, Discover and Discuss Music.</p>
          <p className="home-banner-sub-text">Read album reviews made by others to discover new music.</p>
          <p className="home-banner-sub-text">Review albums for others to discover.</p>
        </div>
      </div>

      <AlbumList genre={"hiphop"} />
      <AlbumList genre={"rock"} />

    </div>
  );
}

export default HomePage;
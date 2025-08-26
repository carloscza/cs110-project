// HomePage.js

import "../styles/HomePage.css";
import React, { useState, useEffect } from 'react';
import hiphopbanner from "../hiphopbanner.png";
import Entry from "../components/Entry";

function HomePage() {
  const [hiphopAlbums, setHipHopAlbums] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const albumsPerList = 5;

  useEffect(() => {
    fetch('http://localhost:3001/api/albums/genre/hiphop')
    .then(response => response.json())
    .then(data => {
      console.log('Hip-hop albums fetched from API:', data);
      setHipHopAlbums(data);
    });
  }, []);

  const handleLeftArrowClick = () => {
    setStartIndex(prev => {
      const newIndex = prev - 1;
      return newIndex >= 0 ? newIndex : 0;
    });
  };

  const handleRightArrowClick = () => {
    setStartIndex(prev => {
      const newIndex = prev + 1;
      const maxIndex = hiphopAlbums.length - albumsPerList;
      return newIndex <= maxIndex ? newIndex : prev;
    });
  };

  const endIndex = startIndex + albumsPerList;
  
  const albumsList = hiphopAlbums.slice(startIndex, endIndex);
  const createEntries = albumsList.map((album) => (
    <Entry key={album.albumid} albumid={album.albumid} albumCover={album.cover} rating={88} reviews={99} />
  ));

  const isLeftDisabled = startIndex === 0;
  const isRightDisabled = startIndex >= hiphopAlbums.length - albumsPerList;

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

      <div className="list-container">
        <p className="list-heading-text">Hip-Hop</p>
        <p className="list-subtext">The top hip-hop albums this week.</p>
      </div>
      
      <div className="album-list-container">
        <i className={`bi bi-caret-left-fill album-list-arrows ${isLeftDisabled ? 'disabled' : ''}`} onClick={handleLeftArrowClick}></i>

        <div className="albums-list">
          {createEntries}
        </div>

        <i className={`bi bi-caret-right-fill album-list-arrows ${isRightDisabled ? 'disabled' : ''}`} onClick={handleRightArrowClick}></i>
      </div>
    </div>
  );
}

export default HomePage;
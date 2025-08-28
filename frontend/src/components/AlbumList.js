import "../styles/HomePage.css";
import React, { useState, useEffect } from 'react';
import Entry from "../components/Entry";

function AlbumList({genre})
{
  const [genreAlbums, setGenreAlbums] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const albumsPerList = 5;

  useEffect(() => {
  fetch(`http://localhost:3001/api/albums/with-reviews/genre/${genre}`)
    .then(response => response.json())
    .then(data => {
      console.log('Hip-hop albums fetched from API:', data);
      const sortedAlbums = data.sort((a, b) => (b.overallrating || 0) - (a.overallrating || 0));
      setGenreAlbums(sortedAlbums);
    })
    .catch(err => console.error('Error fetching albums:', err));
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
      const maxIndex = genreAlbums.length - albumsPerList;
      return newIndex <= maxIndex ? newIndex : prev;
    });
  };

  const endIndex = startIndex + albumsPerList;
  
  const albumsList = genreAlbums.slice(startIndex, endIndex);
  const createEntries = albumsList.map((album) => (
    <Entry key={album._id} albumId={album._id} albumCover={album.cover}  rating={Math.round(album.overallrating)} reviewsa={album.reviewscnt}/>
  ));

  const isLeftDisabled = startIndex === 0;
  const isRightDisabled = startIndex >= genreAlbums.length - albumsPerList;

  return (
    <>
      <div className="list-container">
        <p className="list-heading-text">{genre.toUpperCase()}</p>
        <p className="list-subtext">The top {genre} albums.</p>
      </div>
      
      <div className="album-list-container">
        <i className={`bi bi-caret-left-fill album-list-arrows ${isLeftDisabled ? 'disabled' : ''}`} onClick={handleLeftArrowClick}></i>

        <div className="albums-list">
          {createEntries}
        </div>

        <i className={`bi bi-caret-right-fill album-list-arrows ${isRightDisabled ? 'disabled' : ''}`} onClick={handleRightArrowClick}></i>
      </div>
    </>
  );
}

export default AlbumList;
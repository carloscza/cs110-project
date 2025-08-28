import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostReviewPage.css';

function PostReviewPage() {
  const [searchTitle, setSearchTitle] = useState('');
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch suggestions as user types
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTitle(value);

    if (value.trim()) {
      try {
        const res = await fetch(`http://localhost:3001/api/albums/search-suggest/${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (!searchTitle.trim()) {
      setError('Please enter an album title.');
      setAlbum(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/albums/search/${encodeURIComponent(searchTitle)}`);
      const data = await response.json();

      if (response.ok) {
        setAlbum(data);
        setError('');
        setSuggestions([]);
      } else {
        setAlbum(null);
        setError(data.error || 'Album not found.');
      }
    } catch (err) {
      console.error('Error searching album:', err);
      setAlbum(null);
      setError('Failed to search album.');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTitle(suggestion.title);
    setSuggestions([]);
    setAlbum(suggestion);
  };

  const handleCreateReview = () => {
    if (album) {
      navigate(`/createreview/${album.albumid}`);
    }
  };

  return (
    <div className="post-review-page">
      <div className="search-album-container">
        <p className='new-review-heading'>Create a Review</p>
        <p className='search-album-heading'>Search for an album</p>
        <div className="box-btn-drop-cont">
        <div className='search-box-btn-container'>
        <input className="search-album-input" type="text" placeholder="Enter album title..." value={searchTitle} onChange={handleInputChange} />
        <button className="search-album-button" onClick={handleSearch}>Search</button>

        </div>
        <div className="asdf">
          {suggestions.length > 0 && (
          <ul className="suggestions-drop-list">
            {suggestions.map((s) => (
              <li key={s.albumid} onClick={() => handleSuggestionClick(s)}>
                {s.title}
              </li>
            ))}
          </ul>
        )}
        </div>
        
        </div>
        
      </div>

      {error && !album && <p className="error-text">{error}</p>}

      {album && (
        <div className="album-info">
          <p>{album.title}</p>
          <p>{album.artist}</p>
          <img src={album.cover} alt={album.title} className="album-cover-preview" />
          <button className="create-review-btn" onClick={handleCreateReview}>Create Review</button>
        </div>
      )}
    </div>
  );
}

export default PostReviewPage;
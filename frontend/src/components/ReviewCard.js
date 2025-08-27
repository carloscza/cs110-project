import React from 'react';
import '../styles/ReviewCard.css'; 

function ReviewCard({ item }) {

  const coverImage = item.albumCover || 'https://placehold.co/150x150/1c1c1e/f2f2f7?text=Review';
  return (
    <div className="album-container"> 
      <img src={coverImage} alt={`Review for ${item.albumTitle}`} className="album-cover" />
      <div className="album-stats-container">
        <div className="stat">
          <i className="bi bi-person-circle"></i> 
          <p className="list-text">{item.username || 'User'}</p>
        </div>

        <div className="stat">
          <i className="bi bi-star-fill star-icon"></i>
          <p className="list-text">{item.rating || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
import React from 'react';
import '../styles/ActivityItem.css'; // CSS for this component

function ActivityItem({ item }) {
  const coverImage = item.albumCover || 'https://placehold.co/80x80/1c1c1e/f2f2f7?text=Art';

  return (
    <div className="activity-item">
      <img src={coverImage} alt={item.albumTitle} className="activity-item-cover" />
      <div className="activity-item-info">
        <p>
          <strong>{item.username || 'A user'}</strong> reviewed <strong>{item.albumTitle || 'an album'}</strong>
        </p>
        <span className="activity-item-rating">
          Rated it a {item.rating || 'N/A'} / 10
        </span>
      </div>
    </div>
  );
}

export default ActivityItem;

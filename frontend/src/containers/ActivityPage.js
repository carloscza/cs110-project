import React, { useState, useEffect } from 'react';
import "../styles/HomePage.css"; 
import ReviewCard from '../components/ReviewCard';

function ActivityPage() {
  const [activity, setActivity] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerList = 5;

  useEffect(() => {
    fetch('http://localhost:3001/api/activity')
      .then(response => response.json())
      .then(data => setActivity(data))
      .catch(error => console.error("Failed to fetch activity:", error));
  }, []);

  const handleLeftArrowClick = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleRightArrowClick = () => {
    setStartIndex(prev => {
      const maxIndex = activity.length > itemsPerList ? activity.length - itemsPerList : 0;
      return Math.min(maxIndex, prev + 1);
    });
  };

  const visibleActivity = activity.slice(startIndex, startIndex + itemsPerList);
  const createCards = visibleActivity.map((item) => (
    <ReviewCard key={item._id} item={item} />
  ));

  const isLeftDisabled = startIndex === 0;
  const isRightDisabled = startIndex >= activity.length - itemsPerList;

  return (
    <div className="home-page-container">

      <div className="list-container" style={{ marginTop: '28px', textAlign: 'center' }}>
        <p className="home-banner-main-text">Activity Feed</p>
        <p className="home-banner-sub-text" style={{marginTop: '10px'}}>See your most recent listens</p>
      </div>
      <div className="list-container">
        <p className="list-heading-text">Recents</p>
      </div>
      
      <div className="album-list-container">
        <i 
          className={`bi bi-caret-left-fill album-list-arrows ${isLeftDisabled ? 'disabled' : ''}`} 
          onClick={!isLeftDisabled ? handleLeftArrowClick : undefined}>
        </i>

        <div className="albums-list">
          {createCards.length > 0 ? createCards : <p>No activity to display.</p>}
        </div>

        <i 
          className={`bi bi-caret-right-fill album-list-arrows ${isRightDisabled ? 'disabled' : ''}`} 
          onClick={!isRightDisabled ? handleRightArrowClick : undefined}>
        </i>
      </div>
    </div>
  );
}

export default ActivityPage;

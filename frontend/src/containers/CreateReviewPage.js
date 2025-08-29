
import '../styles/CreateReviewPage.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateReviewPage() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currUserId = currentUser?.userid;
  const { albumId } = useParams();
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    rating: '',
    review: ''
  });

  // State for album info
  const [albumInfo, setAlbumInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAlbumInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/albums/albumid/${albumId}`);
        
        if (response.ok) {
          const album = await response.json();
          setAlbumInfo(album);
        } 
      } catch (err) {
        console.error('Error fetching album:', err);
      } 
    };

    if (albumId) {
      fetchAlbumInfo();
    }
  }, [albumId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { rating, review } = formData;
    setSubmitting(true);

    try {
      const reviewData = {
        albumid: parseInt(albumId),
        userid: currUserId,
        rating: parseInt(rating),
        review: review.trim()
      };

      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        setFormData({ rating: '', review: '' });
        setTimeout(() => { navigate(`/`); }, 100);
      } 
    } catch (err) {
      console.error('Error creating review:', err);
    }
  };

  return (
    <>
      <div className="create-review-page-cont">
        {albumInfo?.cover ? (
          <img src={albumInfo.cover} alt={`${albumInfo.title} cover`}className="create-review-album-cover"/>
        ) : (
          <i className="bi bi-image create-review-album-cover"></i>
        )}
        
        <div className="create-review-details-cont">
          <p className="create-review-title">{albumInfo?.title || 'Album Title'}</p>
          
          <form className="create-review-form" onSubmit={handleSubmit}>
            <div className="review-input-cont">
              <label htmlFor="rating" className='create-review-text'>Rating (0-100):</label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="0"
                max="100"
                required
                className='review-rating'
                placeholder='100'
                value={formData.rating}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="review-input-cont">
              <label htmlFor="review" className='create-review-text'>Review:</label>
              <textarea
                id="review"
                name="review"
                rows="4"
                required
                className='review-textarea'
                placeholder='Write your review...'
                value={formData.review}
                onChange={handleInputChange}
              />
            </div>
            
            <button type="submit" className='create-review-submit' disabled={submitting || !currUserId}>
              {submitting ? 'ADDING REVIEW...' : 'ADD REVIEW'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateReviewPage;
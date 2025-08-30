// Entry.js

import '../styles/AlbumList.css';

//import { useNavigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

function Entry({key, albumId, albumCover, rating, reviewsa}) {
    const navigate = useNavigate();

    const handleAlbumClick = () => {
        navigate(`/albumreviewpage/${albumId}`);
    };

    return (
        <div key={key} className="album-container" onClick={handleAlbumClick}>
            <img src={albumCover} alt="let god" className="album-cover" />

            <div className="album-stats-container">
                <div className="stat">
                    <i className="bi bi-star-fill star-icon"></i>
                    <p className="list-text">{rating}</p>
                </div>

                <div className="stat">
                    <i className="bi bi-pencil-square"></i>
                    <p className="list-text">{reviewsa}</p>
                </div>
            </div>

            <Link to={`/albums/${albumId}`} onClick={e => e.stopPropagation()} className="view-details-link">
                View Details
            </Link>
        </div>
    );
}

export default Entry;

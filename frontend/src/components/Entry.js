// AlbumList.js

import '../styles/AlbumList.css';

function Entry({key, albumId, albumCover, rating, reviews})
{
    return (
        <div className="album-container">
            <img src={albumCover} alt="let god" className="album-cover" />

            <div className="album-stats-container">
                <div className="stat">
                    <i className="bi bi-star-fill star-icon"></i>
                    <p className="list-text">{rating}</p>
                </div>

                <div className="stat">
                    <i className="bi bi-pencil-square"></i>
                    <p className="list-text">{reviews}</p>
                </div>
            </div>
        </div>
    );
}

export default Entry;

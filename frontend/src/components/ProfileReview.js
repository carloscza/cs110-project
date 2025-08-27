// ProfileReview.js

import '../styles/ProfileReview.css';

import letgod from '../letgodsortemout.png';

function ProfileReview()
{
    return (
        <>
        <div className="profile-review-container">
            <img src={letgod} className="profile-album-cover"/>

            <div className="review-details-container">
                <p className="profile-album-title">Let God Sort Em Out</p>

                <div className="profile-review-rating">
                    <i className="bi bi-star-fill profile-star-icon"></i>
                    <p className="profile-review-text">99%</p>
                </div>

                <div className="review-snippet">
                    <p className="profile-review-snipper-text">I thought this album was dope af. Malice when crazy on this. The production was out of this world...</p>
                </div>

                <div className="profile-comments">
                    <i className="bi bi-chat"></i>
                    <p className="profile-comments-text">43</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default ProfileReview;
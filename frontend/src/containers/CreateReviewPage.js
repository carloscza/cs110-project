
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function CreateReviewPage() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
      const currUserId = currentUser?.userid;
      const { albumId } = useParams();


  return (
    <><p>CreateReviewPage.js</p></>
  );


}

export default CreateReviewPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AlbumReviewsPage from '../containers/AlbumReviewsPage';

function AlbumDetailPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/albums/${albumId}`)
      .then(res => {
        if (!res.ok) throw new Error('Album not found');
        return res.json();
      })
      .then(data => {
        setAlbum(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [albumId]);

  if (loading) {
    return <p>Loading album...</p>;
  }

  if (!album) {
    return <p>Album not found.</p>;
  }

  // need to be filled with database data
  const staticRecommendations = [
    {
      albumid: 101,
      title: "Album 1",
      artist: "Artist A",
      cover: "cover A"
    },
    {
      albumid: 102,
      title: "Static Album 2",
      artist: "Artist B",
      cover: "cover B"
    },
    {
      albumid: 103,
      title: "Static Album 3",
      artist: "Artist C",
      cover: "cover C"
    }
  ];

  return (
    <div>
      <h1>{album.title}</h1>
      <p>Artist: {album.artist}</p>
      <p>Genre: {album.genre}</p>
      <img src={album.cover} alt={`${album.title} cover`} style={{ width: 300 }} />

      <h2>Recommended Albums</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {staticRecommendations.map(rec => (
          <div key={rec.albumid} style={{ width: 150 }}>
            <img src={rec.cover} alt={rec.title} style={{ width: '100%' }} />
            <p>{rec.title}</p>
            <p><small>{rec.artist}</small></p>
          </div>
        ))}
      </div>

      <AlbumReviewsPage />
    </div>
  );
}

export default AlbumDetailPage;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb'); 

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); 

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(url);
let db; 

async function connectToDb() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName); 
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); 
  }
}

// --- API ENDPOINTS ---

// --- UPDATED: GET Activity Data ---
// This now joins reviews with albums to get the cover image
app.get('/api/activity', async (req, res) => {
  try {
    const collection = db.collection('reviews');
    const activity = await collection.aggregate([
      { $sort: { timestamp: -1 } }, // Sort by most recent first
      { $limit: 20 },
      {
        // Join with the 'albums' collection
        $lookup: {
          from: 'albums',
          localField: 'albumid', // Field from the 'reviews' collection
          foreignField: 'albumid', // Field from the 'albums' collection
          as: 'albumDetails' // Name for the new array field
        }
      },
      { $unwind: '$albumDetails' }, // Deconstruct the array to an object
      {
        // Add the album cover to the final review object
        $addFields: {
          albumCover: '$albumDetails.cover'
        }
      }
    ]).toArray();
    res.json(activity);
  } catch (err) {
    console.error('Error fetching activity:', err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// --- UPDATED: GET Posts Data ---
// This also joins reviews with albums to get the cover image
app.get('/api/posts', async (req, res) => {
  try {
    const collection = db.collection('reviews');
    const posts = await collection.aggregate([
      {
        $lookup: {
          from: 'albums',
          localField: 'albumid',
          foreignField: 'albumid',
          as: 'albumDetails'
        }
      },
      { $unwind: '$albumDetails' },
      {
        $addFields: {
          albumCover: '$albumDetails.cover'
        }
      }
    ]).toArray();
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


// --- Your other endpoints (albums, reviews, etc.) ---
app.get('/api/albums', async (req, res) => {
  try {
    const collection = db.collection('albums');
    const albums = await collection.find({}).toArray();
    res.json(albums);
  } catch (err) {
    console.error('Error fetching albums:', err);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const collection = db.collection('reviews');
    const reviews = await collection.find({}).toArray();
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});


// --- SERVER START ---
async function startServer() {
  await connectToDb();
  
  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
}

startServer();

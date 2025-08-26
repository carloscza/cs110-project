require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb'); 

const app = express();
const port = 3001;
app.use(cors());

// --- MongoDB Connection ---
// Replace with your MongoDB Atlas connection string
// Use environment variable instead of hardcoded string
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(url);
let db; // Variable to hold the database connection

async function connectToDb() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName); // Assign the database connection to our variable
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit if we can't connect
  }
}

// ... (rest of your server code will go here)


// GET all albums data
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

// GET all reviews data
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

// GET all comments data
app.get('/api/comments', async (req, res) => {
  try {
    const collection = db.collection('reviews');
    const comments = await collection.find({}).toArray();
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// GET albums by genre
app.get('/api/albums/genre/:genre', async (req, res) => {
  try {
    const collection = db.collection('albums');
    const genre = req.params.genre;
    const albums = await collection.find({ 
      genre: { $regex: new RegExp(genre, 'i') } 
    }).toArray();
    
    res.json(albums);
  } catch (err) {
    console.error('Error fetching albums by genre:', err);
    res.status(500).json({ error: 'Failed to fetch albums by genre' });
  }
});

// GET comments by review
app.get('/api/comments/reviewid/:reviewid', async (req, res) => {
  try {
    const collection = db.collection('albums');
    const genre = req.params.genre;
    const albums = await collection.find({ 
      genre: { $regex: new RegExp(genre, 'i') } 
    }).toArray();
    
    res.json(albums);
  } catch (err) {
    console.error('Error fetching albums by genre:', err);
    res.status(500).json({ error: 'Failed to fetch albums by genre' });
  }
});

// Start server after connecting to database
async function startServer() {
  await connectToDb();
  
  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await client.close();
  process.exit(0);
});
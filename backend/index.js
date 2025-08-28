require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb'); 

const app = express();
const port = 3001;
const { OAuth2Client } = require('google-auth-library');

app.use(cors());

app.use(express.json());//


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


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey'; // store securely in .env

// ... (rest of your server code will go here)

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      userid: Date.now(),
      username,
      password: hashedPassword,
      userpic: '',
      followers: [],
      following: []
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userid: user.userid, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userid: user.userid,
        username: user.username,
        userpic: user.userpic
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    const usersCollection = db.collection('users');
    let user = await usersCollection.findOne({ googleId });

    if (!user) {
      user = {
        userid: Date.now(),
        googleId,
        email,
        username: name,
        userpic: '',
        followers: [],
        following: []
      };
      await usersCollection.insertOne(user);
    }

    const jwtToken = jwt.sign(
      { userid: user.userid, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Google login successful',
      token: jwtToken,
      user: {
        userid: user.userid,
        username: user.username,
        userpic: user.userpic
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});



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



app.get('/api/comments/reviewid/:reviewid', async (req, res) => {
  try {
    const collection = db.collection('comments'); 
    const reviewid = req.params.reviewid;
    const comments = await collection.find({ reviewid }).toArray();
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments by review id:', err);
    res.status(500).json({ error: 'Failed to fetch comments by review id' });
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

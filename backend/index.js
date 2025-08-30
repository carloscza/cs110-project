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

// GET review by id

app.get('/api/review/reviewid/:reviewid', async (req, res) => {
  try {
    const collection = db.collection('reviews');
    const reviewId = parseInt(req.params.reviewid);
    
    const review = await collection.findOne({ reviewid: reviewId });
    
    if (!review) { return res.status(404).json({ error: 'Review not found' }); }
    
    res.json(review);
  } catch (err) {
    console.error('Error fetching review by reviewid:', err);
    res.status(500).json({ error: 'Failed to fetch review by id' });
  }
});

// GET reviews by album id
app.get('/api/reviews/albumid/:albumid', async (req, res) => {
  try {
    const collection = db.collection('reviews');
    const albumid = parseInt(req.params.albumid); 
    const reviews = await collection.find({ albumid }).toArray();

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this album.' });
    }

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews by albumid:', err);
    res.status(500).json({ error: 'Failed to fetch reviews by albumid' });
  }
});

// GET reviews by user id
app.get('/api/reviews/userid/:userid', async (req, res) => {
  try {
    const collection = db.collection('reviews');
    const userid = parseInt(req.params.userid, 10);
    const reviews = await collection.find({ userid }).toArray();

    // Always return a 200 status—even if reviews list is empty
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews by userid:', err);
    res.status(500).json({ error: 'Failed to fetch reviews by userid' });
  }
});

// GET reviews by user id
app.get('/api/reviews/albumid/:userid', async (req, res) => {
  try {
    const collection = db.collection('reviews');
    const userid = parseInt(req.params.userid); 
    const reviews = await collection.find({ userid }).toArray();

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this user.' });
    }

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews by userid:', err);
    res.status(500).json({ error: 'Failed to fetch reviews by userid' });
  }
});

// GET album by id

app.get('/api/albums/albumid/:albumid', async (req, res) => {
  try {
    const collection = db.collection('albums');
    const albumId = parseInt(req.params.albumid);
    
    const album = await collection.findOne({ albumid: albumId });
    
    if (!album) { return res.status(404).json({ error: 'Album not found' }); }
    
    res.json(album);
  } catch (err) {
    console.error('Error fetching album by albumid :', err);
    res.status(500).json({ error: 'Failed to fetch album by id' });
  }
});

app.get('/api/review/:reviewid/user', async (req, res) => {
  try {
    const reviewsCollection = db.collection('reviews');
    const usersCollection = db.collection('users');
    
    const reviewId = parseInt(req.params.reviewid);
    
    const review = await reviewsCollection.findOne({ reviewid: reviewId });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const user = await usersCollection.findOne(
      { userid: review.userid },
      { 
        projection: { 
          password: 0,    
          _id: 0          
        } 
      }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      username: user.username,
      userpic: user.userpic,
      userid: user.userid
    });
    
  } catch (err) {
    console.error('Error fetching user by review:', err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// GET comments with user info by reviewid
app.get('/api/comments/review/:reviewid', async (req, res) => {
  try {
    const commentsCollection = db.collection('comments');
    const reviewId = parseInt(req.params.reviewid);
    
    const comments = await commentsCollection.aggregate([
      { $match: { reviewid: reviewId } },
      {
        $lookup: {
          from: 'users',
          localField: 'userid',
          foreignField: 'userid',
          as: 'userInfo'
        }
      },
      {
        $project: {
          commentid: 1,
          reviewid: 1,
          comment: 1,
          'userInfo.username': 1,
          'userInfo.userpic': 1
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$userInfo', 0] }
        }
      },
      {
        $project: {
          userInfo: 0  
        }
      }
    ]).toArray();
    
    res.json(comments);
    
  } catch (err) {
    console.error('Error fetching comments with users:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});


app.get('/api/users/userid/:userid', async (req, res) => {
  try {
    const users = await db.collection('users')
      .find({}, { projection: { username: 1, userpic: 1 } })
      .toArray();

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});



// POST create new comments on a review post
app.post('/api/comments', async (req, res) => {
  try {
    const { reviewid, userid, comment } = req.body;
    const newComment = { reviewid, userid, comment, };
    const result = await db.collection('comments').insertOne(newComment);
    const insertedComment = await db.collection('comments').findOne({ _id: result.insertedId });
    const user = await db.collection('users').findOne({ userid: insertedComment.userid });
    insertedComment.user = { username: user.username, userpic: user.userpic };
    res.status(201).json(insertedComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});


// Search albums by title
app.get('/api/albums/search', async (req, res) => {
  try {
    const { title } = req.query;
    
    if (!title) {
      return res.status(400).json({ error: 'Title parameter is required' });
    }

    const collection = db.collection('albums');
    
    const albums = await collection.find({
      title: { $regex: title, $options: 'i' }
    }).toArray();

    res.json(albums);
  } catch (err) {
    console.error('Error searching albums:', err);
    res.status(500).json({ error: 'Failed to search albums' });
  }
});





// GET albums + reviews collection:
app.get("/api/albums/with-reviews", async (req, res) => {
  try {
    const results = await db.collection("reviews").aggregate([
      {
        $lookup: {
          from: "albums",
          localField: "albumid",
          foreignField: "albumid",
          as: "album"
        }
      },
      { $unwind: "$album" },
      {
        $group: {
          _id: "$album.albumid",
          overallrating: { $avg: "$rating" },
          title: { $first: "$album.title" },
          cover: { $first: "$album.cover" },
          artist: { $first: "$album.artist" },
          genre: { $first: "$album.genre" },
        }
      }
    ]).toArray();

    res.json(results);
  } catch (err) {
    console.error("Error fetching albums with reviews:", err);
    res.status(500).json({ error: "Failed to fetch album reviews" });
  }
});

// GET albums + reviews collection based on album id (overall album review data):
app.get('/api/albums/with-reviews/:albumid', async (req, res) => {
  try {
    const albumid = parseInt(req.params.albumid, 10); 

    const result = await db.collection('reviews').aggregate([
      { $match: { albumid: albumid } },

      {
        $lookup: {
          from: 'albums',
          localField: 'albumid',
          foreignField: 'albumid',
          as: 'album'
        }
      },

      { $unwind: "$album" },

      {
        $group: {
          _id: "$album.albumid",
          overallrating: { $avg: "$rating" },
          title: { $first: "$album.title" },
          cover: { $first: "$album.cover" },
          artist: { $first: "$album.artist" },
          genre: { $first: "$album.genre" }
        }
      }
    ]).toArray();

    if (result.length === 0) {
      return res.status(404).json({ error: "Album not found or no reviews yet." });
    }

    res.json(result[0]); 
  } catch (err) {
    console.error("Error fetching album with reviews:", err);
    res.status(500).json({ error: "Failed to fetch album with reviews" });
  }
});


// GET albums + reviews based on genre
app.get('/api/albums/with-reviews/genre/:genre', async (req, res) => {
  try {
    const genre = req.params.genre; 

    const results = await db.collection('reviews').aggregate([
      {
        $lookup: {
          from: 'albums',
          localField: 'albumid',
          foreignField: 'albumid',
          as: 'album'
        }
      },
      { $unwind: "$album" },
      { $match: { "album.genre": genre } },
      {
        $group: {
          _id: "$album.albumid",
          overallrating: { $avg: "$rating" },
          reviewscnt: { $sum: 1 },       
          title: { $first: "$album.title" },
          cover: { $first: "$album.cover" },
          artist: { $first: "$album.artist" },
          genre: { $first: "$album.genre" }
        }
      }
    ]).toArray();

    if (results.length === 0) {
      return res.status(404).json({ error: `No albums found for genre: ${genre}` });
    }

    res.json(results); 
  } catch (err) {
    console.error("Error fetching albums by genre:", err);
    res.status(500).json({ error: "Failed to fetch albums by genre" });
  }
});


// GET all reviews of album based on albumid
app.get('/api/albums/:albumid/reviews', async (req, res) => {
  try {
    const albumid = parseInt(req.params.albumid); 
    const results = await db.collection('albums').aggregate([
      { $match: { albumid: albumid } },
      {
        $lookup: {
          from: 'reviews',
          localField: 'albumid',
          foreignField: 'albumid',
          as: 'reviews'
        }
      }
    ]).toArray();

    if (results.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching album reviews:', err);
    res.status(500).json({ error: 'Failed to fetch album reviews' });
  }
});


// GET search for user using 'username'. Returns and array of partial matches based on query (limit is 20 results).
app.get('/api/search-user/by-username/', async (req, res) => {
  const query = req.query.username;
  if (!query) { return res.status(400).send('An username query parameter is required.'); }

  try {
    const result = await db.collection('users').find(
            { username:   { $regex: query, $options: 'i'} },
            { projection: { password : 0} }
      ).limit(20).toArray();
    res.json(result);
  } catch (err) {
    console.log("Error searching for user by username.", err);
    res.status(500).json({error: 'Failed to search for user by username'});
  }
});


// GET album by title
app.get('/api/albums/search/:title', async (req, res) => {
  try {
    const title = req.params.title;

    const album = await db.collection('albums').findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') } 
    });

    if (!album) {
      return res.status(404).json({ error: `Album with title "${title}" not found. Please try again.` });
    }

    res.json(album);
  } catch (err) {
    console.error('Error searching for album:', err);
    res.status(500).json({ error: 'Failed to search for album' });
  }
});




// GET albums by partial title for suggestions
app.get('/api/albums/search-suggest/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const results = await db.collection('albums')
      .find({ title: { $regex: query, $options: 'i' } }) 
      .limit(5) 
      .toArray();

    res.json(results);
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

//recom. alg.
app.get('/api/albums/recommend/:albumId', async (req, res) => {
  const albumId = parseInt(req.params.albumId);

  try {
    const albumsCollection = db.collection('albums');

    const currentAlbum = await albumsCollection.findOne({ albumid: albumId });

    if (!currentAlbum) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const recommendations = await albumsCollection.find({
      albumid: { $ne: albumId },
      $or: [
        { genre: currentAlbum.genre },
        { artist: currentAlbum.artist }
      ]
    }).limit(10).toArray();

    res.json(recommendations);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// POST follow/unfollow user endpoint
app.post('/api/users/follow', async (req, res) => {
  const { currentUserId, targetUserId, action } = req.body;

  if (!currentUserId || !targetUserId || !action) {
    return res.status(400).json({ 
      error: 'currentUserId, targetUserId, and action are required' 
    });
  }

  if (action !== 'follow' && action !== 'unfollow') {
    return res.status(400).json({ 
      error: 'action must be either "follow" or "unfollow"' 
    });
  }

  if (currentUserId === targetUserId) {
    return res.status(400).json({ 
      error: 'Users cannot follow themselves' 
    });
  }

  try {
    const session = db.client.startSession();
    
    await session.withTransaction(async () => {
      const usersCollection = db.collection('users');

      const [currentUser, targetUser] = await Promise.all([
        usersCollection.findOne({ userid: currentUserId }),
        usersCollection.findOne({ userid: targetUserId })
      ]);

      if (!currentUser) {
        throw new Error('Current user not found');
      }
      if (!targetUser) {
        throw new Error('Target user not found');
      }

      if (action === 'follow') {
        if (currentUser.following && currentUser.following.includes(targetUserId)) {
          throw new Error('Already following this user');
        }

        await usersCollection.updateOne(
          { userid: currentUserId },
          { $addToSet: { following: targetUserId } }
        );

        await usersCollection.updateOne(
          { userid: targetUserId },
          { $addToSet: { followers: currentUserId } }
        );

      } else { // unfollow
        if (!currentUser.following || !currentUser.following.includes(targetUserId)) {
          throw new Error('Not following this user');
        }

        await usersCollection.updateOne(
          { userid: currentUserId },
          { $pull: { following: targetUserId } }
        );

        await usersCollection.updateOne(
          { userid: targetUserId },
          { $pull: { followers: currentUserId } }
        );
      }
    });

    await session.endSession();

    res.json({ 
      success: true, 
      message: `Successfully ${action}ed user`,
      action: action
    });

  } catch (error) {
    console.error(`Error ${action}ing user:`, error);
    
    if (error.message.includes('not found') || 
        error.message.includes('Already following') || 
        error.message.includes('Not following')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: `Failed to ${action} user` });
  }
});


// GET user by userid
app.get('/api/user/:userid', async (req, res) => {
  const userid = parseInt(req.params.userid);
  
  if (!userid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await db.collection('users').findOne(
      { userid: userid },
      { projection: { password: 0 } } 
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create a new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { albumid, userid, rating, review } = req.body;

    if (!albumid || !userid || rating === undefined || !review) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['albumid', 'userid', 'rating', 'review']
      });
    }

    if (rating < 0 || rating > 100) { return res.status(400).json({error: 'Rating must be between 0 and 100'});}

    let reviewid = 1;
    try {
      const reviewCount = await db.collection('reviews').countDocuments();
      reviewid = reviewCount + 1;
    } catch (reviewIdError) { console.error('Error getting review count:', reviewIdError);}

    const newReview = {
      reviewid,
      albumid: parseInt(albumid),
      userid: parseInt(userid),
      rating: parseInt(rating),
      review: review.trim()
    };

    const result = await db.collection('reviews').insertOne(newReview);
    if (result.acknowledged) {
      res.status(201).json({
        message: 'Review created successfully',
        review: {
          _id: result.insertedId,
          ...newReview
        }
      });
    } else {
      res.status(500).json({ error: 'Failed to create review' });
    }

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
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

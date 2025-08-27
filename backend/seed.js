require('dotenv').config();
const { MongoClient } = require('mongodb');

// Replace with your MongoDB Atlas connection string here:
const url = process.env.MONGODB_URI;

const client = new MongoClient(url);
const dbName = process.env.DB_NAME;

// SEED DATA
const albumsSeed = [
  {
    albumid: 1, 
    title: "Let God Sort Em Out", 
    cover: "https://i.discogs.com/HOCslwb8Kq7ffVRwl2jcZEff8hHZjFEoAZgmsQoJuuk/rs:fit/g:sm/q:90/h:585/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM0NTEw/NTU1LTE3NTI0NDky/NjUtOTg5OS5qcGVn.jpeg", 
    artist: "Clipse", 
    genre: "hiphop"
  },
  {
    albumid: 2, 
    title: "My Beautiful Dark Twisted Fantasy", 
    cover: "https://i.discogs.com/3RRJgAX-aSq0JB4tAZBpdWQezFQPiDauBE9eV0uhEAM/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1NTkx/NTItMTczMTcxMzky/OC01OTQ0LmpwZWc.jpeg", 
    artist: "Kanye West", 
    genre: "hiphop"
  },
  {
    albumid: 3, 
    title: "Get Rich Or Die Tryin", 
    cover: "https://i.discogs.com/AMVipM-vD1NU3NhvRZkzNkzCup5PakFAJJqVUj3UDXU/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1ODg4/Mi0xNDI1NzA3OTQw/LTg4MDUuanBlZw.jpeg", 
    artist: "50 Cent",  
    genre: "hiphop"
  },
  {
    albumid: 4, 
    title: "Good Kid, M.A.A.D City", 
    cover: "https://i.discogs.com/HdsntvQX4LJibo7bIdG4SU-V9224aVcbzVcWROFlglE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0MTEw/MTM1LTE2NTk3MTM5/NDQtODY4Ny5qcGVn.jpeg", 
    artist: "Kendrick Lamar", 
    genre: "hiphop"
  },
  {
    albumid: 5, 
    title: "What A Time To Be Alive", 
    cover: "https://i.discogs.com/ivJ9MOCeGLvq1-yPRml59ICHFNy-v_Ki0RPP4OOOKj0/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc1MDI1/MTMtMTQ1ODM3OTEx/My02NzI3LmpwZWc.jpeg", 
    artist: "Drake", 
    genre: "hiphop"
  },
  {
    albumid: 6, 
    title: "Aquemini", 
    cover: "https://i.discogs.com/Lu0iLwS0rJ3xJr-0N-FGD6x-riN0fcnLAeZnRpS9CJg/rs:fit/g:sm/q:90/h:600/w:598/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2OTMy/NS0xNzM2OTQ3MzAy/LTgzODYuanBlZw.jpeg", 
    artist: "OutKast", 
    genre: "hiphop"
  },
  {
    albumid: 7, 
    title: "Rubber Soul", 
    cover: "https://i.discogs.com/11fZZmo159nbKljreK5sEM8kWo5gi431XQkI5oz9h9Q/rs:fit/g:sm/q:90/h:600/w:595/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTU1MDE2/OTUtMTU4NjA4MDcz/MS00OTQyLmpwZWc.jpeg", 
    artist: "The Beatles", 
    genre: "rock"
  },
  {
    albumid: 8, 
    title: "Nevermind", 
    cover: "https://i.discogs.com/os3Gm61mroiZvEw2bIGtNDf0RXydEx8PRmIk-YYwBSU/rs:fit/g:sm/q:90/h:600/w:594/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE4MTMw/MDYtMTQzNjgxNDc2/Mi05NjgxLmpwZWc.jpeg", 
    artist: "Nirvana", 
    genre: "rock"
  },
  {
    albumid: 9, 
    title: "Led Zeppelin II", 
    cover: "https://i.discogs.com/bEuunXSf4FTwyb55du4Q-gjfAXIRHamq-7LNi_1w0Fg/rs:fit/g:sm/q:90/h:598/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE4NDYy/MjMtMTUxODkwMDEx/NC05MTE2LmpwZWc.jpeg", 
    artist: "Led Zeppelin", 
    genre: "rock"
  },
  {
    albumid: 10, 
    title: "The Clash", 
    cover: "https://i.discogs.com/btwyRchLnxlg0KHMq32rXSy6ci6uanqtiIu6pP5G6I4/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzMDg4/NzY0LTE1NDc4NTAz/ODYtMjkxNC5qcGVn.jpeg", 
    artist: "The Clash", 
    genre: "rock"
  },
];

const usersSeed = [
  {
    userid: 1,
    username: "user1",
    password: "1234",
    userpic: "",
    following: [2, 3],
    followers: [2]
  },
  {
    userid: 2,
    username: "user2",
    password: "5678",
    userpic: "",
    following: [3],
    followers: [3]
  },
  {
    userid: 3,
    username: "user3",
    password: "asdf",
    userpic: "",
    following: [1, 2],
    followers: [1, 2]
  }
];

const reviewsSeed = [
  {
    reviewid: 1,
    albumid: 7,
    userid: 1,
    rating: 99,
    review: "This is my 1 review of the album.",
  },
  {
    reviewid: 2,
    albumid: 1,
    userid: 1,
    rating: 88,
    review: "This is my 1 review of the album.",
  },
  {
    reviewid: 3,
    albumid: 6,
    userid: 2,
    rating: 93,
    review: "This is my 2 review of the album.",
  },
  {
    reviewid: 4,
    albumid: 5,
    userid: 3,
    rating: 82,
    review: "This is my 3 review of the album.",
  },
  {
    reviewid: 5,
    albumid: 4,
    userid: 1,
    rating: 89,
    review: "This is my 1 review of the album.",
  },
  {
    reviewid: 6,
    albumid: 3,
    userid: 2,
    rating: 91,
    review: "This is my 2 review of the album.",
  },
  {
    reviewid: 7,
    albumid: 2,
    userid: 1,
    rating: 92,
    review: "This is my 1 review of the album.",
  },
  {
    reviewid: 8,
    albumid: 1,
    userid: 1,
    rating: 83,
    review: "This is my 1 review of the album.",
  },
  {
    reviewid: 9,
    albumid: 10,
    userid: 3,
    rating: 93,
    review: "This is my 3 review of the album.",
  },
  {
    reviewid: 10,
    albumid: 8,
    userid: 3,
    rating: 94,
    review: "This is my 1 review of the album.",
  },
  {
    reviewid: 11,
    albumid: 8,
    userid: 2,
    rating: 88,
    review: "This is my 2 review of the album.",
  },
  {
    reviewid: 12,
    albumid: 6,
    userid: 3,
    rating: 81,
    review: "This is my 3 review of the album.",
  },
  {
    reviewid: 13,
    albumid: 9,
    userid: 3,
    rating: 96,
    review: "This is my 3 review of the album.",
  },
];

const commentsSeed = [
  {
    commentid: 1,
    reviewid: 9,
    userid: 3,
    comment: "This is my 3 comment."
  },
  {
    commentid: 2,
    reviewid: 3,
    userid: 1,
    comment: "This is my 1 comment."
  },
  {
    commentid: 3,
    reviewid: 3,
    userid: 2,
    comment: "This is my 2 comment."
  },
  {
    commentid: 4,
    reviewid: 8,
    userid: 1,
    comment: "This is my 1 comment."
  },
];



async function runSeed() 
{
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(dbName);

    // Seed an albums collection in DB:
    console.log('Seeding albums collection...');
    const albumsCollection = db.collection('albums');
    await albumsCollection.deleteMany({});
    await albumsCollection.insertMany(albumsSeed);
    console.log("Successfully seeded a albums collection.");

    // Seed a users collection in DB:
    console.log('Seeding users collection...');
    const usersCollection = db.collection('users');
    await usersCollection.deleteMany({});
    await usersCollection.insertMany(usersSeed);
    console.log("Successfully seeded a users collection.");

    // Seed an reviews collection in DB:
    console.log('Seeding reviews collection...');
    const reviewsCollection = db.collection('reviews');
    await reviewsCollection.deleteMany({});
    await reviewsCollection.insertMany(reviewsSeed);
    console.log("Successfully seeded a reviews collection.");

    // Seed a comments collection in DB:
    console.log('Seeding comments collection...');
    const commentsCollection = db.collection('comments');
    await commentsCollection.deleteMany({});
    await commentsCollection.insertMany(commentsSeed);
    console.log("Successfully seeded a comments collection.");

  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
    console.log("DB connection closed.");
  }
}

runSeed().catch(console.dir);
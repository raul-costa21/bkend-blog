require("dotenv").config();
const { MongoClient, ObjectID } = require("mongodb");

// MongoDB inital config
const uri = process.env.URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Functions to be exported
// Connect to Server Database
module.exports.connect = connectMongoDB;

async function connectMongoDB() {
  try {
    await client.connect();
    console.log("Connected to Database");
  } catch (err) {
    console.log("Ups Error:\n", err);
  }
}

// Find Data
module.exports.getPosts = findMongoDB;

async function findMongoDB() {
  try {
    const database = client.db("Blog");
    const collection = database.collection("Posts");

    const posts = [];
    // the find{} returns a Cursor, to get rows/documents we need to loop trough the cursor; if we use findOne we would received the matched row/document
    const results = await collection.find({});

    for await (result of results) {
      posts.push(result);
    }

    return posts;
  } catch (err) {
    console.log("Ups Error:\n", err);
  }
}

// Find One
module.exports.getPost = findOneMongoDB;

async function findOneMongoDB(postId) {
  try {
    const database = client.db("Blog");
    const collection = database.collection("Posts");

    if (postId.length == 24) {
      const postFound = await collection.findOne({ _id: ObjectID(postId) });
      return postFound;
    } else {
      return null;
    }
  } catch (err) {
    console.log("Ups Error:\n", err);
  }
}

// Delete Data (ObjectID is a mongodb function we had to required in the app.js)
module.exports.deletePost = deleteMongoDB;

async function deleteMongoDB(postsId) {
  try {
    if (postsId === undefined) {
      return undefined;
    }

    const database = client.db("Blog");
    const collection = database.collection("Posts");

    if (typeof postsId == "string") {
      const postDelete = { _id: ObjectID(postsId) };
      const deletePost = await collection.deleteOne(postDelete);
    } else {
      for (let post of postsId) {
        const postDelete = { _id: ObjectID(post) };
        const deletePost = await collection.deleteOne(postDelete);
      }
    }
  } catch (err) {
    console.log("Ups Error:\n", err);
  }
}

// Create Data
module.exports.createPost = createMongoDB;

async function createMongoDB(req) {
  try {
    const database = client.db("Blog");
    const collection = database.collection("Posts");

    const post = { title: req.body.composeTitle, post: req.body.composePost };
    const insertPost = await collection.insertOne(post);
  } catch (err) {
    console.log("Ups Error:\n", err);
  }
}

const express = require("express");
const mdbFnc = require(__dirname + "/mongoDB_functions.js");
const mcFnc = require(__dirname + "/mailChimp.js");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async function (req, res) {
  const posts = await mdbFnc.getPosts();
  res.render("home.ejs", { postsData: posts });
});

app.get("/about", function (req, res) {
  res.render("about.ejs", {});
});

app
  .route("/compose")
  .get(function (req, res) {
    res.render("compose.ejs");
  })
  .post(async function (req, res) {
    const createPost = await mdbFnc.createPost(req);
    res.redirect("/");
  });

app
  .route("/delete")
  .get(async function (req, res) {
    const posts = await mdbFnc.getPosts();
    res.render("delete.ejs", { postsData: posts });
  })
  .post(async function (req, res) {
    const postsId = req.body.postId;
    const deletePost = await mdbFnc.deletePost(postsId);
    res.redirect("/delete");
  });

app
  .route("/subscribe")
  .get(async function (req, res) {
    res.render("subscribe.ejs");
  })
  .post(async function (req, res) {
    const sub = await mcFnc.sub(req);
    res.render("success-fail.ejs", { sub: sub });
  });

app.get("/posts/:requestId", async function (req, res) {
  const requestedId = req.params.requestId;
  const post = await mdbFnc.getPost(requestedId);

  if (post) {
    res.render("post.ejs", { postTitle: post.title, postContent: post.post });
  } else {
    res.redirect("/");
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, async function () {
  console.log("Server started on port 3000");
  const connect = await mdbFnc.connect();
});

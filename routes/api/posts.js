const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const _ = require('lodash');

const Post = require("../../models/Post");
const validatePostInput = require("../../validation/posts");

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});

// protected route to make posts
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      console.log(errors);
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      startLocation: req.body.startLocation,
      endLocation: req.body.endLocation,
      capacity: req.body.capacity,
      numPassengers: req.body.numPassengers,
      createdAt: req.body.createdAt,
      leaveDate: req.body.leaveDate,
      price: req.body.price,
      carMake: req.body.carMake,

      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

function filterKeys(currentObject, allowed) {
  let new_Object = {};
  console.log(currentObject['firstName'])
  // console.log(Object.keys(currentObject).
  //     filter(key => allowed.includes(key)).
  //     reduce((new_Object, key) => {
  //     new_Object[key] = currentObject[key];
  //     return new_Object;
  //   }, {}));

  return (
    Object.keys(currentObject).
      filter(key => allowed.includes(key)).
      reduce((new_Object, key) => {
      new_Object[key] = currentObject[key];
      return new_Object;
    }, {})
  );

}

router.get("/:postId", (req, res) => {
  // Post.find({"_id" : mongoose.Types.ObjectId(req.params.postId)}) 
    // .then((post) => res.json(post))
    // .catch((err) =>
    //   res.status(404).json({ nopostfound: "No post found with that ID" })
  // );
  Post.
    findOne({"_id" : mongoose.Types.ObjectId(req.params.postId)}).
    populate("user").
    exec(function (err, post) {
      if (err) return handleError(err);
      let allowed = ["firstName", "lastName", "username"];
      // const filteredObj = _.pick(post.user, allowed)
      post.user = _.pick(post.user, allowed);
      return res.json(post);
    })

});

router.delete('/:postId', function (req, res) {
  // Post.find({"_id" : mongoose.Types.ObjectId(req.params.postId)})
  //   // .then((post) => {
  //   //   if (post.user === )
  //   // } )

  //   .catch((err) =>
  //     res.status(404).json({ nopostfound: "No post found with that ID" })
  // );  
    
    // console.log(postItem._id);
  Post.deleteOne({"_id": mongoose.Types.ObjectId(req.params.postId)})
    .then(deletedDocument => {
      if(deletedDocument) {
        console.log(`Successfully deleted document that had the form: ${deletedDocument}.`);
      } else {
        console.log("No document matches the provided query.");
      }
      return deletedDocument;
    })  
    .catch(err => console.error(`Failed to find and delete document: ${err}`))
  }
);




module.exports = router;



// const  express = require("express");
import express from "express";
const Post = require("../models/Post");
const router: express.Router = express.Router();

router.get("/", async (req, res) => {
    Post.find({}, function(err: any, posts: any[]) {
        let postMap = {};

        posts.forEach(function(post) {
            // @ts-ignore
            postMap[post._id] = post;
        });

        res.send(postMap);
    });
    // try {
    //     const posts = Post.find();
    //     resp.json(posts);
    // } catch (e) {
    //     resp.status(400).json(e)
    // }
});

router.get("/:id", async (req, resp) => {
    try {
        const post = await Post.findById(req.params.id)
        resp.json(post)
    } catch (e) {
        console.log("Failled");
        resp.status(404).json(e)
    }
});
router.delete("/:id", async (req, resp) => {
    try {
        const deletedPost = await Post.remove({_id: req.params.id})
        resp.json(deletedPost)
    } catch (e) {
        console.log("Failed");
        resp.status(404).json(e)
    }
});

router.patch("/:id", async (req, resp) => {
    try {
        const updatedPost = await Post.updateOne(
            {_id: req.params.id}, {$set: {title: req.body.title}});
        resp.json(updatedPost)
    } catch (e) {
        console.log("Failed");
        resp.status(404).json(e)
    }
})

router.post("/", (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    post.save().then((data: any)=> {
        res.status(201).json(data)
    }).catch((err: any)=>{
        res.status(400).json(err)
    })
});
//
module.exports = router;

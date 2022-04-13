// implement your posts router here 

const express = require('express');
const Posts = require('./posts-model')
const router = express.Router();

//error messages
const err500 = "The posts information could not be retrieved";
const err404 = "The post with the specified ID does not exist";
const err400 = "Please provide title and contents for the post";

// GET /api/posts
    // if error, 500, "The posts information could not be retrieved"
router.get('/', (req,res)=>{
    Posts.find()
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({
                message: err500,
                error: err.message,
            })
        })
});

// GET /api/posts/:id
//  if post id not found (404) "The post with the specified ID does not exist"
//  if error, 500

router.get('/:id', (req,res)=>{
    Posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: err404,
                })
            }
            res.json(post);
        })
        .catch(err => {
            res.status(500).json({
                message: err500,
                error: err.message
            })
        })
});

// POST /api/posts
//  if missing title or contents (400)
//  if valid, post, 201, return post
//  if bad 500
router.post('/', (req,res)=>{
    let post = req.body;
    if (!post.title || !post.contents) {
        res.status(400).json({
            message: err400,
        })
    } else {
        Posts.insert(post)
            .then(newPost => {
                res.status(201).json(newPost)
            })
            .catch(err=>{
                res.status(500).json({
                    message: err500,
                    error: err.message,
                })
            })
    }
});

// PUT /api/posts/:id
//  if not found, 404
//  if missing 400
//  if bad 500
//  if valid, update using request body, 200, return new post
router.put('/:id', (req,res)=>{
    let id = req.params.id;
    let post = req.body;
    if (!post.title || !post.contents) {
        res.status(400).json({
            message: err400,
        })
    } else {
        Posts.update(id, post)
            .then(updatedPost => {
                if (!updatedPost) {
                    res.status(404).json({
                        message: err404,
                    })
                } else {
                    res.status(200).json(updatedPost)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: err500,
                    error: err.message,
                })
            })
    }
});

// DELETE /api/posts/:id
//  if not found, 404
//  if bad, 500
router.delete('/:id', (req,res)=>{
    Posts.remove(req.params.id)
        .then(deletedPost=>{
            if (!deletedPost) {
                res.status(404).json({
                    message: err404,
                })
            } else {
                res.json(deletedPost)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err500,
                error: err.message,
            })
        })
});

// GET /api/posts/:id/comments
// 404 if none
// 500 if bad
router.get('/', (req,res)=>{

});

module.exports = router ;
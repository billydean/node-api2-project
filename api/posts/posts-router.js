// implement your posts router here 

const express = require('express');
const Posts = require('./posts-model')
const router = express.Router();

//error messages

// GET /api/posts
    // if error, 500, "The posts information could not be retrieved"
router.get('/', (req,res)=>{
    Posts.find()
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
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
                    message: "The post with the specified ID does not exist",
                })
            }
            res.json(post);
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be retrieved",
                error: err.message
            })
        })
});

// POST /api/posts
//  if missing title or contents (400)
//  if valid, post, 201, return post
//  if bad 500
router.post('/', (req,res)=>{
    let {title, contents} = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        })
    } else {
        Posts.insert({title,contents})
            .then(({ id }) => {
                return Posts.findById(id)
            })
            .then(newPost => {
                res.status(201).json(newPost)
            })
            .catch(err=>{
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
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
    const {title, contents} = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        })
    } else {
        Posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist",
            })
        } else {
            return Posts.update(req.params.id, req.body)
        }
    })
        .then(data => {
            if (data) {
                return Posts.findById(req.params.id);
            }
        })
        .then(post => {
            if (post) {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be modified",
                error: err.message,
            })
        })
    }
});

// DELETE /api/posts/:id
//  if not found, 404
//  if bad, 500
router.delete('/:id', async (req,res)=>{
    try {
        const deleted = await Posts.findById(req.params.id);
        if (!deleted) {
            res.status(404).json({
                message: "The post with the specified ID does not exist",
            })
        } else {
            await Posts.remove(req.params.id)
            res.json(deleted)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message,
        })
    }
});

// GET /api/posts/:id/comments
// 404 if none
// 500 if bad
router.get('/:id/comments', async (req,res)=>{
    try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
        res.status(404).json({
            message: "The post with the specified ID does not exist"
        })
    } else {
        const comments = await Posts.findPostComments(req.params.id);
        res.json(comments)
    }
} catch (err) {
    res.status(500).json({
        message: "The comments information could not be retrieved",
        error: err.message,
    })
}
});


module.exports = router ;
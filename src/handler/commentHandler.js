const Comment = require('../model/commentModel');

const addComment = async (req, res) => {
    const username = req.cookies.username;

    const comment = new Comment({
        videoId: req.body.videoId,
        username: username,
        comment: req.body.comment,
        timestamp: Date.now()
    });

    try {
        const commentToSave = await comment.save();

        res.status(200).json({
            message: "Comment saved successfully",
            comment: commentToSave
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            videoId: req.params.id
        });
        res.json(comments);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

module.exports = {
    addComment,
    getComments
};
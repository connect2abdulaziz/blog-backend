const Comment = require('../db/models/comment'); 
const User = require('../db/models/user');
const AppError = require('../utils/appError'); 

const addComment = async ({ postId, parentId, content }, userId) => {
    // Check if parentId is provided and valid
    if (parentId && !(await Comment.findByPk(parentId))) {
        throw new AppError("Invalid parent comment ID", 400);
    }
    try {
        const newComment = await Comment.create({
            userId,
            postId,
            parentId: parentId || null,
            content,
            createdAt: new Date(),
            updatedAt: new Date()  
        });
        // Fetch the user associated with the comment
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return {
            ...newComment.toJSON(),
            user: {
                firstName: user.firstName,
                thumbnail: user.thumbnails
            }
        };
    } catch (error) {  
        throw new AppError(error.message || "An error occurred while adding the comment", 400);
    }
};



const getCommentsByPostId = async (postId) => {
    try {
        const comments = await Comment.findAll({
            where: { postId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'thumbnail'] 
                }
            ],
            order: [['createdAt', 'ASC']] 
        });
        return comments;
    } catch (error) {
        throw new AppError(error.message || "An error occurred while retrieving comments", 400);
    }
};


const updateComment = async ({ commentId, content }) => {
    try {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            throw new AppError("Comment not found", 404);
        }
        await comment.update({
            content,
            updatedAt: new Date() 
        });
        return comment;
    } catch (error) {
        throw new AppError(error.message || "An error occurred while updating the comment", 400);
    }
};


const deleteComment = async ({ id }) => {
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            throw new AppError("Comment not found", 404);
        }
        await comment.destroy();
        return id;
    } catch (error) {
        throw new AppError(error.message || "An error occurred while deleting the comment", 400);
    }
}


module.exports = {addComment, getCommentsByPostId, updateComment, deleteComment};

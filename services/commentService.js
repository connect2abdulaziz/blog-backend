const Comment = require('../db/models/comment'); 
const User = require('../db/models/user');
const Post = require('../db/models/post');
const AppError = require('../utils/appError'); 

const addComment = async ({ postId, parentId, content }, userId) => {
    // Check if parentId is provided and valid
    if (parentId && !(await Comment.findByPk(parentId))) {
        throw new AppError("Invalid parent comment ID", 400);
    }
    if( !await Post.findByPk(postId)) {
        throw new AppError("Invalid post ID", 400);
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
                thumbnail: user.thumbnail
            }
        };
    } catch (error) {  
        throw new AppError(error.message || "An error occurred while adding the comment", 400);
    }
};



const getCommentsByPostId = async (postId) => {
    if (!(await Post.findByPk(postId))) {
        throw new AppError("Invalid post ID", 400);
    }

    try {
        // Fetch all comments for the specified post
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

        // Function to build a hierarchical structure
        const buildHierarchy = (comments) => {
            const commentMap = new Map();
            const rootComments = [];

            // Create a map of all comments by ID for quick access
            comments.forEach(comment => {
                commentMap.set(comment.id, { ...comment.toJSON(), replies: [] });
            });

            // Build the hierarchy
            comments.forEach(comment => {
                if (comment.parentId) {
                    const parentComment = commentMap.get(comment.parentId);
                    if (parentComment) {
                        parentComment.replies.push(commentMap.get(comment.id));
                    }
                } else {
                    rootComments.push(commentMap.get(comment.id));
                }
            });

            return rootComments;
        };

        const hierarchicalComments = buildHierarchy(comments);

        return hierarchicalComments;
        
    } catch (error) {
        throw new AppError(error.message || "An error occurred while retrieving comments", 400);
    }
};



const updateComment = async ({content }, commentId) => {
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


const deleteComment = async (commentId) => {
    try {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            throw new AppError("Comment not found", 404);
        }
        await comment.destroy();
        return commentId;
    } catch (error) {
        throw new AppError(error.message || "An error occurred while deleting the comment", 400);
    }
}


module.exports = {addComment, getCommentsByPostId, updateComment, deleteComment};

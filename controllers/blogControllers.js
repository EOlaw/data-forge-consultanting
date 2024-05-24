const Blog = require('../models/blogModel')

const blogControllers = {
    // Create a new blog post
    createBlog: async (req, res) => {
        try {
            const blog = new Blog(req.body);
            await blog.save();
            res.status(201).json(blog);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get all blog posts
    getBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find().populate('authorID');
            res.status(200).json(blogs);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get a blog post
    getBlog: async (req, res) => {
        try {
            const blog = await Blog.findById(req.params.id).populate('authorID');
            if (!blog) return res.status(404).json('Blog post not found');
            res.status(200).json(blog);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Update a blog post by ID
    updateBlog: async (req, res) => {
        try {
            const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!blog) return res.status(404).json('Blog post not found');
            res.status(200).json(blog);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Delete a blog post by ID
    deleteBlog: async (req, res) => {
        try {
            const blog = await Blog.findByIdAndDelete(req.params.id);
            if (!blog) return res.status(404).json('Blog post not found');
            res.status(200).json('Blog post deleted');
        } catch (error) {
            res.status(400).json(error);
        }
    }
}

module.exports = blogControllers
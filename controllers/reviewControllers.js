const Review = require('../models/reviewModel')

const reviewControllers = {
    // Create a new review
    createReview: async (req, res) => {
        try {
            const review = new Review(req.body);
            await review.save();
            res.status(201).json(review);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get all reviews
    getReviews: async (req, res) => {
        try {
            const review = await Review.find().populate('clientID').populate('consultantID');
            res.status(200).json(review);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get a review by ID
    getReview: async (req, res) => {
        try {
            const review = await Review.findById(req.params.id).populate('clientID').populate('consultantID');
            if (!review) return res.status(404).json('Review not found');
            res.status(200).json(review);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Update a review by ID
    updateReview: async (req, res) => {
        try {
            const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!review) return res.status(404).json('Review not found');
            res.status(200).json(review);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Delete a review by ID
    deleteReview: async (req, res) => {
        try {
            const review = await Review.findByIdAndDelete(req.params.id);
            if (!review) return res.status(404).json('Review not found');
            res.status(200).json('Review deleted');
        } catch (error) {
            res.status(400).json(error);
        }
    }
}

module.exports = reviewControllers
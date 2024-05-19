const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    authorID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String] },
    datePublished: { type: Date, default: Date.now },
    status: { type: String, enum: ['Draft', 'Published'], required: true }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog

const mongoose = require("mongoose");

// ============ USER SCHEMA ============
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

// ============ POST SCHEMA ============
const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    establishmentName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    helpfulCount: { type: Number, default: 0 },
    unhelpfulCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model("Post", postSchema);

// ============ REPLY SCHEMA ============
const replySchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Reply = mongoose.model("Reply", replySchema);

module.exports = { User, Post, Reply };

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// MongoDB connection string from environment variable
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database Connected Successfully");
})
.catch((error) => {
    console.error("Database connection error:", error.message);
});


// Define the schema for storing images
const imageSchema = new mongoose.Schema({
    filename : {
        type : String,
        required: true
    },
    contentType : {
        type: String,
        required : true
    },
    imageBase64 : {
        type : String,
        required: true
    }
});

// Define the schema for user data
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        enum: ['basic', 'prime'],
        default: 'basic'
    },
    status: {
        type: String,
        enum: ['member', 'prime'],
        default: 'member'
    },
    preferences: [{
        type: String,
        enum: ['travel', 'weather']
    }],
    notificationPreferences: {
        type: String,
        enum: ['email', 'sms', 'push'],
        default: 'email'
    },
    languageSettings: {
        type: String,
        enum: ['en', 'fr', 'sp', 'ko', 'zh'], 
        default: 'en'
    },
    images: [imageSchema]
});


// Add indexing to the email field for better query performance
userSchema.index({ email: 1 });

// Create a model for the user schema
const collection = mongoose.model("users", userSchema);

// Create a model for the image schema
const Image = mongoose.model("images", imageSchema);

module.exports = { User: collection, Image: Image, mongoose }; 
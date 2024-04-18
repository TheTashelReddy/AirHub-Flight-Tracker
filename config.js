const mongoose = require('mongoose');
// Connect to MongoDB
const connect = mongoose.connect( 'mongodb+srv://trackairhub:mYscVnRcyYlNVU09@cluster0.hnkcfcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');


// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})


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

module.exports = { User: collection, Image: Image }; 
const mongoose = require('mongoose');

var sauceSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String],
    name: [String],
});

module.exports =  mongoose.model('Sauce', sauceSchema);
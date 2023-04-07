const mongoose = require('mongoose');

var sauceSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: String,
    likes: String,
    dislikes: String,
    usersLiked: [String],
    name: [String],
});

module.exports =  mongoose.model('Sauce', sauceSchema);
const mongoose = require('mongoose');

const ProfilePictureSchema = new mongoose.Schema({
    imagePath: String,

});

const ProfilePicture = mongoose.model('ProfilePicture', ProfilePictureSchema);

module.exports = ProfilePicture;
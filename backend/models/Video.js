const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: Number, required: true },
    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;

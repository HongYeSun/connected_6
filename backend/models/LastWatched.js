const mongoose = require('mongoose');

const LastWatchedSchema= new mongoose.Schema({
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    time: { type: Number, min: 0 },//float?
},{
    versionKey: false});

const LastWatched = mongoose.model('LastWatched', LastWatchedSchema);

module.exports = LastWatched;
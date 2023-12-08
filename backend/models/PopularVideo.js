const mongoose = require('mongoose');

const PopularVideosSchema = new mongoose.Schema({
        male: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
        female: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
        other: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
        total:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

const PopularVideos = mongoose.model('PopularVideos', PopularVideosSchema);
module.exports = PopularVideos;
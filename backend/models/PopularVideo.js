const mongoose = require('mongoose');

const PopularVideosSchema = new mongoose.Schema({
    byAge: [
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 0-9
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 10-19
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 20-29
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 30-39
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 40-49
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 50-59
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 60-69
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]  // 70+
    ],
    byGender: {
        'male': [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
        'female': [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
        'other': [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
    }
});

const PopularVideos = mongoose.model('PopularVideos', PopularVideosSchema);
module.exports = PopularVideos;
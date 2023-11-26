const mongoose = require('mongoose');
//https://github.com/Hosang10Lee/opennotes/blob/%40sogang/termproject/Sample_Urls.md 기반

//변수명은 해당 json 파일을 기준으로 함
const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true }, //제작자
    description: { type: String, required: true }, //설명
    thumb:{ type: String, required: true }, //썸네일
    source: { type: String, required: true }, //파일 저장 대신 url
   // duration: { type: Number, required: true },
    bookmark: {type:Number,default:0,required:true}, //북마크 한 수
    like:  {type:Number,default:0,required:true}, //좋아요 한 수
    views: { type: Number, default: 0, required: true } // 조회수

}, {
    versionKey: false});

const Video = mongoose.model('Video', VideoSchema);
module.exports = Video;

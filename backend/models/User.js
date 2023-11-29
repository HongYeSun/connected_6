const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  //이메일로 로그인 해야하니까 unique, 이메일 형식 검증
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true, maxlength: 100 },
  profilePicture: {type:Number, min:1, max:15 , required: true}, //1~15
  gender: { type: String, enum: ['f', 'm', 'other'] , required: true},
  age: { type: Number, min: 0 , required: true},
  likedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 좋아요한 비디오
  bookmarkedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 찜한 비디오
  recentVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // 최근에 본 비디오 (최대 20개)
  accessTimes: [{ type: Number }],  // 총 스크린타임 (24시간 array)
  todayAccessTimes:[{ type: Number }], //오늘 스크린타임
  lastRequestTime: { type: Date, default: Date.now }
});

// 비밀번호 암호화
UserSchema.pre('save', async function (next) {
  try {
    const user = this;
    if(user.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    }
  } catch (error) {
    next(error);
  }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
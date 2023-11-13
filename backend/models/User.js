const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ProfilePicture = require('./ProfilePictures'); // profilepictures.js 파일 경로에 맞게 수정

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  //이메일로 로그인 해야하니까 unique, 이메일 형식 검증
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfilePicture' , required: true},
  // playtime: { type: Number, default: 0 },  이거 구현하려면 게시물 model 있어야....
  gender: { type: String, enum: ['f', 'm', 'other'] , required: true},
  age: { type: Number, min: 0 , required: true}
});

// 비밀번호 암호화
UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
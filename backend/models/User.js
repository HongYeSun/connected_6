const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  //이메일로 로그인 해야하니까 unique, 이메일 형식 검증
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  profilePicture: {type:Number, min:1, max:15 , required: true},
  // playtime: { type: Number, default: 0 },  이거 구현하려면 video model 있어야....
  gender: { type: String, enum: ['f', 'm', 'other'] , required: true},
  age: { type: Number, min: 0 , required: true}

  //로그인 하는 시점 시간 저장: 24시간 (하루 시간에
  //종료시점 기록:세션 종료시간 (구현가능한지 찾아보기!)
  //주로 이용한 시간대, 과거 시청기록(몇개까지), 하루 이용 시간 이건 어떻게 구현할건지..?
  //user도 좋아요한 video를 확인할 수 있어야...(여기서 구현)
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
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

//TODO: 회의에서 얘기 해봐야할듯!

//1. 인기동영상을 요청 들어올때마다(좋아요 버튼 누르기 등) 업데이트 vs node-cron으로 12시간 주기로 업데이트
// node-cron

//2. 이어보기 어떻게 구현!! (프론트에서는 해당 초부터 재생 시작 가능? 어떤 형식으로 넘겨줘야하지?)
//프론트: 현재 00초부터 재생(추후 논의)

//3. 구현해야 할 API 목록
//- 좋아요 버튼, 비디오 들어갔을때, 전체 비디오, 사용자별 좋아요 찜 비디오(최신 재생)


module.exports = router;









module.exports = router;
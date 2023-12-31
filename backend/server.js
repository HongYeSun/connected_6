require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const videoRoutes=require('./routes/videoRoutes');

const app = express();

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/mydb';

mongoose.set('strictQuery', false);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const cors = require('cors');
app.use(cors())
app.use(express.json());


const session = require("express-session");
const cookieParser = require('cookie-parser');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // HTTPS를 사용할 경우 true로 설정
        maxAge: 1000 * 60 * 60 * 24, // 세션 유지 기간 1일
    },
}));

const passport = require('passport');
app.use(cookieParser());
const passportConfig = require('./passport');
passportConfig();
app.use(passport.initialize());
app.use(passport.session());
const cron = require('node-cron');

const { updatePopularVideo,resetWeekAccessTimes } = require('./routes/cron');
cron.schedule('0 * * * *', async () => {
    await updatePopularVideo();
});
cron.schedule('0 0 * * 1',async()=>{
    await resetWeekAccessTimes();
})
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul'); //한국시간 설정

app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));

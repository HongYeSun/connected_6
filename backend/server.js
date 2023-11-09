const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

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

app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('./routes/user');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '615df00e6d48e3b35cac1fa8',
  };
  next();
});
app.use('/users', user);
app.use('/cards', require('./routes/card'));

app.listen(3000);
app.use((req, res) => {
  res.status(404).send({ message: 'Указан не корректный адрес' });
});

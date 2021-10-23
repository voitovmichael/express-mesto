const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const user = require('./routes/user');
const { login } = require('./controller/user');
const { createUser } = require('./controller/user');
const { auth } = require('./middlewears/auth');
const { processError } = require('./middlewears/error');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', auth, user);
app.use('/cards', auth, require('./routes/card'));

app.listen(3000);
app.use(processError);
// app.use((req, res) => {
//   res.status(404).send({ message: 'Указан не корректный адрес' });
// });

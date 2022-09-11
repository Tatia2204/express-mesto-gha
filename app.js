const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const bodyParser =  require('body-parser');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6319dca071c43262aba6c6b6'
  };
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.listen(PORT, () => {

  console.log(`App listening on port ${PORT}`)
})

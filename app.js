const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const DefaultError = require('./errors/DefaultError');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.use(errors());
app.use(DefaultError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

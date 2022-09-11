const Users = require('../models/users');

const ERROR_CODE = 400;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;

module.exports.getAllUser = (req, res) => {
  Users.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Сервер не может обработать ваш запрос' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => new Error(`Пользователь с таким _id ${req.params.userId} не найден`))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Сервер не может обработать ваш запрос' });
      }
    });
};

module.exports.getUserByIdUpdate = (req, res) => {
  const { name, about } = req.body;
  if (name && about && name.length >= 2 && name.length <= 30) {
    Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
      .orFail(() => new Error(`Пользователь с таким _id ${req.params.userId} не найден`))
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' });
        } else {
          res.status(DEFAULT_ERROR).send({ message: 'Сервер не может обработать ваш запрос' });
        }
      });
  } else {
    res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
  }
};

module.exports.getAvatarByIdUpdate = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Сервер не может обработать ваш запрос' });
      }
    });
};

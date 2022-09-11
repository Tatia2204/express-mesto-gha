const Users = require('../models/users');

const ERROR_CODE = 400;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;

module.exports.getAllUser = (req, res) => {
  Users.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: "Некорректные данные"});
        return;
      } else {
        res.status(DEFAULT_ERROR).send({message: "Сервер не может обработать ваш запрос"});
      }
    });
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR).send({message: 'Пользователь не найден'});
        return;
      } else {
        res.status(DEFAULT_ERROR).send({message: "Сервер не может обработать ваш запрос"});
      }
    })
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: "Некорректные данные"});
        return;
      } else {
        res.status(DEFAULT_ERROR).send({message: "Сервер не может обработать ваш запрос"});
      }
    });
};

module.exports.getUserByIdUpdate = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, {new: true})
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: "Некорректные данные"});
        return;
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR).send({message: 'Карточка не найдена'});
        return;
      } else {
        res.status(DEFAULT_ERROR).send({message: "Сервер не может обработать ваш запрос"});
      }
    });
};

module.exports.getAvatarByIdUpdate = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, {new: true})
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: "Некорректные данные"});
        return;
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR).send({message: 'Карточка не найдена'});
        return;
      } else {
        res.status(DEFAULT_ERROR).send({message: "Сервер не может обработать ваш запрос"});
      }
    });
};
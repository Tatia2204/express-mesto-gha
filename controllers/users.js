const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const NotFound = require('../errors/NotFoundError');
const IncorrectData = require('../errors/IncorrectDataError');
const ConflictError = require('../errors/ConflictError');

module.exports.getAllUser = (req, res, next) => {
  Users.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      const error = new Error(`Пользователь с таким _id ${req.params.userId} не найден`);
      error.statusCode = NotFound;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Некорректные данные'));
      } else if (err.statusCode === NotFound) {
        next(new NotFound({ message: err.message }));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      Users.create({ name, about, avatar, email, password: hash });
    })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectData('Некорректные данные');
      } else if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
    })
    .catch(next);
};

module.exports.getUserByIdUpdate = (req, res, next) => {
  const { name, about } = req.body;
  Users
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true, upsert: true },
    )
    .orFail(() => {
      const error = new Error(`Пользователь с таким _id ${req.params.userId} не найден`);
      error.statusCode = NotFound;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        throw new IncorrectData('Некорректные данные');
      } else if (err.statusCode === NotFound) {
        throw new NotFound({ message: err.message });
      }
    })
    .catch(next);
};

module.exports.getAvatarByIdUpdate = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error(`Пользователь с таким _id ${req.params.userId} не найден`);
      error.statusCode = NotFound;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        throw new IncorrectData('Некорректные данные');
      } else if (err.statusCode === NotFound) {
        throw new NotFound({ message: err.message });
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => {
      const error = new Error(`Пользователь не найден`);
      error.statusCode = NotFound;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectData('Некорректные данные');
      } else if (err.statusCode === NotFound) {
        throw new NotFound({ message: err.message });
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then(() => {
      const token = jwt.sign({ _id: 'd285e3dceed844f902650f40' }, 'tts', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

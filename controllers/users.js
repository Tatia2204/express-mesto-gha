const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { NotFoundError } = require('../errors/NotFoundError');
const { IncorrectDataError } = require('../errors/IncorrectDataError');
const { AuthError } = require('../errors/AuthError');
const { ConflictError } = require('../errors/ConflictError');

module.exports.getAllUser = (req, res, next) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => res.status(200).send({
          data: {
            name, about, avatar, email,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new IncorrectDataError('Некорректные данные'));
          } if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.getUserByIdUpdate = (req, res, next) => {
  const { name, about } = req.body;
  Users
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        next(new IncorrectDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getAvatarByIdUpdate = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        next(new IncorrectDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'tts',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(new AuthError(err.message));
    });
};

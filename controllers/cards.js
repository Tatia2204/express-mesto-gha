const Card = require('../models/card');
const NotFound = require('../errors/NotFoundError');
const IncorrectData = require('../errors/IncorrectDataError');
const AccessError = require('../errors/AccessError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectData('Некорректные данные');
      }
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.deleteOne({ _id: req.params.cardId })
    .orFail(() => {
      const error = new Error(`Карточка с таким _id ${req.params.cardId} не найдена`);
      error.statusCode = NotFound;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectData('Некорректные данные');
      } else if (err.statusCode === NotFound) {
        throw new NotFound({ message: err.message });
      } else {
        throw new AccessError('В доступе отказано');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error(`Карточка с таким _id ${req.params.cardId} не найдена`);
      error.statusCode = NotFound;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectData('Некорректные данные');
      } else if (err.statusCode === NotFound) {
        throw new NotFound({ message: err.message });
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error(`Карточка с таким _id ${req.params.cardId} не найдена`);
      error.statusCode = NotFound;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectData('Некорректные данные');
      } else if (err.statusCode === NotFound) {
        throw new NotFound({ message: err.message });
      }
    })
    .catch(next);
};

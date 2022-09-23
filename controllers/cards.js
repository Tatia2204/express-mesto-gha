const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { IncorrectDataError } = require('../errors/IncorrectDataError');
const { AccessError } = require('../errors/AccessError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => {
      throw new NotFoundError(`Карточка с таким _id ${req.params.cardId} не найдена`);
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new AccessError('Карточка не может быть удалена'));
      }
      return card.remove()
        .then(() => {
          res.send({ message: 'Карточка удалена' });
        });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError(`Карточка с таким _id ${req.params.cardId} не найдена`);
    })
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(`Карточка с таким _id ${req.params.cardId} не найдена`);
    })
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

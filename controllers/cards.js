const Card = require('../models/card');

const ERROR_CODE = 400;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: "Некорректные данные"});
        return;
      } else {
        res.status(DEFAULT_ERROR).send({message: "Сервер не может обработать ваш запрос"});
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: "Некорректные данные"});
        return;
      } else {
        res.status(DEFAULT_ERROR).send({message: "Сервер не может обработать ваш запрос"});
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({_id: req.params.cardId})
    .then((card) => res.send(card))
    .catch(() => res.status(NOT_FOUND_ERROR).send({message: 'Карточка не найдена'}));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}}, {new: true})
    .then((card) => res.send(card))
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
    })
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$pull: {likes: req.user._id}}, {new: true})
    .then((card) => res.send(card))
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
}
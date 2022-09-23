const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const { IncorrectDataError } = require('../errors/IncorrectDataError');

const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new IncorrectDataError('Некорректный адрес URL');
};

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validationUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.validationAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validationUrl),
  }),
});

module.exports.validationUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validationUrl),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

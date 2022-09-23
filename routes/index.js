const router = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');
const {
  validationCreateUser, validationLogin,
} = require('../middlewares/validations');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);
router.use(auth);
router.use('/users', routerUsers);
router.use('/cards', routerCards);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;

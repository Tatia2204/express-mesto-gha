const router = require('express').Router();
const {
  getAllUser, getUserById, getCurrentUser, getUserByIdUpdate, getAvatarByIdUpdate,
} = require('../controllers/users');
const {
  validationUserById, validationUserUpdate, validationAvatarUpdate,
} = require('../middlewares/validations');

router.get('/', getAllUser);
router.get('/me', getCurrentUser);
router.get('/:userId', validationUserById, getUserById);
router.patch('/me', validationUserUpdate, getUserByIdUpdate);
router.patch('/me/avatar', validationAvatarUpdate, getAvatarByIdUpdate);

module.exports = router;

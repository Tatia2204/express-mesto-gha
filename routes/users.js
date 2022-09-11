const router = require('express').Router();
const {
  getAllUser, getUserById, createUser, getUserByIdUpdate, getAvatarByIdUpdate,
} = require('../controllers/users');

router.get('/', getAllUser);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', getUserByIdUpdate);
router.patch('/me/avatar', getAvatarByIdUpdate);

module.exports = router;

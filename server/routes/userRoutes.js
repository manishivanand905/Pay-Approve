const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');
const router = express.Router();
router.use(protect, allowRoles('admin', 'finance_head', 'finance_manager'));
router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);
module.exports = router;

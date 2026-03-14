const express = require('express');
const { getApprovalRules, createApprovalRule, updateApprovalRule } = require('../controllers/approvalRuleController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(protect, allowRoles('admin'));
router.route('/').get(getApprovalRules).post(createApprovalRule);
router.route('/:id').put(updateApprovalRule);

module.exports = router;

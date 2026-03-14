const express = require('express');
const { protect, allowRoles } = require('../middlewares/authMiddleware');
const { getPayments, getPaymentMetrics, getPaymentById, createPayment, updatePayment, transitionPayment, addPaymentComment } = require('../controllers/paymentRequestController');

const router = express.Router();
router.use(protect, allowRoles('admin', 'requester', 'finance_manager', 'finance_head', 'banker'));
router.get('/summary/metrics', getPaymentMetrics);
router.route('/').get(getPayments).post(createPayment);
router.route('/:id').get(getPaymentById).put(updatePayment);
router.patch('/:id/status', transitionPayment);
router.post('/:id/comments', addPaymentComment);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getBalance, addMoney, transfer, getTransactions, getUsers } = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/balance', getBalance);
router.post('/add', addMoney);
router.post('/transfer', transfer);
router.get('/transactions', getTransactions);
router.get('/users', getUsers);

module.exports = router;

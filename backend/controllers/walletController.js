const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ balance: user.wallet_balance });
    } catch (error) {
        console.error('GetBalance Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

exports.addMoney = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' });

        const user = await User.findById(req.user.id);
        user.wallet_balance += Number(amount);
        await user.save();

        const transaction = new Transaction({
            receiver_id: user.id,
            amount,
            type: 'add_money',
            status: 'completed'
        });
        await transaction.save();

        res.json({ message: 'Money added successfully', balance: user.wallet_balance });
    } catch (error) {
        console.error('AddMoney Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

exports.transfer = async (req, res) => {
    try {
        const { receiver_email, amount } = req.body;
        if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' });

        const sender = await User.findById(req.user.id);
        const receiver = await User.findOne({ email: receiver_email });

        if (!receiver) return res.status(404).json({ message: 'Receiver not found' });
        if (sender.id === receiver.id) return res.status(400).json({ message: 'Cannot transfer to yourself' });
        if (sender.wallet_balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

        // Deduct from sender
        sender.wallet_balance -= Number(amount);
        await sender.save();

        // Add to receiver
        receiver.wallet_balance += Number(amount);
        await receiver.save();

        // Create transaction record
        const transaction = new Transaction({
            sender_id: sender.id,
            receiver_id: receiver.id,
            amount,
            type: 'transfer',
            status: 'completed'
        });
        await transaction.save();

        res.json({ message: 'Transfer successful', balance: sender.wallet_balance });
    } catch (error) {
        console.error('Transfer Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [{ sender_id: req.user.id }, { receiver_id: req.user.id }]
        })
            .populate('sender_id', 'name email')
            .populate('receiver_id', 'name email')
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('GetTransactions Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).select('name email');
        res.json(users);
    } catch (error) {
        console.error('GetUsers Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

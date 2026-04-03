const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        user = new User({ name, email, phone, password_hash });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                wallet_balance: user.wallet_balance
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password_hash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['add_money', 'transfer'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

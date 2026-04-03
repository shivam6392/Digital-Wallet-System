import { useState } from 'react';
import api from '../services/api';
import { X, Send } from 'lucide-react';

export default function TransferModal({ onClose, onSuccess }) {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/wallet/transfer', { receiver_email: email, amount: Number(amount) });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
            <div className="auth-box glass-card" style={{ position: 'relative' }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1rem', right: '1rem', background: 'none',
                    border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                }}>
                    <X size={24} />
                </button>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={20} color="var(--primary)" /> Send Money
                </h3>

                {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleTransfer}>
                    <div className="input-group">
                        <label className="input-label">Receiver Email</label>
                        <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@example.com" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Amount ($)</label>
                        <input type="number" className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="50.00" min="1" />
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Confirm Transfer'}
                    </button>
                </form>
            </div>
        </div>
    );
}

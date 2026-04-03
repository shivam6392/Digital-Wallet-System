import { useState } from 'react';
import { X, Plus, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function AddMoneyModal({ onClose, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || amount <= 0) return;
        setLoading(true);
        setError('');

        try {
            // simulated payment delay
            await new Promise(r => setTimeout(r, 1500));
            await api.post('/wallet/add', { amount: Number(amount) });
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                <div className="auth-box glass-card" style={{ textAlign: 'center' }}>
                    <CheckCircle size={64} color="var(--secondary)" style={{ margin: '0 auto 1rem', animation: 'slideUpFade 0.5s ease forwards' }} />
                    <h2>Payment Successful!</h2>
                    <p style={{ color: 'var(--text-muted)' }}>${amount} has been added to your wallet.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div className="auth-box glass-card" style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="var(--secondary)" /> Top up Wallet
                </h3>

                {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleAdd}>
                    <div className="input-group">
                        <label className="input-label">Amount ($)</label>
                        <input type="number" autoFocus className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="100.00" min="1" />
                    </div>

                    <label className="input-label" style={{ marginTop: '1.5rem' }}>Payment Method</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div
                            onClick={() => setMethod('card')}
                            style={{ padding: '1rem', border: `2px solid ${method === 'card' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center', background: method === 'card' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                            <CreditCard size={24} style={{ margin: '0 auto 0.5rem auto', color: method === 'card' ? 'var(--primary)' : 'var(--text-muted)' }} />
                            <div style={{ fontSize: '0.875rem', fontWeight: method === 'card' ? '600' : '400' }}>Credit Card</div>
                        </div>
                        <div
                            onClick={() => setMethod('upi')}
                            style={{ padding: '1rem', border: `2px solid ${method === 'upi' ? 'var(--secondary)' : 'var(--border)'}`, borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center', background: method === 'upi' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                            <Smartphone size={24} style={{ margin: '0 auto 0.5rem auto', color: method === 'upi' ? 'var(--secondary)' : 'var(--text-muted)' }} />
                            <div style={{ fontSize: '0.875rem', fontWeight: method === 'upi' ? '600' : '400' }}>UPI / Net Banking</div>
                        </div>
                    </div>

                    <button className="btn btn-secondary" type="submit" disabled={loading} style={{ background: method === 'upi' ? 'linear-gradient(135deg, var(--secondary), #34d399)' : 'linear-gradient(135deg, var(--primary), #818cf8)' }}>
                        {loading ? 'Processing Payment...' : `Pay $${amount || '0'}`}
                    </button>
                </form>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Send, WalletCards, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import api from '../services/api';
import TransferModal from '../components/TransferModal';
import AddMoneyModal from '../components/AddMoneyModal';

export default function Dashboard() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [showTransfer, setShowTransfer] = useState(false);
    const [addAmount, setAddAmount] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [balanceRes, txRes] = await Promise.all([
                api.get('/wallet/balance'),
                api.get('/wallet/transactions')
            ]);
            setBalance(balanceRes.data.balance);
            setTransactions(txRes.data);
        } catch (err) {
            if (err.response?.status === 401) handleLogout();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <WalletCards color="white" size={24} />
                    </div>
                    <h2 style={{ margin: 0 }}>Digital Wallet</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Hello, <strong>{user.name}</strong></span>
                    <button onClick={handleLogout} className="btn" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', padding: '0.5rem 1rem', width: 'auto', border: '1px solid var(--border)' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Balance Card */}
                <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(16, 185, 129, 0.1))', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.875rem' }}>Available Balance</p>
                    <h1 style={{ fontSize: '3.5rem', margin: '0 0 2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--primary)' }}>$</span>{balance.toFixed(2)}
                    </h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(true)}>
                            <Plus size={18} /> Add Money
                        </button>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowTransfer(true)}>
                            <Send size={18} /> Transfer
                        </button>
                    </div>
                </div>

                {/* Transactions list */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <Clock size={20} color="var(--secondary)" /> Recent Transactions
                    </h3>

                    {transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                                <Clock size={32} opacity={0.5} />
                            </div>
                            <p>No transactions found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {transactions.map(tx => {
                                const isReceiver = tx.receiver_id?._id === user.id || tx.receiver_id === user.id;
                                const isAddMoney = tx.type === 'add_money';

                                let title = 'Transaction';
                                let icon = null;
                                let amountColor = '';
                                let prefix = '';

                                if (isAddMoney) {
                                    title = 'Added to Wallet';
                                    icon = <Plus size={20} color="var(--secondary)" />;
                                    amountColor = 'var(--secondary)';
                                    prefix = '+';
                                } else if (isReceiver) {
                                    title = `Received from ${tx.sender_id?.name || 'Unknown'}`;
                                    icon = <ArrowDownLeft size={20} color="white" />;
                                    amountColor = 'var(--secondary)';
                                    prefix = '+';
                                } else {
                                    title = `Sent to ${tx.receiver_id?.name || 'Unknown'}`;
                                    icon = <ArrowUpRight size={20} color="white" />;
                                    amountColor = 'var(--text-main)';
                                    prefix = '-';
                                }

                                return (
                                    <div key={tx._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem', border: '1px solid var(--border)', transition: 'transform 0.2s ease' }} className="transaction-item">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isAddMoney || isReceiver ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {icon}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '500' }}>{title}</p>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(tx.createdAt)} • {tx.status}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: '600', fontSize: '1.25rem', color: amountColor }}>
                                                {prefix}${tx.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Money Modal */}
            {showAddModal && <AddMoneyModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); fetchData(); }} />}

            {showTransfer && <TransferModal onClose={() => setShowTransfer(false)} onSuccess={() => { setShowTransfer(false); fetchData(); }} />}

            <style>{`
        .transaction-item:hover {
          transform: translateX(5px);
          background: rgba(15, 23, 42, 0.6) !important;
        }
      `}</style>
        </div>
    );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, Mail, Lock, User, Phone } from 'lucide-react';
import api from '../services/api';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box glass-card">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--secondary)', padding: '0.75rem', borderRadius: '50%' }}>
                            <Wallet size={28} color="white" />
                        </div>
                    </div>
                    <h2>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Join the fastest digital wallet today</p>
                </div>

                {error && <div className="error-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" name="name" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="John Doe" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="email" name="email" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="john@example.com" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="tel" name="phone" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="+1 234 567 8900" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="password" name="password" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="Create a password" onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-secondary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Processing...' : 'Register Account'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
                    <Link to="/login" style={{ fontWeight: '600', color: 'var(--secondary)' }}>Login here</Link>
                </div>
            </div>
        </div>
    );
}

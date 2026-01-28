import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/signup', formData);
            signup(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-black/20">
                        <Zap className="w-8 h-8 text-orange-400 fill-orange-400" />
                    </div>
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">Establish Identity</h1>
                    <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Join The Era of Deterministic Authority</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                        <input
                            type="text"
                            placeholder="FULL NAME"
                            className="w-full bg-black/5 border-none p-5 pl-16 rounded-2xl font-bold text-black placeholder:text-black/20 focus:ring-2 ring-black/10 transition-all outline-none text-sm tracking-wide"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            className="w-full bg-black/5 border-none p-5 pl-16 rounded-2xl font-bold text-black placeholder:text-black/20 focus:ring-2 ring-black/10 transition-all outline-none text-sm tracking-wide"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            className="w-full bg-black/5 border-none p-5 pl-16 rounded-2xl font-bold text-black placeholder:text-black/20 focus:ring-2 ring-black/10 transition-all outline-none text-sm tracking-wide"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Initialize Account
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    <p className="text-[9px] text-center text-black/40 font-bold uppercase tracking-widest px-4 mt-2">
                        Get 10 Tokens Instantly Upon Registration.
                    </p>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-black/30 font-bold text-[10px] uppercase tracking-widest">
                        Already have an identity? {' '}
                        <Link to="/login" className="text-black hover:underline ml-1">Initiate Session</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

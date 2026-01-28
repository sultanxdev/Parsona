import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, Loader2, Linkedin } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSocialAuth = async (provider) => {
        try {
            const res = await api.get(`/auth/${provider}`);
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err) {
            setError(`${provider} Auth failed to initialize.`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
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
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">Welcome Back</h1>
                    <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Authenticate Your Brand Identity</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                                Initiate Session
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-black/5 flex-1" />
                        <span className="text-[9px] font-black text-black/20 uppercase tracking-widest whitespace-nowrap">Or Social Sync</span>
                        <div className="h-px bg-black/5 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleSocialAuth('linkedin')}
                            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/60 border border-black/5 hover:bg-black/5 transition-all text-[10px] font-black uppercase tracking-widest text-black"
                        >
                            <Linkedin className="w-4 h-4 text-[#0077b5]" />
                            LinkedIn
                        </button>
                        <button
                            onClick={() => handleSocialAuth('google')}
                            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/60 border border-black/5 hover:bg-black/5 transition-all text-[10px] font-black uppercase tracking-widest text-black"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
                                <path fill="#34A853" d="M16.04 18.013c-1.09.693-2.43 1.077-3.84 1.077-2.927 0-5.399-1.89-6.398-4.51L1.776 17.69C3.734 21.642 7.807 24.341 12.54 24.341c3.15 0 5.86-1.05 7.79-2.83l-4.29-3.498z" />
                                <path fill="#4285F4" d="M19.83 24.341c3.706 0 6.694-2.73 7.848-6.15l-4.274-3.487c-.504 1.488-1.512 2.709-2.854 3.495l4.28 3.492" />
                                <path fill="#FBBC05" d="M31.678 12c0-.853-.067-1.68-.193-2.48H16.14V14.4h8.8c-.387 2.08-1.55 3.84-3.3 5.013l4.29 3.498C28.441 20.441 31.678 17 31.678 12z" />
                            </svg>
                            Google
                        </button>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-black/30 font-bold text-[10px] uppercase tracking-widest">
                        New to Parsona? {' '}
                        <Link to="/signup" className="text-black hover:underline ml-1">Establish Identity</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

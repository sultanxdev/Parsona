import React from 'react';
import { Linkedin, Twitter, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const ConnectAccount = () => {
    const { user } = useAuth();

    const handleConnect = async (provider) => {
        try {
            const res = await api.get(`/auth/${provider}`);
            if (res.data.url) {
                console.log(`Initiating ${provider} sync with URL:`, res.data.url);
                window.location.href = res.data.url;
            }
        } catch (err) {
            console.error('Redirect Error:', err);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-4">Ingestion Nodes</h1>
                <p className="text-black/40 font-bold uppercase tracking-[0.2em] text-xs">Bridge Your Social Graph to the Parsona Engine</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                {/* LinkedIn Card */}
                <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-black/5 flex flex-col items-center text-center shadow-2xl shadow-black/5 group">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Linkedin className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase mb-2 tracking-tighter">LinkedIn</h3>
                    <p className="text-black/40 font-bold text-[10px] uppercase tracking-widest mb-10">Primary Professional Signal</p>

                    <ul className="text-left w-full space-y-4 mb-10 border-y border-black/5 py-8">
                        {['Activity Logs Ingestion', 'Post Cadence Tracking', 'Engagement Quality Index'].map((f) => (
                            <li key={f} className="flex items-center gap-3 text-[10px] font-black text-black uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                {f}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleConnect('linkedin')}
                        className="w-full bg-black text-white p-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Authorize Sync
                    </button>
                </div>

                {/* Twitter (Coming Soon) */}
                <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-black/5 flex flex-col items-center text-center shadow-2xl shadow-black/5 opacity-40 grayscale pointer-events-none">
                    <div className="w-20 h-20 bg-blue-400/10 rounded-full flex items-center justify-center mb-6">
                        <Twitter className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase mb-2 tracking-tighter">X / Twitter</h3>
                    <p className="text-black/40 font-bold text-[10px] uppercase tracking-widest mb-10">Real-time Echo Chamber</p>

                    <button className="w-full bg-black/10 text-black/30 p-6 rounded-2xl font-black uppercase tracking-widest text-xs">
                        Node Offline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectAccount;

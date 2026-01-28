import React, { useState } from 'react';
import { Zap, Sparkles, MessageSquare, ArrowUpRight, Loader2 } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const AIDirection = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState(null);

    const handleGenerate = async () => {
        if ((user?.credits || 0) < 1) {
            alert('Insufficient credits. Top up in Settings.');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/api/ai/generate');
            setStrategy(res.data.aiExplanation);
            refreshUser({ credits: res.data.credits });
        } catch (err) {
            console.error('AI Generation Failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-4">Strategic Echo</h1>
                <p className="text-black/40 font-bold uppercase tracking-[0.2em] text-xs">AI-Driven Roadmaps for Career Dominance</p>
            </header>

            <div className="max-w-4xl space-y-8">
                <div className="bg-black text-white p-12 rounded-[4rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-50">
                        <Zap className="w-32 h-32 text-orange-400 fill-orange-400 stroke-none rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/5 mb-8">
                            <Sparkles className="w-4 h-4 text-orange-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Advanced Strategy Protocol</span>
                        </div>

                        <h2 className="text-7xl font-black tracking-tighter mb-8 max-w-2xl leading-[0.9]">
                            {strategy ? "SIGNAL CALIBRATED." : "THE DELTA IS MATHEMATICAL."}
                        </h2>
                        <p className="text-white/50 text-xl font-medium max-w-xl mb-12 leading-relaxed italic">
                            {strategy ? strategy : "\"We synthesize your raw activity logs and career goals to generate the exact frequency and narrative focus required to reach the next tier of authority.\""}
                        </p>

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition shadow-2xl shadow-black/40 flex items-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    {strategy ? 'Recalibrate Strategy' : 'Generate New Strategy'}
                                    <span className="text-black/30 font-bold ml-2">(1 Credit)</span>
                                    <ArrowUpRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5">
                        <MessageSquare className="w-10 h-10 text-black mb-6" />
                        <h3 className="text-xl font-black text-black uppercase mb-4">Narrative Focus</h3>
                        <p className="text-black/40 text-sm font-bold uppercase leading-relaxed tracking-wider">
                            Real-time analysis of your content topics against industry standard authority clusters.
                        </p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5">
                        <Zap className="w-10 h-10 text-black mb-6" />
                        <h3 className="text-xl font-black text-black uppercase mb-4">Cadence Velocity</h3>
                        <p className="text-black/40 text-sm font-bold uppercase leading-relaxed tracking-wider">
                            Calculated posting frequencies to maximize engagement without signal fatigue.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIDirection;

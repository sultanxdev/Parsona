import React, { useState } from 'react';
import { Target, Save, CheckCircle, Loader2, Briefcase, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const CareerGoals = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        targetPersona: user?.goals?.targetPersona || 'FOUNDER',
        customGoal: user?.goals?.customGoal || '',
        industry: user?.goals?.industry || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const res = await api.post('/api/goals', formData);
            refreshUser({ goals: res.data.goals });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save goals:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-4">Strategic Mapping</h1>
                <p className="text-black/40 font-bold uppercase tracking-[0.2em] text-xs">Define Your Career Delta & Benchmark Targets</p>
            </header>

            <div className="grid lg:grid-cols-1 gap-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-black/5 flex flex-col gap-8 shadow-2xl shadow-black/5">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 pl-2">Primary Persona</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {['FOUNDER', 'ENGINEER', 'CREATOR', 'CONSULTANT', 'EXECUTIVE'].map((persona) => (
                                <button
                                    key={persona}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, targetPersona: persona })}
                                    className={`p-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all ${formData.targetPersona === persona
                                        ? 'bg-black text-white shadow-xl shadow-black/20'
                                        : 'bg-black/5 text-black hover:bg-black/10'
                                        }`}
                                >
                                    {persona}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 pl-2">Specific Career Milestone</label>
                        <div className="relative">
                            <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                            <input
                                type="text"
                                placeholder="E.G. SERIES A CTO, STAFF ENGINEER AT GOOGLE"
                                className="w-full bg-black/5 border-none p-5 pl-16 rounded-3xl font-bold text-black placeholder:text-black/20 focus:ring-2 ring-black/10 transition-all outline-none text-sm tracking-wide"
                                value={formData.customGoal}
                                onChange={(e) => setFormData({ ...formData, customGoal: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 pl-2">Target Industry</label>
                        <div className="relative">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                            <input
                                type="text"
                                placeholder="E.G. FINTECH, AI/ML, WEB3"
                                className="w-full bg-black/5 border-none p-5 pl-16 rounded-3xl font-bold text-black placeholder:text-black/20 focus:ring-2 ring-black/10 transition-all outline-none text-sm tracking-wide"
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                        <p className="text-[9px] font-bold text-black/30 uppercase tracking-[0.2em] max-w-[200px]">
                            Updating goals recalibrates your deterministic signal benchmarks.
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-black/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                success ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />
                            )}
                            {loading ? 'Synthesizing' : (success ? 'Saved' : 'Secure Goals')}
                        </button>
                    </div>
                </form>

                <div className="p-10 rounded-[3rem] bg-orange-400/10 border-4 border-dashed border-orange-400/20">
                    <h3 className="text-xl font-black text-black uppercase mb-4 flex items-center gap-3">
                        <Target className="w-6 h-6 text-orange-500" />
                        Why define goals?
                    </h3>
                    <p className="text-black/60 font-medium leading-relaxed mb-6">
                        "Your Brand Score is not an absolute number; it's a relative delta. A score of 80 for a 'Founder' requires drastically different activity signals than an 80 for a 'Staff Engineer'. Defining your milestone allows Gemini to calculate your specific gap."
                    </p>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/50 p-4 rounded-2xl">
                            <span className="block text-[8px] font-black text-black/40 uppercase mb-1">Impact</span>
                            <span className="font-black text-black uppercase text-[10px]">Strategy Alignment</span>
                        </div>
                        <div className="flex-1 bg-white/50 p-4 rounded-2xl">
                            <span className="block text-[8px] font-black text-black/40 uppercase mb-1">Accuracy</span>
                            <span className="font-black text-black uppercase text-[10px]">Deterministic Delta</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerGoals;

import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    ArrowUpRight,
    Linkedin,
    Coins,
    Zap
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, Cell
} from 'recharts';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/dashboard`);
            setData(res.data);
            if (res.data.credits !== undefined) {
                refreshUser({ credits: res.data.credits });
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setLoading(true);
        try {
            await api.post(`/api/ingest/sync`);
            await fetchDashboardData();
        } catch (err) {
            console.error('Sync Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) return (
        <div className="flex items-center justify-center h-96">
            <RefreshCw className="w-10 h-10 animate-spin text-black/20" />
        </div>
    );

    const radarData = data ? [
        { subject: 'Consistency', A: data.signals.consistency, B: 90, fullMark: 100 },
        { subject: 'Authority', A: data.signals.authority, B: data.gapAnalysis?.benchmarks?.minAuthorityScore || 80, fullMark: 100 },
        { subject: 'Engagement', A: data.signals.engagement, B: 80, fullMark: 100 },
    ] : [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-4">Analytics Node</h1>
                    <p className="text-black/40 font-bold uppercase tracking-[0.2em] text-[10px]">Taplio-Style Performance Insights: {user?.name}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSync}
                        className="px-6 py-4 rounded-2xl bg-black text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Sync Data
                    </button>
                    <button
                        onClick={fetchDashboardData}
                        className="p-4 rounded-2xl bg-white/40 border border-black/5 hover:bg-black/5 transition-all"
                    >
                        <RefreshCw className="w-5 h-5 text-black" />
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Growth Score', val: data?.brandScore || 0, icon: <Zap className="w-5 h-5 text-orange-400" /> },
                    { label: 'Alignment', val: `${data?.identityAlignmentScore || 0}%`, icon: <Linkedin className="w-5 h-5 text-blue-500" /> },
                    { label: 'Avg. Likes', val: data?.computedData?.engagement?.likesPerPost || 0, icon: <ArrowUpRight className="w-5 h-5 text-green-500" /> },
                    { label: 'Eng. Rate', val: `${data?.computedData?.engagement?.ratio || 0}x`, icon: <Coins className="w-5 h-5 text-purple-500" /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/5 flex flex-col items-center text-center">
                        <div className="mb-4">{stat.icon}</div>
                        <span className="text-[9px] font-black tracking-widest text-black/40 uppercase mb-2">{stat.label}</span>
                        <div className="text-4xl font-black text-black tracking-tighter">{stat.val}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Main Growth Graph */}
                <div className="lg:col-span-8 bg-white/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-black/5 shadow-2xl shadow-black/5">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h3 className="text-xl font-black text-black uppercase tracking-tighter italic">Engagement Trends</h3>
                        <div className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Last 30 Days</div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.trends || []}>
                                <defs>
                                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
                                <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 800, fill: '#00000040' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 9, fontWeight: 800, fill: '#00000040' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="likes" stroke="#fb923c" fillOpacity={1} fill="url(#colorLikes)" />
                                <Area type="monotone" dataKey="comments" stroke="#000" fillOpacity={0.1} fill="#000" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Signal Radar */}
                <div className="lg:col-span-4 bg-black text-white p-10 rounded-[3.5rem] shadow-2xl shadow-black/30 relative overflow-hidden flex flex-col justify-center">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic text-white/40 text-center">Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#ffffff10" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 900 }} />
                                <Radar
                                    name="Current"
                                    dataKey="A"
                                    stroke="#fb923c"
                                    fill="#fb923c"
                                    fillOpacity={0.6}
                                />
                                <Radar
                                    name="Target"
                                    dataKey="B"
                                    stroke="#ffffff40"
                                    fill="#ffffff10"
                                    fillOpacity={0.1}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Topic Map */}
                <div className="lg:col-span-5 bg-white/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-black/5 shadow-2xl shadow-black/5">
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter mb-8 italic">Topic Authority</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data?.computedData?.topics || []}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#000' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ background: '#000', border: 'none', borderRadius: '12px', color: '#fff' }}
                                />
                                <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                                    {(data?.computedData?.topics || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#fb923c' : '#00000020'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gap Analysis Summary */}
                <div className="lg:col-span-7 bg-white/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-black/5 shadow-2xl shadow-black/5">
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter mb-8 italic">Gap Analysis</h3>
                    <div className="space-y-4">
                        {data?.gapAnalysis?.gaps?.map((gap, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-black/5">
                                <div className={`mt-1 w-2 h-2 rounded-full ${gap.severity === 'HIGH' ? 'bg-red-500' :
                                    gap.severity === 'MEDIUM' ? 'bg-orange-500' : 'bg-blue-500'
                                    } shadow-lg shadow-current/20`} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">{gap.type} Delta</p>
                                    <p className="text-sm font-bold text-black/80">{gap.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/direction')}
                        className="w-full mt-6 py-4 rounded-2xl bg-black text-white font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Reveal AI Strategy
                    </button>
                </div>

                {/* Top Posts Section */}
                <div className="lg:col-span-12">
                    <div className="flex items-center gap-4 mb-8 px-6">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic">Top Performing Content</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {data?.topPosts?.map((post, i) => (
                            <div key={i} className="bg-white/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-black/5 shadow-xl hover:shadow-2xl transition-all group">
                                <span className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-4 block">
                                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <p className="text-sm font-bold text-black/70 mb-8 line-clamp-3 italic leading-relaxed">
                                    "{post.text}"
                                </p>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-black text-black">{post.likes}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-black/40">Likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-black text-black">{post.comments}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-black/40">Comments</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

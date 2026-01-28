import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BarChart2, CheckCircle, Shield, Menu, X, ChevronDown, Github, Twitter, Linkedin } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/10 backdrop-blur-md border-b border-black/5">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-2xl font-black tracking-tighter text-black">
                    PARSONA<span className="text-primary">.</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-8 text-sm font-bold text-black/70">
                    <a href="#features" className="hover:text-black transition">Features</a>
                    <a href="#faq" className="hover:text-black transition">FAQ</a>
                    <a href="https://github.com" className="hover:text-black transition flex items-center gap-2">
                        <Github className="w-4 h-4" /> Github
                    </a>
                </div>

                <div className="hidden md:block">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 rounded-full bg-black text-white font-bold hover:bg-black/80 transition shadow-lg shadow-black/10"
                    >
                        Login
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/90 backdrop-blur-xl border-t border-black/5 mt-4 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4 text-lg font-bold text-black">
                            <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
                            <a href="#faq" onClick={() => setIsOpen(false)}>FAQ</a>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/login');
                                }}
                                className="w-full py-3 bg-black text-white rounded-xl"
                            >
                                Login
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const Hero = () => {
    const handleConnect = async () => {
        try {
            const res = await axios.get('http://localhost:5000/auth/linkedin');
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err) {
            console.error('Login Redirect Error:', err);
        }
    };

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary uppercase tracking-[0.2em]">
                        The Authority Engine
                    </span>
                    <h1 className="mt-8 text-6xl md:text-8xl font-black text-black leading-tight tracking-tighter">
                        Own Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Influence.</span>
                    </h1>
                    <p className="mt-8 text-xl text-black/60 max-w-2xl mx-auto font-medium">
                        Stop posting blindly on LinkedIn.
                        Measure your Brand Score, define your professional persona,
                        and get clear direction on what to post — and what to avoid.
                        .
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                        <button
                            onClick={handleConnect}
                            className="px-10 py-5 bg-black text-white rounded-full font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            Connect LinkedIn
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-10 py-5 bg-white border border-black/10 text-black rounded-full font-black text-lg hover:bg-black/5 transition-all flex items-center justify-center gap-3">
                            View Demo
                        </button>
                    </div>
                </motion.div>

                {/* Dashboard Preview Overlay */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-20 max-w-5xl mx-auto relative"
                >
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full -z-10" />
                    <div className="rounded-3xl border border-black/5 bg-white/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden aspect-video relative p-4 md:p-8">
                        <div className="flex gap-4 mb-8">
                            <div className="w-3 H-3 rounded-full bg-red-400" />
                            <div className="w-3 H-3 rounded-full bg-yellow-400" />
                            <div className="w-3 H-3 rounded-full bg-green-400" />
                        </div>
                        <div className="grid grid-cols-12 gap-6 h-full opacity-60">
                            <div className="col-span-4 space-y-4">
                                <div className="h-40 rounded-2xl bg-black/5" />
                                <div className="h-40 rounded-2xl bg-black/5" />
                            </div>
                            <div className="col-span-8 rounded-2xl bg-black/5 relative flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-8xl font-black text-black/10">84</div>
                                    <div className="text-xs font-black text-black/20 uppercase tracking-widest mt-2">Authority Score</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const FAQ = () => {
    const faqs = [
        { q: "How is the Brand Score calculated?", a: "We analyze your LinkedIn activities over the last 90 days across three metrics: Consistency, Authority, and Engagement. Each is weighted according to industry benchmarks for your target persona." },
        { q: "Is my data secure?", a: "We never store your LinkedIn credentials. We only ingest public-facing activity logs to compute your deterministic signal. Your raw data is encrypted and private." },
        { q: "What is 'Deterministic Personal Branding'?", a: "It's a shift from 'aesthetic' branding to data-backed authority. Instead of guessing what to post, we show you the mathematical delta between your current output and high-performing leaders." },
    ];

    return (
        <section id="faq" className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-black text-black mb-12 text-center">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5">
                            <h3 className="text-xl font-bold text-black mb-4">{faq.q}</h3>
                            <p className="text-black/60 leading-relaxed font-medium">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="py-20 px-6 border-t border-black/5 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-2xl font-black text-black mb-6">PARSONA.</div>
                        <p className="text-black/50 max-w-sm font-medium">
                            The ultimate tool for engineers and founders to quantify their personal brand and bridge the gap to authority.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-black mb-6 uppercase tracking-widest text-xs">Product</h4>
                        <div className="flex flex-col gap-4 text-black/60 font-medium">
                            <a href="#features" className="hover:text-black">Features</a>
                            <a href="#faq" className="hover:text-black">FAQ</a>
                            <a href="#" className="hover:text-black">Pricing</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black text-black mb-6 uppercase tracking-widest text-xs">Social</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-3 bg-black text-white rounded-full hover:scale-110 transition"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="p-3 bg-black text-white rounded-full hover:scale-110 transition"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="p-3 bg-black text-white rounded-full hover:scale-110 transition"><Github className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-black/30 text-center md:text-left">
                    <p>© 2024 Parsona Analytics Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-black">Privacy Policy</a>
                        <a href="#" className="hover:text-black">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const LandingPage = () => {
    return (
        <div className="min-h-screen selection:bg-primary/20">
            <Navbar />
            <Hero />

            {/* Features Overlay */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-black" />}
                            title="Deterministic Scoring"
                            desc="No black boxes. We use immutable signal extraction to score your Authority and Consistency."
                        />
                        <FeatureCard
                            icon={<BarChart2 className="w-8 h-8 text-black" />}
                            title="Gap Analysis"
                            desc="Compare your profile against top-tier personas and see the missing mathematical delta."
                        />
                        <FeatureCard
                            icon={<CheckCircle className="w-8 h-8 text-black" />}
                            title="AI Explained"
                            desc="We use Gemini to explain exactly why your score changed, without the hallucinations."
                        />
                    </div>
                </div>
            </section>

            <FAQ />
            <Footer />
        </div>
    );
};

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-black/5 hover:border-black/10 transition-all group scale-100 hover:scale-[1.02]">
            <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-2xl font-black text-black mb-4 tracking-tight">{title}</h3>
            <p className="text-black/50 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    )
}

export default LandingPage;

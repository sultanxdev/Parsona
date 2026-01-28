import React from 'react';
import { Shield, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Settings = () => {
    const { user, logout, refreshUser } = useAuth();

    const handlePayment = async (amount) => {
        try {
            // 1. Create Order
            const orderRes = await api.post('/api/payments/order', { amount });

            const { order } = orderRes.data;

            // 2. Open Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_id',
                amount: order.amount,
                currency: order.currency,
                name: 'Parsona',
                description: 'Strategic Credit Node Top-up',
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    const verifyRes = await api.post('/api/payments/verify', {
                        orderId: order.id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        creditsToUpdate: amount / 5 // Example: 1 token per 5 INR
                    });

                    if (verifyRes.data.success) {
                        refreshUser({ credits: verifyRes.data.credits });
                        alert('Credits synchronized successfully.');
                    }
                },
                theme: { color: '#000000' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Payment Initialization Failed:', err);
            alert('Payment failed to initialize. Check console.');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-4">Node Configuration</h1>
                <p className="text-black/40 font-bold uppercase tracking-[0.2em] text-xs">Manage Your Identity & System Preferences</p>
            </header>

            <div className="max-w-3xl space-y-6">
                <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5">
                    <div className="flex items-center gap-8 mb-12">
                        <div className="w-24 h-24 rounded-[2rem] bg-black text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-black/20">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-black tracking-tighter uppercase">{user?.name}</h2>
                            <p className="text-black/30 font-bold uppercase tracking-widest text-[10px] mb-4">{user?.email}</p>
                            <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-500 font-black text-[9px] uppercase tracking-[0.2em]">Verified Identity Node</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-8 rounded-[2rem] bg-black text-white flex items-center justify-between shadow-2xl shadow-black/10">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-1">Available Resources</span>
                                <span className="text-4xl font-black">{user?.credits || 0} TOKENS</span>
                            </div>
                            <button
                                onClick={() => handlePayment(500)} // Example 500 INR
                                className="px-8 py-4 bg-orange-400 rounded-2xl font-black text-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-400/20"
                            >
                                Top Up Node
                            </button>
                        </div>

                        <button className="w-full flex items-center justify-between p-6 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors group">
                            <div className="flex items-center gap-4">
                                <Shield className="w-5 h-5 text-black/40" />
                                <span className="font-bold text-sm text-black uppercase tracking-wider">Security & API Keys</span>
                            </div>
                            <span className="text-[10px] font-black text-black/20 uppercase tracking-widest group-hover:text-black transition-colors">Configure</span>
                        </button>

                        <button className="w-full flex items-center justify-between p-6 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors group">
                            <div className="flex items-center gap-4">
                                <CreditCard className="w-5 h-5 text-black/40" />
                                <span className="font-bold text-sm text-black uppercase tracking-wider">Billing & Credits</span>
                            </div>
                            <span className="text-[10px] font-black text-black/20 uppercase tracking-widest group-hover:text-black transition-colors">Manage</span>
                        </button>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full p-8 rounded-[2.5rem] bg-red-50 text-red-500 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 border-2 border-dashed border-red-200 hover:bg-red-100 transition-all shadow-xl shadow-red-500/5 group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Terminate Connection
                </button>
            </div>
        </div>
    );
};

export default Settings;

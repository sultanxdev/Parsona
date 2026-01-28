import React from 'react';
import {
    LayoutDashboard,
    Linkedin,
    Target,
    Zap,
    Settings,
    LogOut,
    Coins,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Brand Intelligence', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'connect', label: 'Connect Account', icon: Linkedin, path: '/connect' },
        { id: 'goals', label: 'Career Goals', icon: Target, path: '/goals' },
        { id: 'direction', label: 'AI Direction', icon: Zap, path: '/direction' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="w-80 h-screen bg-white/40 backdrop-blur-3xl border-r border-black/5 flex flex-col p-8 sticky top-0 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-400 fill-orange-400" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-black uppercase">Parsona</span>
            </div>

            {/* Credit Badge */}
            <div className="mb-10 p-4 rounded-3xl bg-black text-white flex items-center justify-between shadow-2xl shadow-black/20">
                <div className="flex items-center gap-3">
                    <Coins className="w-5 h-5 text-orange-400" />
                    <span className="font-bold text-sm tracking-widest uppercase">Credits</span>
                </div>
                <span className="text-xl font-black">{user?.credits || 0}</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-black text-white shadow-xl shadow-black/10'
                                    : 'text-black/50 hover:bg-black/5 hover:text-black'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : ''}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">{item.label}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </button>
                    );
                })}
            </nav>

            {/* Profile & Logout */}
            <div className="mt-auto pt-8 border-t border-black/5 flex flex-col gap-4">
                <div className="flex items-center gap-4 p-2">
                    <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-lg">
                        {user?.name?.[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-black text-sm uppercase">{user?.name}</span>
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Premium Node</span>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm tracking-wide uppercase"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

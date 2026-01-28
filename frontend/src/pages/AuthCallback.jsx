import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const hasCalled = useRef(false);

    useEffect(() => {
        const code = searchParams.get('code');
        if (code && !hasCalled.current) {
            hasCalled.current = true;
            exchangeCodeForToken(code);
        }
    }, [searchParams]);

    const exchangeCodeForToken = async (code) => {
        try {
            // Detect provider from URL path
            const provider = window.location.pathname.includes('google') ? 'google' : 'linkedin';
            const endpoint = provider === 'google'
                ? '/auth/google/callback'
                : '/auth/linkedin/callback';

            console.log(`[Auth] Requesting token exchange for ${provider}...`);
            console.log(`[Auth] Full URL: ${api.defaults.baseURL}${endpoint}`);
            const res = await api.post(endpoint, { code });
            console.log(`[Auth] Response received:`, res.data);

            if (res.data.success) {
                login(res.data.user, res.data.token);
                navigate('/dashboard');
            } else {
                console.error(`[Auth] Exchange failed but returned 200:`, res.data);
                alert(`Authentication failed: ${res.data.error || 'Unknown error'}`);
                navigate('/login');
            }
        } catch (err) {
            console.error('Callback Error:', err.response?.data || err.message);
            alert(`Security Handshake Failed: ${err.response?.data?.error || err.message}`);
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-transparent"></div>
            <p className="mt-4 text-black font-black uppercase tracking-widest text-xs">Finalizing Security Handshake...</p>
        </div>
    );
}

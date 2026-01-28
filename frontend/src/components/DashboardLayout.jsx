import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-transparent relative z-10">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-[1400px] mx-auto p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

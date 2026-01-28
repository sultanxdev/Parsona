import React from 'react';

const Background = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#fff7ed] relative overflow-hidden">
      {/* Peachy Sunrise Glow Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(180deg, 
              rgba(255,247,237,1) 0%, 
              rgba(255,237,213,0.8) 25%, 
              rgba(254,215,170,0.6) 50%, 
              rgba(251,146,60,0.4) 75%, 
              rgba(249,115,22,0.3) 100%
            ),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(254,215,170,0.5) 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, rgba(252,165,165,0.3) 0%, transparent 45%)
          `,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;

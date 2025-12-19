import React from 'react';
import { Loader2, Zap } from 'lucide-react';
import Logo from './Logo';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full"></div>
      
      <div className="relative flex flex-col items-center animate-in zoom-in-95 duration-700">
        <Logo size="lg" className="mb-8 scale-110" />
        
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 size={40} className="text-accent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={16} className="text-highlight animate-pulse" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-accent">Initializing System</span>
            <div className="flex items-center gap-2">
               <span className="h-1 w-1 bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="h-1 w-1 bg-white/20 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="h-1 w-1 bg-white/20 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom HUD Metadata */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-20">
        <div className="text-[8px] font-mono uppercase tracking-widest text-white">
          Accessing_Encrypted_Link...<br/>
          Secure_Channel_Established
        </div>
        <div className="text-[8px] font-mono uppercase tracking-widest text-white text-right">
          Ver 2.0.1_STABLE<br/>
          Region: ME_EAST_1
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
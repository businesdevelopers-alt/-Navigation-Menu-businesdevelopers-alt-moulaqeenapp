import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Terminal } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary font-sans overflow-x-hidden selection:bg-accent/30">
      
      {/* Animation Styles */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-hero { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-40 overflow-hidden">
        {/* Technical Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-[0.05] pointer-events-none"></div>
        {/* Subtle Ambient Glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          
          {/* Status Badge */}
          <div className="flex justify-center mb-10 opacity-0 animate-hero">
             <div className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#1A1E24] hover:border-white/20 transition-colors cursor-help">
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-black border border-white/10 rounded shadow-xl text-[10px] text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform translate-y-1 group-hover:translate-y-0">
                   All systems operational
                </div>

                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                
                <span className="text-[11px] font-mono font-bold text-gray-400 tracking-wider uppercase group-hover:text-gray-300">
                   Online <span className="text-gray-600 mx-1">|</span> V2.0 Operational
                </span>
             </div>
          </div>

          {/* Headline */}
          <h1 className="opacity-0 animate-hero delay-100 text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-8 leading-[1.1] drop-shadow-sm">
            من الفكرة... <br className="hidden md:block" />
            <span className="block md:inline mt-2 md:mt-0">إلى التشغيل الفعلي</span>
          </h1>
          
          {/* Subheading */}
          <p className="opacity-0 animate-hero delay-200 text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-12 font-normal leading-loose tracking-wide">
             منصة مُلَقّن توفر محاكاة هندسية واقعية، أدوات تحكم فورية، وتصدير سيناريوهات التشغيل — لتنتقل من التجربة إلى التنفيذ بثقة تامة.
          </p>
          
          {/* Value Props */}
          <div className="opacity-0 animate-hero delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 mb-14 text-sm font-medium text-gray-300">
             {[
               "محاكاة فيزيائية واقعية",
               "تحكم مباشر (Command Palette)",
               "تصدير الكود للتنفيذ"
             ].map((text, idx) => (
               <div key={idx} className="flex items-center gap-2.5">
                  <div className="bg-accent/10 p-0.5 rounded-full flex-shrink-0">
                      <CheckCircle size={14} className="text-accent" />
                  </div>
                  <span>{text}</span>
               </div>
             ))}
          </div>

          {/* Call to Actions */}
          <div className="opacity-0 animate-hero delay-300 flex flex-col sm:flex-row gap-5 justify-center items-center mb-10 w-full sm:w-auto">
            <Link
              to="/simulator"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-accent hover:bg-accentHover rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(45,137,229,0.3)] hover:shadow-[0_0_35px_rgba(45,137,229,0.5)] hover:-translate-y-1"
            >
              <Terminal className="ml-2" size={20} />
              ابدأ المحاكاة مجانًا
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              <PlayCircle className="ml-2" size={20} />
              تصفح الدورات
            </Link>
          </div>

          {/* Trust Text */}
          <p className="opacity-0 animate-hero delay-300 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
             لا تحتاج بطاقة ائتمان — يبدأ العمل خلال ثوانٍ
          </p>
        </div>
      </section>

      {/* Stats Section / Social Proof */}
      <section className="border-y border-white/5 bg-[#0F1216] relative z-20">
         <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/5">
                {[
                  { val: "+10k", label: "جلسة محاكاة ناجحة" },
                  { val: "+500", label: "سيناريو هندسي جاهز" },
                  { val: "40%", label: "توفير في وقت التدريب" }
                ].map((stat, idx) => (
                  <div key={idx} className="px-4 py-4 md:py-2">
                     <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono tracking-tighter">{stat.val}</div>
                     <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
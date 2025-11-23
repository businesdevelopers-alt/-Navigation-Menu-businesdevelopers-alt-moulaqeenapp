
import React from 'react';
import { User, Settings, BookOpen, Award, LogOut, Cpu, Clock, Rocket, Lock, Trophy, Zap, CheckCircle } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ACHIEVEMENTS = [
  { 
      id: '1', 
      title: 'بداية الرحلة', 
      description: 'أنشأت حسابك وانضممت لمجتمع المبتكرين', 
      icon: <Rocket size={20} />, 
      unlocked: true,
      style: 'text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
  },
  { 
      id: '2', 
      title: 'مهندس مبتدئ', 
      description: 'قمت ببناء 3 مشاريع روبوتية بنجاح', 
      icon: <Cpu size={20} />, 
      unlocked: true,
      style: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
  },
  { 
      id: '3', 
      title: 'طالب مجتهد', 
      description: 'أكملت دورتك التدريبية الأولى', 
      icon: <BookOpen size={20} />, 
      unlocked: true,
      style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
  },
  { 
      id: '4', 
      title: 'أسطورة البرمجة', 
      description: 'وصلت إلى 1000 نقطة خبرة (XP)', 
      icon: <Zap size={20} />, 
      unlocked: false,
      style: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  }
];

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-primary py-12 font-['Tajawal']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / User Card */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-2xl p-6 border border-white/10 text-center shadow-xl sticky top-24">
              <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 border-2 border-accent relative">
                 <div className="text-4xl font-bold text-white">{user.name[0]}</div>
                 <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-secondary rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-6">{user.email}</p>
              
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-highlight/10 text-highlight border border-highlight/20 font-bold transition">
                  <User size={18} /> الملف الشخصي
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition">
                  <BookOpen size={18} /> دوراتي
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition">
                  <Settings size={18} /> الإعدادات
                </button>
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition mt-4">
                  <LogOut size={18} /> تسجيل الخروج
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-secondary p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-accent/50 transition group">
                  <div className="p-3 bg-accent/20 rounded-xl text-accent group-hover:scale-110 transition-transform"><BookOpen size={24} /></div>
                  <div>
                     <div className="text-2xl font-bold text-white">1</div>
                     <div className="text-xs text-gray-400">دورات مكتملة</div>
                  </div>
               </div>
               <div className="bg-secondary p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-highlight/50 transition group">
                  <div className="p-3 bg-highlight/20 rounded-xl text-highlight group-hover:scale-110 transition-transform"><Cpu size={24} /></div>
                  <div>
                     <div className="text-2xl font-bold text-white">3</div>
                     <div className="text-xs text-gray-400">مشاريع تم بناؤها</div>
                  </div>
               </div>
               <div className="bg-secondary p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-purple-500/50 transition group">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform"><Award size={24} /></div>
                  <div>
                     <div className="text-2xl font-bold text-white">150</div>
                     <div className="text-xs text-gray-400">نقاط الخبرة</div>
                  </div>
               </div>
            </div>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-accent/20 to-highlight/10 rounded-2xl p-8 border border-accent/20 relative overflow-hidden group">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">مرحباً بك، {user.name}! 🚀</h2>
                    <p className="text-gray-300 max-w-xl">
                        أنت الآن جاهز للبدء في رحلتك التعليمية. ابدأ ببناء روبوتك الأول في المحاكي أو تصفح الدورات المتاحة لتطوير مهاراتك.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link to="/simulator" className="px-6 py-2 bg-accent text-white rounded-lg font-bold hover:bg-indigo-600 transition shadow-lg hover:-translate-y-0.5">الذهاب للمحاكي</Link>
                        <Link to="/courses" className="px-6 py-2 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition">تصفح الدورات</Link>
                    </div>
                </div>
                <Cpu size={150} className="absolute -bottom-10 -left-10 text-white/5 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700" />
            </div>

            {/* Achievements Section (New) */}
            <div className="bg-secondary rounded-2xl p-8 border border-white/10">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Trophy size={22} className="text-yellow-500" />
                     الإنجازات والأوسمة
                  </h3>
                  <span className="text-xs font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full">3 / 4 مكتملة</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACHIEVEMENTS.map(badge => (
                      <div key={badge.id} className={`relative p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 group
                          ${badge.unlocked 
                              ? `${badge.style} hover:scale-[1.02]` 
                              : 'bg-primary/30 border-white/5 opacity-50 hover:opacity-70'
                          }
                      `}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 duration-500
                              ${badge.unlocked ? 'bg-secondary/50 border-current backdrop-blur' : 'bg-white/5 border-white/10'}
                          `}>
                              {badge.unlocked ? badge.icon : <Lock size={20} className="text-gray-500" />}
                          </div>
                          <div>
                              <div className="flex items-center gap-2">
                                <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.title}</h4>
                                {badge.unlocked && <CheckCircle size={14} className="text-green-500/80" />}
                              </div>
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{badge.description}</p>
                          </div>
                          
                          {/* Glow Effect for Unlocked */}
                          {badge.unlocked && (
                             <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -z-10 group-hover:bg-white/10 transition"></div>
                          )}
                      </div>
                  ))}
               </div>
            </div>

            {/* Current Progress */}
            <div className="bg-secondary rounded-2xl p-8 border border-white/10">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <Clock size={20} className="text-highlight" />
                   التقدم الحالي
               </h3>
               <div className="space-y-8">
                  <div>
                     <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                            أساسيات حركة الروبوت
                        </span>
                        <span className="text-accent font-mono">75%</span>
                     </div>
                     <div className="h-2.5 bg-primary rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-accent to-highlight w-3/4 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                     </div>
                     <div className="mt-2 text-xs text-gray-500">اخر نشاط: قبل ساعتين</div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            الرؤية الحاسوبية
                        </span>
                        <span className="text-purple-400 font-mono">30%</span>
                     </div>
                     <div className="h-2.5 bg-primary rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-purple-500 w-[30%] rounded-full"></div>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

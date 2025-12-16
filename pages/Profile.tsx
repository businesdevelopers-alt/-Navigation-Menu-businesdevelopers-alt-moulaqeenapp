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
      style: 'text-sky-400 bg-sky-900/20 border-sky-500/20'
  },
  { 
      id: '2', 
      title: 'مهندس مبتدئ', 
      description: 'قمت ببناء 3 مشاريع روبوتية بنجاح', 
      icon: <Cpu size={20} />, 
      unlocked: true,
      style: 'text-purple-400 bg-purple-900/20 border-purple-500/20'
  },
  { 
      id: '3', 
      title: 'طالب مجتهد', 
      description: 'أكملت دورتك التدريبية الأولى', 
      icon: <BookOpen size={20} />, 
      unlocked: true,
      style: 'text-emerald-400 bg-emerald-900/20 border-emerald-500/20'
  },
  { 
      id: '4', 
      title: 'أسطورة البرمجة', 
      description: 'وصلت إلى 1000 نقطة خبرة (XP)', 
      icon: <Zap size={20} />, 
      unlocked: false,
      style: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20'
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
            <div className="bg-secondary rounded-lg p-6 border border-white/10 text-center sticky top-24">
              <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center mb-4 border border-white/10 relative">
                 <div className="text-4xl font-bold text-white">{user.name[0]}</div>
                 <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-secondary rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-6">{user.email}</p>
              
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-surface text-white border border-white/10 font-bold transition">
                  <User size={18} /> الملف الشخصي
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition">
                  <BookOpen size={18} /> دوراتي
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition">
                  <Settings size={18} /> الإعدادات
                </button>
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition mt-4">
                  <LogOut size={18} /> تسجيل الخروج
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-secondary p-6 rounded-lg border border-white/10 flex items-center gap-4 hover:border-accent transition group">
                  <div className="p-3 bg-surface rounded text-accent"><BookOpen size={24} /></div>
                  <div>
                     <div className="text-2xl font-bold text-white">1</div>
                     <div className="text-xs text-gray-400">دورات مكتملة</div>
                  </div>
               </div>
               <div className="bg-secondary p-6 rounded-lg border border-white/10 flex items-center gap-4 hover:border-highlight transition group">
                  <div className="p-3 bg-surface rounded text-highlight"><Cpu size={24} /></div>
                  <div>
                     <div className="text-2xl font-bold text-white">3</div>
                     <div className="text-xs text-gray-400">مشاريع تم بناؤها</div>
                  </div>
               </div>
               <div className="bg-secondary p-6 rounded-lg border border-white/10 flex items-center gap-4 hover:border-purple-500 transition group">
                  <div className="p-3 bg-surface rounded text-purple-400"><Award size={24} /></div>
                  <div>
                     <div className="text-2xl font-bold text-white">150</div>
                     <div className="text-xs text-gray-400">نقاط الخبرة</div>
                  </div>
               </div>
            </div>

            {/* Welcome Banner - Solid */}
            <div className="bg-secondary rounded-lg p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-accent"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">مرحباً بك، {user.name}! 🚀</h2>
                    <p className="text-gray-300 max-w-xl">
                        أنت الآن جاهز للبدء في رحلتك التعليمية. ابدأ ببناء روبوتك الأول في المحاكي أو تصفح الدورات المتاحة لتطوير مهاراتك.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link to="/simulator" className="px-6 py-2 bg-accent text-white rounded font-bold hover:bg-accentHover transition border border-accent">الذهاب للمحاكي</Link>
                        <Link to="/courses" className="px-6 py-2 bg-transparent text-white rounded font-bold hover:bg-white/5 transition border border-white/20">تصفح الدورات</Link>
                    </div>
                </div>
                <Cpu size={150} className="absolute -bottom-10 -left-10 text-white/5 rotate-12 transition-transform duration-700" />
            </div>

            {/* Achievements Section */}
            <div className="bg-secondary rounded-lg p-8 border border-white/10">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Trophy size={22} className="text-yellow-500" />
                     الإنجازات والأوسمة
                  </h3>
                  <span className="text-xs font-bold text-gray-500 bg-surface px-3 py-1 rounded">3 / 4 مكتملة</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACHIEVEMENTS.map(badge => (
                      <div key={badge.id} className={`relative p-5 rounded-lg border flex items-center gap-4 transition-all duration-300 group
                          ${badge.unlocked 
                              ? `${badge.style} bg-opacity-20` 
                              : 'bg-primary border-white/5 opacity-50'
                          }
                      `}>
                          <div className={`w-12 h-12 rounded flex items-center justify-center border transition-transform
                              ${badge.unlocked ? 'bg-secondary border-current' : 'bg-white/5 border-white/10'}
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
                      </div>
                  ))}
               </div>
            </div>

            {/* Current Progress - Solid Bars */}
            <div className="bg-secondary rounded-lg p-8 border border-white/10">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <Clock size={20} className="text-highlight" />
                   التقدم الحالي
               </h3>
               <div className="space-y-8">
                  <div>
                     <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent rounded-sm"></span>
                            أساسيات حركة الروبوت
                        </span>
                        <span className="text-accent font-mono">75%</span>
                     </div>
                     <div className="h-2 bg-primary rounded-sm overflow-hidden border border-white/5">
                        <div className="h-full bg-accent w-3/4 rounded-sm"></div>
                     </div>
                     <div className="mt-2 text-xs text-gray-500">اخر نشاط: قبل ساعتين</div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-sm"></span>
                            الرؤية الحاسوبية
                        </span>
                        <span className="text-purple-400 font-mono">30%</span>
                     </div>
                     <div className="h-2 bg-primary rounded-sm overflow-hidden border border-white/5">
                        <div className="h-full bg-purple-500 w-[30%] rounded-sm"></div>
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
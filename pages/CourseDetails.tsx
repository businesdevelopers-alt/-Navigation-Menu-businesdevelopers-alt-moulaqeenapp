import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { COURSES } from './Courses';
import { ArrowRight, Clock, BookOpen, PlayCircle, Award, Check, Video, FileText, Users, Star, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const course = COURSES.find((c) => c.id === id);

  const handleEnroll = () => {
      if (!user) {
          // Store intent in state to redirect back after login? 
          // For now just simple redirect
          navigate('/login');
          return;
      }
      
      // Mock purchase logic
      alert(`شكراً لك ${user.name}! تم تسجيلك في دورة: ${course?.title} بنجاح.\n(هذه نسخة تجريبية)`);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white font-bold mb-4">الدورة غير موجودة</h2>
          <Link to="/courses" className="text-accent hover:text-white transition flex items-center justify-center gap-2">
            <ArrowRight size={20} />
            العودة للدورات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary font-sans">
      {/* Hero Header */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/80 to-primary z-10"></div>
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <img src={course.image} alt={course.title} className="w-full h-full object-cover blur-sm scale-105" />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center pt-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            
            <div className="flex justify-center gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20 backdrop-blur-md shadow-lg
                ${course.level === 'beginner' ? 'bg-emerald-600/80' : course.level === 'intermediate' ? 'bg-blue-600/80' : 'bg-red-500/80'}
                `}>
                {course.level === 'beginner' ? 'مستوى مبتدئ' : course.level === 'intermediate' ? 'مستوى متوسط' : 'مستوى متقدم'}
                </span>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20 backdrop-blur-md bg-white/10 uppercase">
                    {course.category}
                </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">{course.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8 font-light leading-relaxed">{course.description}</p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white font-medium">
              <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                 <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                 </div>
                 <span>{course.rating}</span>
                 <span className="text-gray-400 text-sm">({course.reviews} تقييم)</span>
              </div>

              <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <Clock size={18} className="text-accent" />
                <span>{course.duration}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <Users size={18} className="text-green-400" />
                <span>1,240 طالب</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-secondary rounded-2xl p-8 border border-white/5 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent"><Award size={24} /></div>
                ماذا ستتعلم؟
              </h2>
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                {[
                  'فهم أساسيات الروبوت وهيكليته الهندسية',
                  'كتابة الأكواد البرمجية والتحكم المنطقي',
                  'التعامل مع الحساسات (Sensors) والمحركات',
                  'حل المشكلات البرمجية وتصحيح الأخطاء (Debugging)',
                  'بناء مشروع كامل قابل للتشغيل من الصفر',
                  'تصدير الكود وتشغيله على قطع حقيقية'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/10 p-1 rounded-full text-green-500 border border-green-500/20">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-8 border border-white/5 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-highlight/10 rounded-lg text-highlight"><FileText size={24} /></div>
                محتوى الدورة
              </h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((lesson) => (
                  <div key={lesson} className="group flex items-center justify-between p-4 rounded-xl bg-primary border border-white/5 hover:border-accent/50 transition cursor-pointer hover:bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-accent group-hover:bg-accent/10 transition border border-white/5">
                        <Video size={18} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm group-hover:text-accent transition">الدرس {lesson}: أساسيات ومفاهيم {lesson === 1 ? 'مقدمة' : 'متقدمة'}</h3>
                        <span className="text-xs text-gray-500">15 دقيقة • فيديو عالي الدقة</span>
                      </div>
                    </div>
                    {lesson <= 2 || user ? (
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-accent group-hover:border-accent transition">
                          <PlayCircle size={16} />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-gray-600">
                          <Lock size={14} />
                        </div>
                    )}
                  </div>
                ))}
              </div>
              {!user && (
                 <div className="mt-4 text-center p-4 bg-white/5 rounded-xl border border-white/5 border-dashed">
                    <p className="text-sm text-gray-400">سجل الدخول للوصول إلى باقي الدروس</p>
                 </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-2xl border border-white/10 p-6 sticky top-24 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-highlight to-accent"></div>

              <div className="text-3xl font-extrabold text-white mb-2 mt-2">
                {course.price === 'free' ? <span className="text-emerald-400">مجاناً</span> : <span className="text-white">{course.price} ر.س</span>}
              </div>
              <p className="text-gray-400 text-xs mb-6 font-bold uppercase tracking-wider">شامل ضريبة القيمة المضافة</p>
              
              <button 
                onClick={handleEnroll}
                className={`w-full font-bold py-4 rounded-xl mb-4 transition shadow-lg flex items-center justify-center gap-2 text-base
                  ${user 
                      ? 'bg-accent hover:bg-accentHover text-white shadow-accent/20' 
                      : 'bg-highlight hover:bg-yellow-400 text-black shadow-highlight/20'
                  }
                `}
              >
                {course.price === 'free' ? 'ابدأ التعلم الآن' : user ? 'شراء الدورة' : 'سجل دخول للشراء'}
                <ArrowRight size={20} />
              </button>
              
              <div className="text-center text-[10px] text-gray-500 mb-6 flex items-center justify-center gap-2">
                 <Lock size={10} />
                 <span>دفع آمن ومشفر 100%</span>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">المستوى</span>
                  <span className="text-white font-bold bg-white/5 px-2 py-0.5 rounded text-xs">
                     {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">مدة المحتوى</span>
                  <span className="text-white font-bold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">الشهادة</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={12} /> معتمدة</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">الوصول</span>
                  <span className="text-white font-bold">مدى الحياة</span>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="mt-6 bg-secondary rounded-2xl border border-white/10 p-6 text-center">
                <h3 className="text-white font-bold mb-2">تحتاج مساعدة؟</h3>
                <p className="text-gray-400 text-xs mb-4">تواصل مع فريق الدعم الفني للإجابة على استفساراتك قبل التسجيل.</p>
                <Link to="/support" className="text-accent text-sm font-bold hover:text-white transition">تواصل معنا</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

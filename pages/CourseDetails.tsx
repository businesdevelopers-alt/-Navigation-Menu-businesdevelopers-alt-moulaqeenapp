import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { COURSES } from './Courses';
import { ArrowRight, Clock, BookOpen, PlayCircle, Award, Check, Video, FileText, Users, Star, Lock, RefreshCw, BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const course = COURSES.find((c) => c.id === id);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleEnroll = async () => {
      if (!user) {
          // Store intent in state to redirect back after login (could be implemented in auth context)
          navigate('/login');
          return;
      }
      
      setIsEnrolling(true);

      // Simulate API Call for Payment/Enrollment
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsEnrolling(false);
      setIsEnrolled(true);
      
      // Ideally, update global user state or context here
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
      <div className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/60 to-primary z-10"></div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <img src={course.image} alt={course.title} className="w-full h-full object-cover blur-[2px] scale-105" />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center pt-10">
          <div className="max-w-5xl mx-auto px-4 text-center">
            
            <div className="flex justify-center gap-3 mb-8 animate-in slide-in-from-top-4 duration-500">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20 backdrop-blur-md shadow-lg
                ${course.level === 'beginner' ? 'bg-emerald-600/80' : course.level === 'intermediate' ? 'bg-blue-600/80' : 'bg-red-500/80'}
                `}>
                {course.level === 'beginner' ? 'مستوى مبتدئ' : course.level === 'intermediate' ? 'مستوى متوسط' : 'مستوى متقدم'}
                </span>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20 backdrop-blur-md bg-white/10 uppercase tracking-widest">
                    {course.category}
                </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl animate-in zoom-in-95 duration-700">{course.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10 font-light leading-relaxed animate-in slide-in-from-bottom-2 duration-700 delay-100">{course.description}</p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white font-medium animate-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center gap-2 bg-black/40 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
                 <div className="flex text-yellow-400">
                    <Star size={18} fill="currentColor" />
                 </div>
                 <span className="font-bold text-lg">{course.rating}</span>
                 <span className="text-gray-400 text-sm">({course.reviews})</span>
              </div>

              <div className="flex items-center gap-2 bg-black/40 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <Clock size={20} className="text-accent" />
                <span>{course.duration}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-black/40 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <Users size={20} className="text-green-400" />
                <span>1,240 طالب</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Learning Outcomes */}
            <div className="bg-[#15191E] rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent"><Award size={24} /></div>
                ماذا ستتعلم في هذه الدورة؟
              </h2>
              <div className="grid sm:grid-cols-2 gap-y-5 gap-x-8 relative z-10">
                {[
                  'فهم أساسيات الروبوت وهيكليته الهندسية',
                  'كتابة الأكواد البرمجية والتحكم المنطقي',
                  'التعامل مع الحساسات (Sensors) والمحركات',
                  'حل المشكلات البرمجية وتصحيح الأخطاء (Debugging)',
                  'بناء مشروع كامل قابل للتشغيل من الصفر',
                  'تصدير الكود وتشغيله على قطع حقيقية'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="mt-1 bg-green-500/10 p-1 rounded-full text-green-500 border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-[#15191E] rounded-3xl p-8 border border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400"><FileText size={24} /></div>
                    محتوى الدورة
                  </h2>
                  <span className="text-sm text-gray-500 font-bold">{course.lessons} دروس • {course.duration}</span>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((lesson) => {
                  const isOpen = lesson <= 2 || isEnrolled;
                  return (
                  <div key={lesson} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer
                      ${isOpen 
                        ? 'bg-primary border-white/5 hover:border-accent/30 hover:bg-white/5' 
                        : 'bg-primary/50 border-white/5 opacity-70'}
                  `}>
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition border
                          ${isOpen 
                            ? 'bg-white/5 text-gray-400 border-white/5 group-hover:text-accent group-hover:bg-accent/10 group-hover:border-accent/20' 
                            : 'bg-black/20 text-gray-600 border-white/5'}
                      `}>
                        <Video size={20} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm mb-1 transition ${isOpen ? 'text-white group-hover:text-accent' : 'text-gray-500'}`}>
                           الدرس {lesson}: أساسيات ومفاهيم {lesson === 1 ? 'مقدمة' : 'متقدمة'}
                        </h3>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10} /> 15 دقيقة
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-accent group-hover:border-accent transition-all shadow-lg">
                          <PlayCircle size={20} />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-gray-600">
                          <Lock size={16} />
                        </div>
                    )}
                  </div>
                )})}
              </div>
              {!isEnrolled && !user && (
                 <div className="mt-6 text-center p-6 bg-gradient-to-r from-accent/5 to-transparent rounded-2xl border border-dashed border-accent/20">
                    <p className="text-sm text-gray-300 mb-2 font-bold">المحتوى الكامل متاح للمشتركين فقط</p>
                    <p className="text-xs text-gray-500">سجل الدخول الآن للوصول إلى كافة الدروس والاختبارات.</p>
                 </div>
              )}
            </div>

            {/* Rating System */}
             <div className="bg-[#15191E] rounded-3xl p-8 border border-white/5 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">قيم هذه الدورة</h2>
                <div className="flex flex-col items-center justify-center py-6 bg-primary/50 rounded-2xl border border-white/5">
                    <p className="text-gray-400 mb-4 text-sm">كيف كانت تجربتك التعليمية؟</p>
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setUserRating(star)}
                                className="transition-transform hover:scale-125 focus:outline-none"
                            >
                                <Star 
                                    size={32} 
                                    className={`transition-colors duration-200 ${
                                        star <= (hoverRating || userRating) 
                                            ? 'text-yellow-400 fill-yellow-400' 
                                            : 'text-gray-600'
                                    }`} 
                                />
                            </button>
                        ))}
                    </div>
                    {userRating > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 text-center">
                            <p className="text-green-400 text-sm font-bold mb-2">شكراً لتقييمك!</p>
                            <p className="text-xs text-gray-500">لقد قيمت الدورة بـ {userRating} من 5</p>
                        </div>
                    )}
                </div>
             </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#15191E] rounded-3xl border border-white/10 p-6 sticky top-24 shadow-2xl overflow-hidden group">
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-blue-400 to-accent"></div>

              {isEnrolled ? (
                  <div className="text-center py-6 animate-in zoom-in">
                      <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                          <BadgeCheck size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">أنت مشترك بالفعل</h3>
                      <p className="text-gray-400 text-xs mb-6">يمكنك متابعة التعلم من حيث توقفت.</p>
                      <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-green-900/20">
                          <PlayCircle size={20} />
                          استكمال الدورة
                      </button>
                  </div>
              ) : (
                  <>
                    <div className="text-4xl font-black text-white mb-2 mt-4 font-mono tracking-tight flex items-baseline gap-2">
                        {course.price === 'free' ? <span className="text-emerald-400">مجاناً</span> : <span className="text-white">{course.price}</span>}
                        {course.price !== 'free' && <span className="text-base font-sans font-bold text-gray-500">ر.س</span>}
                    </div>
                    <p className="text-gray-400 text-xs mb-8 font-bold uppercase tracking-wider flex items-center gap-2">
                        <Check size={12} className="text-green-500" /> شامل ضريبة القيمة المضافة
                    </p>
                    
                    <button 
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                        className={`w-full font-bold py-4 rounded-xl mb-6 transition-all shadow-xl flex items-center justify-center gap-2 text-base relative overflow-hidden
                        ${user 
                            ? 'bg-accent hover:bg-accentHover text-white shadow-accent/20 hover:scale-[1.02]' 
                            : 'bg-white hover:bg-gray-200 text-black shadow-white/10'
                        }
                        `}
                    >
                        {isEnrolling ? (
                            <>
                                <RefreshCw className="animate-spin" size={20} />
                                جاري المعالجة...
                            </>
                        ) : (
                            <>
                                {course.price === 'free' ? 'ابدأ التعلم الآن' : user ? 'شراء الدورة' : 'سجل دخول للشراء'}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    
                    <div className="text-center text-[10px] text-gray-500 mb-6 flex items-center justify-center gap-2 bg-black/20 py-2 rounded-lg border border-white/5">
                        <Lock size={10} />
                        <span>دفع آمن ومشفر 100% via Stripe</span>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">المستوى</span>
                        <span className="text-white font-bold bg-white/5 px-2 py-0.5 rounded text-xs border border-white/5">
                            {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                        </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">مدة المحتوى</span>
                        <span className="text-white font-bold">{course.duration}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">الشهادة</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={14} /> معتمدة</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">الوصول</span>
                        <span className="text-white font-bold">مدى الحياة</span>
                        </div>
                    </div>
                  </>
              )}
            </div>

            {/* Support Box */}
            <div className="mt-6 bg-[#15191E] rounded-3xl border border-white/10 p-6 text-center hover:border-accent/30 transition-colors group">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-white transition-colors">
                    <Users size={20} />
                </div>
                <h3 className="text-white font-bold mb-2">تحتاج مساعدة؟</h3>
                <p className="text-gray-400 text-xs mb-4">تواصل مع فريق الدعم الفني للإجابة على استفساراتك قبل التسجيل.</p>
                <Link to="/support" className="text-accent text-sm font-bold hover:text-white transition flex items-center justify-center gap-1">
                    تواصل معنا <ArrowRight size={14} />
                </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
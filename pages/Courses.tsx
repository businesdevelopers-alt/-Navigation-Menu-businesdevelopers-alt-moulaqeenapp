import React from 'react';
import { PlayCircle, Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { Course } from '../types';
import { Link } from 'react-router-dom';

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'أساسيات حركة الروبوت',
    description: 'تعلم كيفية التحكم في محركات الروبوت وفهم الإحداثيات والاتجاهات الأساسية.',
    level: 'beginner',
    duration: '2 ساعة',
    lessons: 5,
    image: 'https://picsum.photos/seed/robot1/400/250',
    price: 'free'
  },
  {
    id: '2',
    title: 'الرؤية الحاسوبية للروبوتات',
    description: 'دورة متقدمة حول كيفية جعل الروبوت "يرى" باستخدام كاميرات الذكاء الاصطناعي.',
    level: 'advanced',
    duration: '8 ساعات',
    lessons: 12,
    image: 'https://picsum.photos/seed/robot2/400/250',
    price: 150
  },
  {
    id: '3',
    title: 'الخوارزميات والمسارات',
    description: 'كيف تجعل الروبوت يجد طريقه في المتاهات؟ تعلم خوارزميات البحث وتجنب العقبات.',
    level: 'intermediate',
    duration: '5 ساعات',
    lessons: 8,
    image: 'https://picsum.photos/seed/robot3/400/250',
    price: 99
  },
  {
    id: '4',
    title: 'برمجة الأذرع الآلية',
    description: 'تحكم في المفاصل المتعددة للأذرع الآلية لأداء مهام دقيقة ومعقدة.',
    level: 'intermediate',
    duration: '6 ساعات',
    lessons: 10,
    image: 'https://picsum.photos/seed/robot4/400/250',
    price: 120
  }
];

const Courses: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary py-12 font-['Tajawal']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">الدورات التدريبية</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            اختر المسار الذي يناسبك وابدأ رحلتك في عالم الروبوتات. من المبادئ الأساسية وحتى الذكاء الاصطناعي المتقدم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id} className="block group h-full">
              <div className="bg-secondary rounded-lg overflow-hidden border border-white/5 hover:border-accent transition-all duration-300 flex flex-col h-full relative">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded text-xs font-bold text-white border border-white/10 z-20
                    ${course.level === 'beginner' ? 'bg-emerald-700' : course.level === 'intermediate' ? 'bg-accent' : 'bg-red-700'}
                  `}>
                    {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-6 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-1 group-hover:text-highlight transition-colors">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 group-hover:text-highlight transition-colors">
                      <BookOpen size={14} />
                      <span>{course.lessons} دروس</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <span className={`text-lg font-bold ${course.price === 'free' ? 'text-emerald-400' : 'text-highlight'}`}>
                      {course.price === 'free' ? 'مجاني' : `${course.price} ر.س`}
                    </span>
                    <div className={`flex-1 py-2 rounded text-center font-bold text-sm transition flex items-center justify-center gap-2 border border-white/10
                      ${course.price === 'free' 
                        ? 'bg-accent text-white group-hover:bg-accentHover border-accent' 
                        : 'bg-surface text-white group-hover:bg-white/10'
                      }
                    `}>
                      {course.price === 'free' ? (
                        <>
                          <PlayCircle size={16} />
                          ابدأ الآن
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          التفاصيل
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 bg-secondary rounded-lg p-10 border border-white/5 text-center relative overflow-hidden">
          {/* Grid overlay instead of gradient */}
          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">لم تجد المسار المناسب؟</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              نقوم بتحديث مكتبة الدورات أسبوعياً. اشترك في نشرتنا البريدية لتصلك أحدث الدروس فور صدورها.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="flex-1 bg-primary border border-white/10 rounded px-4 py-3 text-white focus:border-accent focus:outline-none placeholder-gray-600"
                />
                <button className="bg-accent text-white font-bold px-6 py-3 rounded hover:opacity-90 transition border border-accent flex items-center justify-center gap-2">
                  اشترك <ArrowRight size={18} />
                </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Courses;
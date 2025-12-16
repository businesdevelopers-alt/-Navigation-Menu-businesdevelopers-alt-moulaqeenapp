import React, { useState } from 'react';
import { PlayCircle, Clock, BookOpen, CheckCircle, ArrowRight, Star, Filter, Cpu, Code, Zap, Settings, Search, X } from 'lucide-react';
import { Course } from '../types';
import { Link } from 'react-router-dom';

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'أساسيات حركة الروبوت',
    description: 'تعلم كيفية التحكم في محركات الروبوت وفهم الإحداثيات والاتجاهات الأساسية باستخدام لغة C++.',
    level: 'beginner',
    duration: '2 ساعة',
    lessons: 5,
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=800',
    price: 'free',
    category: 'electronics',
    rating: 4.8,
    reviews: 1240
  },
  {
    id: '2',
    title: 'الرؤية الحاسوبية للروبوتات',
    description: 'دورة متقدمة حول كيفية جعل الروبوت "يرى" باستخدام كاميرات الذكاء الاصطناعي ومكتبة OpenCV.',
    level: 'advanced',
    duration: '8 ساعات',
    lessons: 12,
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800',
    price: 150,
    category: 'ai',
    rating: 4.9,
    reviews: 850
  },
  {
    id: '3',
    title: 'الخوارزميات والمسارات',
    description: 'كيف تجعل الروبوت يجد طريقه في المتاهات؟ تعلم خوارزميات البحث A* و Dijkstra وتجنب العقبات.',
    level: 'intermediate',
    duration: '5 ساعات',
    lessons: 8,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    price: 99,
    category: 'programming',
    rating: 4.7,
    reviews: 620
  },
  {
    id: '4',
    title: 'برمجة الأذرع الآلية',
    description: 'تحكم في المفاصل المتعددة للأذرع الآلية (Kinematics) لأداء مهام دقيقة ومعقدة في خطوط الإنتاج.',
    level: 'intermediate',
    duration: '6 ساعات',
    lessons: 10,
    image: 'https://images.unsplash.com/photo-1561144257-e1555cb6d518?auto=format&fit=crop&q=80&w=800',
    price: 120,
    category: 'mechanics',
    rating: 4.6,
    reviews: 430
  },
  {
    id: '5',
    title: 'الذكاء الاصطناعي التوليدي للروبوت',
    description: 'استخدم نماذج LLMs لتوليد أوامر الروبوت من اللغة الطبيعية وبناء مساعد ذكي.',
    level: 'advanced',
    duration: '10 ساعات',
    lessons: 15,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    price: 200,
    category: 'ai',
    rating: 5.0,
    reviews: 150
  },
  {
    id: '6',
    title: 'بايثون للروبوتات (ROS 2)',
    description: 'دورة شاملة في نظام تشغيل الروبوتات ROS 2 باستخدام بايثون، المعيار الصناعي العالمي.',
    level: 'intermediate',
    duration: '12 ساعة',
    lessons: 20,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800',
    price: 180,
    category: 'programming',
    rating: 4.8,
    reviews: 900
  }
];

const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: null },
  { id: 'programming', label: 'برمجة', icon: Code },
  { id: 'electronics', label: 'إلكترونيات', icon: Zap },
  { id: 'mechanics', label: 'ميكانيكا', icon: Settings },
  { id: 'ai', label: 'ذكاء اصطناعي', icon: Cpu },
];

const Courses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = COURSES.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-primary py-12 font-sans selection:bg-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">مسارات <span className="text-accent">التعلم</span></h1>
            <p className="text-gray-400 max-w-xl leading-relaxed">
              اختر المسار الذي يناسب شغفك. من البرمجة الأساسية إلى الذكاء الاصطناعي المتقدم، مناهجنا مصممة لتنقلك من الهواية إلى الاحتراف.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
             {/* Search */}
             <div className="relative group w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="ابحث عن دورة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary border border-white/10 rounded-xl py-3 pr-10 pl-4 text-white focus:border-accent focus:outline-none transition-all placeholder-gray-500 shadow-sm"
                />
                <Search className="absolute right-3 top-3 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
             </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2
                ${selectedCategory === cat.id 
                  ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(45,137,229,0.3)]' 
                  : 'bg-secondary text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                }
              `}
            >
              {cat.icon && <cat.icon size={16} />}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="group bg-secondary rounded-2xl border border-white/5 overflow-hidden hover:border-accent/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent z-10 opacity-90"></div>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg
                      ${course.level === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        course.level === 'intermediate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                        'bg-red-500/10 text-red-400 border-red-500/20'}
                    `}>
                      {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs font-bold text-yellow-400">
                     <Star size={12} fill="currentColor" />
                     <span>{course.rating}</span>
                     <span className="text-gray-400 font-normal ml-1">({course.reviews})</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                     {course.category === 'ai' && <Cpu size={14} className="text-purple-400" />}
                     {course.category === 'programming' && <Code size={14} className="text-blue-400" />}
                     {course.category === 'electronics' && <Zap size={14} className="text-yellow-400" />}
                     {course.category === 'mechanics' && <Settings size={14} className="text-gray-400" />}
                     <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {course.category === 'ai' ? 'ذكاء اصطناعي' : 
                         course.category === 'programming' ? 'برمجة' : 
                         course.category === 'electronics' ? 'إلكترونيات' : 'ميكانيكا'}
                     </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors leading-tight">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">{course.description}</p>
                  
                  {/* Meta Data */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-6 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-accent" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-highlight" />
                      <span>{course.lessons} دروس</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-500 uppercase font-mono">السعر</span>
                       <span className={`text-lg font-bold ${course.price === 'free' ? 'text-emerald-400' : 'text-white'}`}>
                          {course.price === 'free' ? 'مجاني' : `${course.price} ر.س`}
                       </span>
                    </div>
                    
                    <Link 
                      to={`/courses/${course.id}`}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg
                        ${course.price === 'free' 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' 
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30'
                        }
                      `}
                    >
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
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary rounded-2xl border border-dashed border-white/10">
            <Search className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">لا توجد دورات مطابقة</h3>
            <p className="text-gray-400 text-sm">جرب البحث بكلمات مختلفة أو تغيير التصنيف.</p>
            <button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} className="mt-4 text-accent hover:underline text-sm font-bold">مسح الفلاتر</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Courses;
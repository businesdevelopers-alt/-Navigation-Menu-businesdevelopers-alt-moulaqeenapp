import React, { useState } from 'react';
import { PlayCircle, Clock, BookOpen, CheckCircle, ArrowRight, Star, Filter, Cpu, Code, Zap, Settings, Search, X, Award, Signal, Anchor, Wind } from 'lucide-react';
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
  },
  {
    id: '7',
    title: 'أساسيات هندسة الدرون (Drones)',
    description: 'فهم فيزياء الطيران وكيفية برمجة وحدات التحكم للطائرات بدون طيار.',
    level: 'beginner',
    duration: '4 ساعات',
    lessons: 8,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800',
    price: 'free',
    category: 'mechanics',
    rating: 4.5,
    reviews: 320
  },
  {
    id: '8',
    title: 'تصميم الدوائر المطبوعة (PCB)',
    description: 'تعلم كيفية تصميم لوحات إلكترونية احترافية لروبوتك الخاص باستخدام KiCad.',
    level: 'intermediate',
    duration: '7 ساعات',
    lessons: 14,
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800',
    price: 85,
    category: 'electronics',
    rating: 4.7,
    reviews: 210
  },
  {
    id: '9',
    title: 'الروبوتات البحرية (Underwater)',
    description: 'بناء وبرمجة الغواصات الآلية (ROV) واستكشاف تحديات العمل تحت الماء.',
    level: 'advanced',
    duration: '9 ساعات',
    lessons: 11,
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&q=80&w=800',
    price: 160,
    category: 'mechanics',
    rating: 4.9,
    reviews: 110
  }
];

const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: Award },
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
            <p className="text-gray-400 max-w-xl leading-relaxed text-lg">
              اختر المسار الذي يناسب شغفك. من البرمجة الأساسية إلى الذكاء الاصطناعي المتقدم، مناهجنا مصممة لتنقلك من الهواية إلى الاحتراف.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
             {/* Search */}
             <div className="relative group w-full sm:w-72">
                <input 
                  type="text" 
                  placeholder="ابحث عن دورة تعليمية..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary border border-white/10 rounded-xl py-3.5 pr-11 pl-4 text-white focus:border-accent focus:outline-none transition-all placeholder-gray-500 shadow-sm"
                />
                <Search className="absolute right-4 top-3.5 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
             </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border flex items-center gap-2.5
                ${selectedCategory === cat.id 
                  ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(45,137,229,0.3)] scale-105' 
                  : 'bg-secondary text-gray-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {cat.icon && <cat.icon size={18} />}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="group bg-[#15191E] rounded-3xl border border-white/5 overflow-hidden hover:border-accent/40 hover:shadow-[0_10px_40px_-10px_rgba(45,137,229,0.15)] transition-all duration-300 flex flex-col h-full hover:-translate-y-2">
                
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] via-transparent to-transparent z-10 opacity-80"></div>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg
                      ${course.level === 'beginner' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                        course.level === 'intermediate' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                        'bg-red-500/20 text-red-400 border-red-500/30'}
                    `}>
                      {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-yellow-400 shadow-sm">
                     <Star size={12} fill="currentColor" />
                     <span>{course.rating}</span>
                     <span className="text-gray-400 font-normal ml-1">({course.reviews})</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-7 flex-1 flex flex-col relative z-20">
                  <div className="flex items-center gap-2 mb-3">
                     <div className={`p-1.5 rounded-md bg-white/5 border border-white/5
                         ${course.category === 'ai' ? 'text-purple-400' : 
                           course.category === 'programming' ? 'text-blue-400' : 
                           course.category === 'electronics' ? 'text-yellow-400' : 'text-gray-400'}
                     `}>
                        {course.category === 'ai' && <Cpu size={14} />}
                        {course.category === 'programming' && <Code size={14} />}
                        {course.category === 'electronics' && <Zap size={14} />}
                        {course.category === 'mechanics' && <Settings size={14} />}
                     </div>
                     <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {course.category === 'ai' ? 'ذكاء اصطناعي' : 
                         course.category === 'programming' ? 'برمجة' : 
                         course.category === 'electronics' ? 'إلكترونيات' : 'ميكانيكا'}
                     </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors leading-tight">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">{course.description}</p>
                  
                  {/* Meta Data */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-6 border-t border-white/5 pt-4 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-accent" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-white" />
                      <span>{course.lessons} دروس</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-500 uppercase font-mono mb-1">السعر</span>
                       <span className={`text-xl font-bold font-mono tracking-tight ${course.price === 'free' ? 'text-emerald-400' : 'text-white'}`}>
                          {course.price === 'free' ? 'مجاني' : `${course.price} ر.س`}
                       </span>
                    </div>
                    
                    <span
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all border
                        ${course.price === 'free' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white' 
                          : 'bg-white/5 text-gray-400 border-white/10 group-hover:bg-accent group-hover:text-white group-hover:border-accent'
                        }
                      `}
                    >
                      <ArrowRight size={18} className="transform group-hover:-translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-white/10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500">
               <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد دورات مطابقة</h3>
            <p className="text-gray-400 text-sm mb-6">جرب البحث بكلمات مختلفة أو تغيير التصنيف.</p>
            <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} 
                className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition border border-white/10 flex items-center gap-2"
            >
                <X size={14} /> مسح الفلاتر
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Courses;
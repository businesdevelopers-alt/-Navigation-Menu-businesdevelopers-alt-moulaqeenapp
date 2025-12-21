
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, ArrowLeft, Tag, Search, TrendingUp, 
  Hash, Flame, ChevronLeft, BookOpen, Share2, Sparkles, 
  Eye, MessageSquare, BarChart3, Newspaper, Zap, FilterX,
  RotateCcw, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
  tags?: string[];
  views: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'مستقبل الروبوتات في التعليم: كيف سيتغير الفصل الدراسي؟',
    excerpt: 'لم تعد الروبوتات مجرد خيال علمي، بل أصبحت شريكاً أساسياً في العملية التعليمية. نستعرض كيف تساهم الروبوتات في تعزيز مهارات التفكير النقدي لدى الطلاب وتغيير وجه التعليم التقليدي.',
    author: 'د. أحمد العتيبي',
    date: '10 مارس 2024',
    readTime: '5 دقائق',
    category: 'تعليم',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    tags: ['EdTech', 'Robotics', 'Future'],
    views: '2.5k',
    difficulty: 'متوسط'
  },
  {
    id: '2',
    title: 'كيف تبدأ رحلتك مع Arduino؟ دليل شامل للمبتدئين',
    excerpt: 'الأردوينو هو بوابتك الأولى لعالم الإلكترونيات. تعلم المكونات الأساسية، كيفية التوصيل، وكتابة أول كود برمجي للتحكم في الأجهزة والبيئة من حولك.',
    author: 'م. سارة محمد',
    date: '08 مارس 2024',
    readTime: '8 دقائق',
    category: 'برمجة',
    image: 'https://images.unsplash.com/photo-1555447016-173f4e195707?auto=format&fit=crop&q=80&w=800',
    tags: ['Arduino', 'C++', 'Hardware'],
    views: '4.1k',
    difficulty: 'مبتدئ'
  },
  {
    id: '3',
    title: 'الرؤية الحاسوبية ومعالجة الصور في الأنظمة المستقلة',
    excerpt: 'نوضح الفروقات الجوهرية وكيف يستخدم الروبوت كل تقنية لرؤية وفهم العالم من حوله، مع استعراض لأحدث خوارزميات التعرف على الأشياء.',
    author: 'خالد عمر',
    date: '05 مارس 2024',
    readTime: '6 دقائق',
    category: 'ذكاء اصطناعي',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800',
    tags: ['CV', 'AI', 'ImageProcessing'],
    views: '1.8k',
    difficulty: 'متقدم'
  },
  {
    id: '4',
    title: 'أفضل 5 محركات لبناء ذراع روبوتية دقيقة',
    excerpt: 'مقارنة شاملة بين محركات السيرفو، والمحركات الخطوية (Stepper)، ومحركات التيار المستمر لاختيار الأنسب لمشروعك الهندسي القادم.',
    author: 'م. فهد الزهراني',
    date: '01 مارس 2024',
    readTime: '7 دقائق',
    category: 'هاردوير',
    image: 'https://images.unsplash.com/photo-1616161560417-66d4db5892ec?auto=format&fit=crop&q=80&w=800',
    tags: ['Motors', 'RoboticArm', 'Actuators'],
    views: '3.2k',
    difficulty: 'متوسط'
  },
  {
    id: '5',
    title: 'دمج الذكاء الاصطناعي مع إنترنت الأشياء (AIoT)',
    excerpt: 'عندما يلتقي عقل الـ AI بحواس الـ IoT، نحصل على أنظمة فائقة الذكاء. اكتشف تطبيقات AIoT في المصانع الذكية والبيوت المستقبلية.',
    author: 'نورة السالم',
    date: '28 فبراير 2024',
    readTime: '4 دقائق',
    category: 'تقنية',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    tags: ['IoT', 'AI', 'SmartHome'],
    views: '1.2k',
    difficulty: 'متوسط'
  },
  {
    id: '6',
    title: 'مسابقات الروبوت العالمية: دليلك الكامل للمشاركة والفوز',
    excerpt: 'استعرض أهم المسابقات العالمية مثل First Lego League و VEX Robotics وأهم النصائح لتجهيز فريقك وبناء استراتيجية رابحة.',
    author: 'يوسف كمال',
    date: '25 فبراير 2024',
    readTime: '10 دقائق',
    category: 'مسابقات',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800',
    tags: ['Competition', 'Teamwork', 'Strategy'],
    views: '5.6k',
    difficulty: 'مبتدئ'
  }
];

const CATEGORIES = ['الكل', 'تعليم', 'برمجة', 'ذكاء اصطناعي', 'هاردوير', 'تقنية', 'مسابقات'];

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter(p => {
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find(p => p.featured);

  return (
    <div className="min-h-screen bg-primary font-sans text-slate-200 selection:bg-accent/30 overflow-x-hidden">
      
      {/* HUD Ambient Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:30px_30px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* Blog Header & Hero */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-12">
           <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                 <Newspaper size={14} className="animate-pulse" /> Mulaqqen Engineering Journal
              </div>
              <h1 className="text-6xl font-black text-white mb-4 tracking-tighter leading-none">
                مدونة <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent via-blue-400 to-indigo-500">الابتكار</span>
              </h1>
              <p className="text-gray-500 font-medium max-w-xl text-lg">أحدث المقالات التقنية، الدروس التعليمية، وأخبار عالم الروبوتات والذكاء الاصطناعي.</p>
           </div>
           
           <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative group w-full sm:w-80">
                <input 
                  type="text" 
                  placeholder="ابحث في الأرشيف..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary border border-white/10 rounded-2xl py-4 pr-14 pl-6 text-sm text-white focus:border-accent focus:bg-primary transition-all outline-none font-medium placeholder-gray-600 shadow-xl"
                />
                <Search className="absolute right-5 top-4 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
              </div>
           </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto gap-3 mb-16 pb-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3.5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-widest whitespace-nowrap border
                ${selectedCategory === cat 
                  ? 'bg-accent text-white border-accent shadow-[0_0_20px_rgba(45,137,229,0.3)]' 
                  : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Featured Section (Only show if filtering matches) */}
            {featuredPost && selectedCategory === 'الكل' && !searchQuery && (
              <Link to={`/blog/${featuredPost.id}`} className="group block relative rounded-[3rem] overflow-hidden bg-secondary border border-white/10 shadow-2xl transition-all duration-700 hover:border-accent/40">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent hidden md:block"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent md:hidden"></div>
                    <div className="absolute top-8 left-8">
                       <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase rounded-lg shadow-2xl tracking-[0.2em]">
                          Featured Article
                       </span>
                    </div>
                  </div>
                  <div className="p-10 md:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6">
                       <span className="flex items-center gap-1.5 text-accent"><Tag size={12} /> {featuredPost.category}</span>
                       <span className="flex items-center gap-1.5"><Clock size={12} /> {featuredPost.readTime}</span>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-6 leading-tight group-hover:text-accent transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8 line-clamp-3 font-light">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                             {featuredPost.author[0]}
                          </div>
                          <span className="text-sm font-bold text-gray-300">{featuredPost.author}</span>
                       </div>
                       <ArrowRight className="text-accent group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.filter(p => p.id !== (selectedCategory === 'الكل' && !searchQuery ? featuredPost?.id : '')).map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group flex flex-col bg-secondary/40 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-accent/30 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    />
                    {/* Scan Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/40 shadow-[0_0_15px_#2D89E5] animate-[scan_3s_ease-in-out_infinite]"></div>
                    </div>
                    <div className="absolute top-5 left-5">
                       <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black text-accent uppercase tracking-widest">
                          {post.category}
                       </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-4">
                       <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                       <span className="flex items-center gap-1.5"><Eye size={12} /> {post.views}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-accent transition-colors truncate-2">
                       {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
                       {post.excerpt}
                    </p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter
                             ${post.difficulty === 'مبتدئ' ? 'bg-green-500/10 text-green-400' : post.difficulty === 'متوسط' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                             {post.difficulty}
                          </span>
                       </div>
                       <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 group-hover:text-accent transition-colors">
                          اقرأ المزيد <ArrowRight size={14} />
                       </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-32 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-white/5">
                <FilterX size={64} className="mx-auto text-gray-600 mb-6" />
                <h3 className="text-2xl font-black text-white mb-2">لا توجد مقالات تطابق بحثك</h3>
                <p className="text-gray-500 mb-8">حاول استخدام كلمات مفتاحية أخرى أو تغيير التصنيف.</p>
                <button onClick={() => {setSelectedCategory('الكل'); setSearchQuery('');}} className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-xl font-black transition hover:bg-white/10 flex items-center gap-2 mx-auto">
                   <RotateCcw size={18} /> مسح الفلاتر
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* AI Highlight / Newsletter */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-accent/20 p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-colors"></div>
               <Sparkles size={32} className="text-accent mb-6 animate-pulse" />
               <h4 className="text-2xl font-black text-white mb-4 tracking-tighter">اشترك في النشرة الهندسية</h4>
               <p className="text-gray-400 text-sm leading-relaxed mb-8">احصل على ملخص أسبوعي لأهم الابتكارات الهندسية والمشاريع المفتوحة المصدر مباشرة في بريدك.</p>
               <form className="space-y-3">
                  <input type="email" placeholder="بريدك الإلكتروني..." className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:border-accent outline-none" />
                  <button className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-accent hover:text-white transition-all shadow-xl active:scale-95">انضم للفريق</button>
               </form>
            </div>

            {/* Trending Topics */}
            <div className="bg-secondary/40 p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
               <h4 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                  <Flame size={20} className="text-orange-500" /> مواضيع رائجة
               </h4>
               <div className="flex flex-wrap gap-2">
                  {['ROS2', 'Python', 'OpenCV', 'Lidar', 'Jetson', 'ESP32', 'ControlTheory', 'Mechatronics'].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-white/5 hover:bg-accent/10 hover:text-accent border border-white/5 rounded-xl text-[10px] font-mono font-bold text-gray-500 cursor-pointer transition-all">
                       #{tag}
                    </span>
                  ))}
               </div>
            </div>

            {/* Platform Stats Sidebar */}
            <div className="bg-secondary/40 p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
               <h4 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                  <BarChart3 size={20} className="text-blue-400" /> إحصائيات المعرفة
               </h4>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">مجموع القراءات</span>
                     <span className="text-sm font-mono font-black text-white">45.2K</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-accent w-3/4"></div>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">المساهمون</span>
                     <span className="text-sm font-mono font-black text-white">12 خبيراً</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">تحديثات الأسبوع</span>
                     <span className="text-sm font-mono font-black text-emerald-400">+5 مقالات</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          5% { opacity: 1; }
          45% { transform: translateY(220px); opacity: 1; }
          50% { opacity: 0; }
        }
        .truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Blog;

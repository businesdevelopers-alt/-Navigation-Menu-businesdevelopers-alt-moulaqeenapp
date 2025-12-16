import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowLeft, Tag, Search, TrendingUp, Hash, Flame, ChevronLeft } from 'lucide-react';
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
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'مستقبل الروبوتات في التعليم: كيف سيتغير الفصل الدراسي؟',
    excerpt: 'لم تعد الروبوتات مجرد خيال علمي، بل أصبحت شريكاً أساسياً في العملية التعليمية. نستعرض كيف تساهم الروبوتات في تعزيز مهارات التفكير النقدي.',
    author: 'أحمد العتيبي',
    date: '10 مارس 2024',
    readTime: '5 دقائق',
    category: 'تعليم',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    tags: ['EdTech', 'Robotics', 'Future']
  },
  {
    id: '2',
    title: 'كيف تبدأ رحلتك مع Arduino؟ دليل شامل للمبتدئين',
    excerpt: 'الأردوينو هو بوابتك الأولى لعالم الإلكترونيات. تعلم المكونات الأساسية وكيفية كتابة أول كود للتحكم في الصمام الضوئي (LED).',
    author: 'سارة محمد',
    date: '08 مارس 2024',
    readTime: '8 دقائق',
    category: 'برمجة',
    image: 'https://images.unsplash.com/photo-1555447016-173f4e195707?auto=format&fit=crop&q=80&w=800',
    tags: ['Arduino', 'C++', 'Hardware']
  },
  {
    id: '3',
    title: 'الفرق بين الرؤية الحاسوبية ومعالجة الصور',
    excerpt: 'نوضح الفروقات الجوهرية بينهما وكيف يستخدم الروبوت كل تقنية لرؤية العالم من حوله، مع أمثلة عملية.',
    author: 'خالد عمر',
    date: '05 مارس 2024',
    readTime: '6 دقائق',
    category: 'ذكاء اصطناعي',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800',
    tags: ['CV', 'AI', 'ImageProcessing']
  },
  {
    id: '4',
    title: 'أفضل 5 محركات لبناء ذراع روبوتية دقيقة',
    excerpt: 'مقارنة شاملة بين محركات السيرفو، والمحركات الخطوية (Stepper)، ومحركات التيار المستمر لاختيار الأنسب لمشروعك.',
    author: 'فهد الزهراني',
    date: '01 مارس 2024',
    readTime: '7 دقائق',
    category: 'هاردوير',
    image: 'https://images.unsplash.com/photo-1616161560417-66d4db5892ec?auto=format&fit=crop&q=80&w=800',
    tags: ['Motors', 'RoboticArm', 'Actuators']
  },
  {
    id: '5',
    title: 'دمج الذكاء الاصطناعي مع إنترنت الأشياء (AIoT)',
    excerpt: 'عندما يلتقي "عقل" الـ AI بـ "حواس" الـ IoT، نحصل على أنظمة فائقة الذكاء. اكتشف تطبيقات AIoT في المصانع الحديثة.',
    author: 'نورة السالم',
    date: '28 فبراير 2024',
    readTime: '4 دقائق',
    category: 'تقنية',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    tags: ['IoT', 'AI', 'SmartHome']
  },
  {
    id: '6',
    title: 'مسابقات الروبوت العالمية: دليلك للمشاركة',
    excerpt: 'استعرض أهم المسابقات العالمية مثل First Lego League و VEX Robotics وأهم النصائح لتجهيز فريقك للفوز.',
    author: 'يوسف كمال',
    date: '25 فبراير 2024',
    readTime: '10 دقائق',
    category: 'مسابقات',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800',
    tags: ['Competition', 'Teamwork', 'Strategy']
  },
  {
    id: '7',
    title: 'أساسيات نظام ROS 2 للمطورين',
    excerpt: 'لماذا يعتبر Robot Operating System المعيار الذهبي في الصناعة؟ وكيف تبدأ بتثبيته على جهازك.',
    author: 'أحمد العتيبي',
    date: '20 فبراير 2024',
    readTime: '12 دقيقة',
    category: 'برمجة',
    image: 'https://images.unsplash.com/photo-1535378437327-10f76365c4df?auto=format&fit=crop&q=80&w=800',
    tags: ['ROS', 'Linux', 'Python']
  },
  {
    id: '8',
    title: 'تطور الحساسات في السيارات ذاتية القيادة',
    excerpt: 'كيف تعمل حساسات LiDAR و Radar والكاميرات معاً لتوجيه السيارة؟ نظرة تقنية متعمقة.',
    author: 'سارة محمد',
    date: '15 فبراير 2024',
    readTime: '9 دقائق',
    category: 'تقنية',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    tags: ['Autonomous', 'Sensors', 'LiDAR']
  },
  {
    id: '9',
    title: 'طباعة ثلاثية الأبعاد لهياكل الروبوتات',
    excerpt: 'نصائح لتصميم وطباعة هياكل روبوت قوية وخفيفة الوزن باستخدام طابعات FDM المنزلية.',
    author: 'ماجد الحربي',
    date: '10 فبراير 2024',
    readTime: '6 دقائق',
    category: 'هاردوير',
    image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?auto=format&fit=crop&q=80&w=800',
    tags: ['3DPrinting', 'Design', 'CAD']
  }
];

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPost = BLOG_POSTS.find(p => p.featured);
  
  const filteredPosts = BLOG_POSTS.filter(p => {
      const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && !p.featured;
  });

  const categories = ['الكل', 'ذكاء اصطناعي', 'برمجة', 'هاردوير', 'تعليم', 'مسابقات', 'تقنية'];

  return (
    <div className="min-h-screen bg-primary font-sans text-gray-200 selection:bg-accent/30">
      
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-accent mb-6">
             <Hash size={12} />
             <span>MULAQQEN_BLOG_V1.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
             رؤى <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">تقنية</span> لمستقبل <br className="hidden md:block"/> الذكاء الاصطناعي
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            اكتشف أحدث المقالات، الشروحات التقنية، وأخبار عالم الروبوتات. مساحتك المعرفية للإلهام والتعلم المستمر.
          </p>
          
          <div className="max-w-md mx-auto relative group">
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="ابحث عن موضوع تقني..." 
               className="w-full bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-xl py-3.5 pr-12 pl-4 text-white focus:border-accent focus:outline-none transition-all shadow-lg group-hover:bg-secondary"
             />
             <Search className="absolute right-4 top-4 text-gray-400 group-focus-within:text-accent transition-colors" size={20} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Featured Post */}
        {featuredPost && !searchQuery && selectedCategory === 'الكل' && (
          <div className="mb-20 group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-secondary aspect-[16/9] md:aspect-[21/9] shadow-2xl shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1216] via-[#0F1216]/60 to-transparent z-10 opacity-90 transition-opacity group-hover:opacity-80"></div>
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 flex flex-col items-start">
                 <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent/90 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg shadow-accent/20 backdrop-blur-md">
                        <TrendingUp size={14} />
                        مقال مميز
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-lg backdrop-blur-md border border-white/10">
                        {featuredPost.category}
                    </span>
                 </div>
                 
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl group-hover:text-accent transition-colors drop-shadow-lg">
                    {featuredPost.title}
                 </h2>
                 <p className="text-gray-300 text-sm md:text-lg max-w-2xl mb-8 line-clamp-2 md:line-clamp-none leading-relaxed">
                    {featuredPost.excerpt}
                 </p>
                 
                 <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                       <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] text-white font-bold">
                           {featuredPost.author[0]}
                       </div>
                       {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar size={16} className="text-gray-500" />
                       {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock size={16} className="text-gray-500" />
                       {featuredPost.readTime}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-white/5 pb-8 sticky top-20 bg-primary/95 backdrop-blur-xl z-30 py-4 -mx-4 px-4 md:mx-0 md:px-0">
           {categories.map((cat, idx) => (
              <button 
                 key={idx}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border flex items-center gap-2
                    ${selectedCategory === cat
                       ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(45,137,229,0.3)]' 
                       : 'bg-secondary text-gray-400 border-white/5 hover:bg-white/5 hover:text-white hover:border-white/20'
                    }
                 `}
              >
                 {cat === 'الكل' && <Hash size={14} />}
                 {cat === 'مسابقات' && <Flame size={14} />}
                 {cat}
              </button>
           ))}
        </div>

        {/* Grid Posts */}
        {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
                <article key={post.id} className="group flex flex-col bg-[#15191E] rounded-3xl border border-white/5 overflow-hidden hover:border-accent/40 hover:shadow-[0_10px_40px_-10px_rgba(45,137,229,0.15)] transition-all duration-300 hover:-translate-y-1 h-full">
                    
                    {/* Image Area */}
                    <div className="relative h-56 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] to-transparent opacity-60 z-10"></div>
                        <div className="absolute top-4 right-4 z-20">
                            <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/10 flex items-center gap-1.5 shadow-lg">
                                <Tag size={12} className="text-accent" />
                                {post.category}
                            </span>
                        </div>
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex-1 flex flex-col relative">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 font-mono">
                            <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                            <span className="text-white/20">|</span>
                            <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                            {post.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                            {post.excerpt}
                        </p>
                        
                        {/* Tags */}
                        {post.tags && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">#{tag}</span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                            <div className="flex items-center gap-2.5 text-xs font-bold text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                                    {post.author[0]}
                                </div>
                                <span className="group-hover:text-white transition-colors">{post.author}</span>
                            </div>
                            
                            <Link to="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-accent hover:text-white flex items-center justify-center transition-all group-hover:scale-110 text-gray-400">
                                <ChevronLeft size={16} />
                            </Link>
                        </div>
                    </div>
                </article>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-secondary/50 rounded-2xl border border-dashed border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
                <p className="text-gray-400 text-sm">لم نعثر على مقالات تطابق بحثك. جرب كلمات مفتاحية أخرى.</p>
                <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('الكل');}}
                    className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition border border-white/10"
                >
                    مسح البحث
                </button>
            </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-24 relative overflow-hidden rounded-3xl border border-white/10 bg-[#15191E]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-10 p-10 md:p-16 items-center">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold mb-4 border border-green-500/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      النشرة البريدية
                   </div>
                   <h3 className="text-3xl font-bold text-white mb-4 leading-tight">ابقَ في طليعة التكنولوجيا</h3>
                   <p className="text-gray-400 leading-relaxed mb-8">
                       انضم لأكثر من 10,000 مهندس ومطور يستقبلون ملخصات أسبوعية عن أحدث تقنيات الروبوتات والذكاء الاصطناعي.
                   </p>
                   <ul className="space-y-3 mb-8">
                       {['دروس حصرية للمشتركين', 'تحديثات عن المنتجات الجديدة', 'كوبونات خصم خاصة'].map((item, i) => (
                           <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                               <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                               {item}
                           </li>
                       ))}
                   </ul>
                </div>

                <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                   <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">البريد الإلكتروني</label>
                          <input 
                             type="email" 
                             placeholder="name@example.com" 
                             className="w-full bg-[#0F1216] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-accent focus:outline-none transition-colors"
                          />
                      </div>
                      <button className="w-full bg-white text-black hover:bg-accent hover:text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2">
                         اشترك الآن <ArrowLeft size={18} />
                      </button>
                      <p className="text-[10px] text-gray-600 text-center mt-2">
                          نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
                      </p>
                   </form>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Blog;
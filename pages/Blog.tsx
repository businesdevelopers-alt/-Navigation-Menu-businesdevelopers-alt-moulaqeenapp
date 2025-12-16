import React from 'react';
import { Calendar, Clock, User, ArrowLeft, Tag, Search, TrendingUp } from 'lucide-react';
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
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'مستقبل الروبوتات في التعليم: كيف سيتغير الفصل الدراسي؟',
    excerpt: 'لم تعد الروبوتات مجرد خيال علمي، بل أصبحت شريكاً أساسياً في العملية التعليمية. نستعرض في هذا المقال كيف تساهم الروبوتات في تعزيز مهارات التفكير النقدي وحل المشكلات لدى الطلاب.',
    author: 'أحمد العتيبي',
    date: '10 مارس 2024',
    readTime: '5 دقائق',
    category: 'تعليم',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200',
    featured: true
  },
  {
    id: '2',
    title: 'كيف تبدأ رحلتك مع Arduino؟ دليل شامل للمبتدئين',
    excerpt: 'هل ترغب في دخول عالم الإلكترونيات؟ الأردوينو هو بوابتك الأولى. تعرف على المكونات الأساسية، وكيفية كتابة أول كود لك للتحكم في الصمام الضوئي (LED).',
    author: 'سارة محمد',
    date: '08 مارس 2024',
    readTime: '8 دقائق',
    category: 'برمجة',
    image: 'https://images.unsplash.com/photo-1555447016-173f4e195707?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'الفرق بين الرؤية الحاسوبية ومعالجة الصور',
    excerpt: 'مصطلحان يتداخلان كثيراً في عالم الذكاء الاصطناعي. نوضح الفروقات الجوهرية بينهما وكيف يستخدم الروبوت كل تقنية لرؤية العالم من حوله.',
    author: 'خالد عمر',
    date: '05 مارس 2024',
    readTime: '6 دقائق',
    category: 'ذكاء اصطناعي',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: 'أفضل 5 محركات لبناء ذراع روبوتية دقيقة',
    excerpt: 'اختيار المحرك الصحيح هو نصف المعركة عند بناء ذراع روبوتية. مقارنة شاملة بين محركات السيرفو، والمحركات الخطوية (Stepper)، ومحركات التيار المستمر.',
    author: 'فهد الزهراني',
    date: '01 مارس 2024',
    readTime: '7 دقائق',
    category: 'هاردوير',
    image: 'https://images.unsplash.com/photo-1616161560417-66d4db5892ec?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    title: 'دمج الذكاء الاصطناعي مع إنترنت الأشياء (AIoT)',
    excerpt: 'عندما يلتقي "عقل" الـ AI بـ "حواس" الـ IoT، نحصل على أنظمة فائقة الذكاء. اكتشف تطبيقات AIoT في المنازل الذكية والمصانع الحديثة.',
    author: 'نورة السالم',
    date: '28 فبراير 2024',
    readTime: '4 دقائق',
    category: 'تقنية',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    title: 'مسابقات الروبوت العالمية: دليلك للمشاركة والفوز',
    excerpt: 'من First Lego League إلى VEX Robotics، استعرض أهم المسابقات العالمية التي يمكن للطلاب العرب المشاركة فيها، وأهم النصائح لتجهيز فريقك.',
    author: 'يوسف كمال',
    date: '25 فبراير 2024',
    readTime: '10 دقائق',
    category: 'مسابقات',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800'
  }
];

const Blog: React.FC = () => {
  const featuredPost = BLOG_POSTS.find(p => p.featured);
  const otherPosts = BLOG_POSTS.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-primary font-sans text-gray-200">
      
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
             مدونة <span className="text-accent">المستقبل</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            اكتشف أحدث المقالات، الشروحات التقنية، وأخبار عالم الروبوتات والذكاء الاصطناعي. مساحتك المعرفية للإلهام والتعلم.
          </p>
          
          <div className="mt-8 max-w-md mx-auto relative group">
             <input 
               type="text" 
               placeholder="ابحث عن موضوع..." 
               className="w-full bg-secondary/80 backdrop-blur-md border border-white/10 rounded-full py-3 pr-12 pl-4 text-white focus:border-accent focus:outline-none transition-all shadow-lg"
             />
             <Search className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-accent transition-colors" size={20} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16 group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-secondary aspect-[21/9] md:aspect-[21/8]">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-90"></div>
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 flex flex-col items-start">
                 <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full mb-4 flex items-center gap-2">
                    <TrendingUp size={14} />
                    مقال مميز
                 </span>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl group-hover:text-accent transition-colors">
                    {featuredPost.title}
                 </h2>
                 <p className="text-gray-300 text-sm md:text-base max-w-2xl mb-6 line-clamp-2 md:line-clamp-none">
                    {featuredPost.excerpt}
                 </p>
                 
                 <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
                    <div className="flex items-center gap-2">
                       <User size={16} className="text-accent" />
                       {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar size={16} />
                       {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock size={16} />
                       {featuredPost.readTime}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-white/10 pb-6">
           {['الكل', 'ذكاء اصطناعي', 'برمجة', 'هاردوير', 'تعليم', 'أخبار'].map((cat, idx) => (
              <button 
                 key={idx}
                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border 
                    ${idx === 0 
                       ? 'bg-white/10 text-white border-white/20' 
                       : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                    }
                 `}
              >
                 {cat}
              </button>
           ))}
        </div>

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {otherPosts.map((post) => (
             <article key={post.id} className="group flex flex-col bg-secondary rounded-2xl border border-white/5 overflow-hidden hover:border-accent/50 hover:shadow-[0_10px_40px_-10px_rgba(45,137,229,0.2)] transition-all duration-300 hover:-translate-y-2">
                
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                   <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/10 flex items-center gap-1">
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

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                   </div>
                   
                   <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors leading-tight">
                      {post.title}
                   </h3>
                   
                   <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt}
                   </p>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                         <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-accent">
                            {post.author[0]}
                         </div>
                         {post.author}
                      </div>
                      
                      <Link to="#" className="text-accent text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                         اقرأ المزيد <ArrowLeft size={16} />
                      </Link>
                   </div>
                </div>
             </article>
           ))}
        </div>

        {/* Newsletter */}
        <div className="mt-20 bg-gradient-to-r from-secondary to-[#1A1E24] rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
               <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">لا تفوت جديد التقنية</h3>
               <p className="text-gray-400 mb-8">اشترك في نشرتنا البريدية لتصلك أحدث المقالات والدروس التعليمية أسبوعياً.</p>
               
               <form className="flex flex-col sm:flex-row gap-3">
                  <input 
                     type="email" 
                     placeholder="بريدك الإلكتروني" 
                     className="flex-1 bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none"
                  />
                  <button className="bg-accent hover:bg-accentHover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-accent/20">
                     اشترك الآن
                  </button>
               </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Blog;
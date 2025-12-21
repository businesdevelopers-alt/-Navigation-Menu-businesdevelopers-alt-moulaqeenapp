import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Plus, Sparkles, ArrowRight, Battery, 
  Move, Weight, Star, Cpu, Tag, Target, ArrowUpRight, 
  ShoppingCart, ShieldCheck, Box, Info, Scan, FilterX,
  RotateCcw, Fingerprint, Layers, Gauge
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import AIProductImage from '../components/AIProductImage';

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addToCart } = useCart();

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'الكل', icon: Box, count: PRODUCTS.length },
    { id: 'complete', label: 'روبوتات جاهزة', icon: Target, count: PRODUCTS.filter(p => p.category === 'complete').length },
    { id: 'kit', label: 'أطقم برمجية', icon: Cpu, count: PRODUCTS.filter(p => p.category === 'kit').length },
    { id: 'sensor', label: 'حساسات', icon: Scan, count: PRODUCTS.filter(p => p.category === 'sensor').length },
    { id: 'part', label: 'قطع غيار', icon: Plus, count: PRODUCTS.filter(p => p.category === 'part').length },
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-primary font-sans text-slate-200 selection:bg-accent/30 overflow-x-hidden">
      
      {/* HUD Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:40px_40px]"></div>
      </div>

      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent/10 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-highlight/5 blur-[140px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-3/5 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in shadow-[0_0_20px_rgba(45,137,229,0.15)]">
                <ShieldCheck size={14} />
                <span>Mulaqqen Hardware Procurement</span>
              </div>
              <h1 className="text-6xl md:text-[5.5rem] font-black text-white mb-8 leading-[0.95] tracking-tighter">
                مستقبل <br/> <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent via-blue-400 to-indigo-500">الأتمتة</span> بين يديك
              </h1>
              <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl lg:mr-0 mx-auto leading-relaxed font-light">
                منصتكم المعتمدة للحصول على المكونات الروبوتية المختبرة صناعياً. جاهزية كاملة للمشاريع التعليمية والمهنية.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <Link to="/build" className="group px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-accent hover:text-white transition-all flex items-center gap-3 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.15)] active:scale-95">
                  تخصيص نظام فريد
                  <ArrowUpRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <div className="px-10 py-5 bg-secondary/50 border border-white/10 rounded-2xl text-gray-300 font-bold backdrop-blur-md border-r-4 border-r-accent">
                   مخزون محدث: {PRODUCTS.length} وحدة
                </div>
              </div>
            </div>
            <div className="lg:w-2/5 relative hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-colors duration-1000"></div>
                <img 
                  src="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=800" 
                  alt="Industrial Robot" 
                  className="relative z-10 w-full max-w-md mx-auto drop-shadow-[0_0_60px_rgba(45,137,229,0.3)] animate-float scale-110"
                />
                <div className="absolute -top-10 -right-10 w-32 h-32 border-t-2 border-r-2 border-accent/30 rounded-tr-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 border-b-2 border-l-2 border-accent/30 rounded-bl-3xl animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Toolbar */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-40 mb-20">
        <div className="bg-[#15191E]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide px-2">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
                className={`group flex items-center gap-3 px-6 py-3.5 rounded-xl text-xs font-black transition-all whitespace-nowrap border relative
                  ${selectedCategory === cat.id 
                    ? 'border-accent text-white bg-accent/10 shadow-[0_0_20px_rgba(45,137,229,0.2)]' 
                    : 'bg-primary/50 text-gray-500 border-white/5 hover:border-white/20 hover:text-white'}`}
              >
                <cat.icon size={16} className={selectedCategory === cat.id ? 'text-accent' : 'text-gray-600 group-hover:text-accent transition-colors'} />
                
                <span className="flex items-center gap-2">
                  {cat.label}
                  {selectedCategory === cat.id && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_8px_#2D89E5]"></span>
                    </span>
                  )}
                </span>

                <span className={`mr-1 px-1.5 py-0.5 rounded text-[9px] font-mono
                  ${selectedCategory === cat.id ? 'bg-accent text-white' : 'bg-white/5 text-gray-600 group-hover:text-gray-400'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-[400px] group">
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
              <Search className="text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="ابحث عن المكون (اسم الموديل أو الفئة)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-primary/80 border border-white/10 rounded-2xl py-4 pr-14 pl-6 text-sm text-white focus:border-accent focus:bg-primary transition-all outline-none font-medium placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Technical Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative flex flex-col h-full bg-[#121519] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-accent/30 hover:-translate-y-3"
              >
                {/* 1. Visual Presentation Unit */}
                <div className="relative aspect-[4/3] overflow-hidden p-4">
                  <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-black/60 border border-white/10 group-hover:border-accent/20 transition-colors">
                    {/* Background Tech Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`pattern-${product.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#pattern-${product.id})`} />
                      </svg>
                    </div>

                    <AIProductImage 
                      src={product.image} 
                      alt={product.name} 
                      description={product.description}
                      className="w-full h-full object-contain p-8 transition-transform duration-[1.5s] group-hover:scale-110 group-hover:rotate-1" 
                    />
                    
                    {/* Status Overlays */}
                    <div className="absolute top-5 left-5 z-20">
                      <div className="px-3 py-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl text-[9px] font-mono text-accent font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                        REF: {product.id.split('-').pop() || product.id}
                      </div>
                    </div>

                    <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-2">
                      {product.status === 'pre_order' && (
                        <div className="px-4 py-1.5 bg-highlight text-black text-[10px] font-black uppercase rounded-lg shadow-2xl flex items-center gap-2">
                          <Gauge size={12} />
                          High Demand
                        </div>
                      )}
                      <div className="px-3 py-1 bg-white/5 backdrop-blur-md text-white/40 text-[8px] font-black uppercase rounded-md border border-white/5">
                        Hardware Unit_v2.0
                      </div>
                    </div>

                    {/* Scan Animation On Hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/40 shadow-[0_0_15px_#2D89E5] animate-[scan_3s_ease-in-out_infinite]"></div>
                    </div>
                  </div>

                  {/* Quick Access Action */}
                  <button 
                    onClick={(e) => { e.preventDefault(); addToCart(product); }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-accent hover:text-white hover:rotate-12 active:scale-90"
                    title="Add to Procurement"
                  >
                    <Plus size={28} strokeWidth={3} />
                  </button>
                </div>

                {/* 2. Data Interface Area */}
                <div className="px-8 pb-10 pt-4 flex flex-col flex-1 relative">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-2.5 py-1 bg-accent/10 border border-accent/20 rounded-md text-[9px] font-black text-accent uppercase tracking-widest">
                       {product.category === 'complete' ? 'System Unit' : 'Modular Logic'}
                    </span>
                    <div className="flex gap-0.5 text-highlight">
                       {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} className={i >= 4 ? "opacity-20" : ""} />)}
                    </div>
                  </div>

                  <Link to={`/store/product/${product.id}`} className="block mb-3 group/title">
                    <h3 className="text-3xl font-black text-white group-hover/title:text-accent transition-colors leading-[1.1] tracking-tighter uppercase truncate">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-2 h-10 mb-10 opacity-80">
                    {product.description}
                  </p>

                  {/* Dynamic Hardware Specs HUD */}
                  <div className="grid grid-cols-3 gap-2 mb-10">
                    {[
                      { icon: Battery, val: product.specs?.battery || '---', label: 'PWR', color: 'text-green-500' },
                      { icon: Move, val: product.specs?.speed || '---', label: 'VEL', color: 'text-blue-500' },
                      { icon: Gauge, val: product.specs?.payload || product.specs?.weight || '---', label: 'LD', color: 'text-orange-500' }
                    ].map((spec, i) => (
                      <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center group/spec hover:bg-white/5 transition-colors">
                        <spec.icon size={14} className={`${spec.color} mb-2 opacity-60 group-hover/spec:opacity-100 transition-opacity`} />
                        <span className="text-[11px] text-white font-mono font-black tracking-tighter">{spec.val}</span>
                        <span className="text-[7px] text-gray-600 font-bold uppercase mt-1 tracking-[0.2em]">{spec.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* 3. Transaction Hub */}
                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-600 font-black uppercase mb-1 tracking-[0.3em]">Value_Index</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-black text-white font-mono tracking-tighter">{product.price}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SAR</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      className="group/btn relative px-8 py-4 bg-white text-black hover:bg-accent hover:text-white rounded-2xl font-black text-[11px] uppercase transition-all shadow-xl active:scale-95 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                         Procure Unit
                         <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      {/* Button Hover Shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-32 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-white/5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,137,229,0.02)_0%,transparent_70%)]"></div>
            <div className="w-24 h-24 bg-primary/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 text-gray-500 relative z-10">
              <Search size={48} className="opacity-20 absolute" />
              <FilterX size={40} className="text-accent" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 relative z-10">لا توجد منتجات مطابقة</h3>
            <p className="text-gray-400 text-lg font-light mb-10 max-w-md mx-auto relative z-10 leading-relaxed px-6">
              لم نتمكن من العثور على أي عتاد يطابق معايير البحث الحالية. يمكنك محاولة تغيير الفئة المختارة أو مسح كلمات البحث للعودة للمجموعة الكاملة.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button 
                onClick={clearFilters}
                className="px-10 py-4 bg-accent text-white hover:bg-accentHover rounded-2xl font-black transition-all shadow-xl shadow-accent/20 active:scale-95 flex items-center gap-2"
              >
                <RotateCcw size={18} />
                مسح جميع الفلاتر
              </button>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/10 active:scale-95"
              >
                مسح كلمة البحث فقط
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(1deg); }
        }
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          5% { opacity: 1; }
          45% { transform: translateY(220px); opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Store;

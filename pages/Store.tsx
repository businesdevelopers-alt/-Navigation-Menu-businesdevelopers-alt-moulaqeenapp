import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Plus, Sparkles, ArrowRight, Battery, 
  Move, Weight, Star, Cpu, Tag, Target, ArrowUpRight, 
  ShoppingCart, ShieldCheck, Box, Info, Scan
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
                className={`group flex items-center gap-3 px-6 py-3.5 rounded-xl text-xs font-black transition-all whitespace-nowrap border relative
                  ${selectedCategory === cat.id 
                    ? 'border-accent text-white bg-accent/10 shadow-[0_0_20px_rgba(45,137,229,0.2)]' 
                    : 'bg-primary/50 text-gray-500 border-white/5 hover:border-white/20 hover:text-white'}`}
              >
                <cat.icon size={16} className={selectedCategory === cat.id ? 'text-accent' : 'text-gray-600 group-hover:text-accent transition-colors'} />
                
                <span className="flex items-center gap-2">
                  {cat.label}
                  {selectedCategory === cat.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#2D89E5]"></span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((product, idx) => (
            <div 
              key={product.id} 
              className="group relative flex flex-col h-full bg-secondary/40 backdrop-blur-sm rounded-[2.5rem] border border-white/10 overflow-hidden transition-all duration-500 hover:border-accent/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(45,137,229,0.15)]"
            >
              {/* Product Header / Hardware Preview */}
              <div className="relative aspect-[5/4] overflow-hidden p-5">
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-black/40 border border-white/5">
                  <AIProductImage 
                    src={product.image} 
                    alt={product.name} 
                    description={product.description}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" 
                  />
                  
                  {/* Glass Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-[9px] font-mono text-accent uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_#2D89E5]"></div>
                      {product.id.toUpperCase()}
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
                    {product.status === 'pre_order' && (
                      <span className="px-4 py-2 bg-highlight/90 backdrop-blur-md text-black text-[10px] font-black uppercase rounded-xl shadow-2xl flex items-center gap-2">
                        <Info size={12} />
                        PRE-ORDER
                      </span>
                    )}
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-black uppercase rounded-xl border border-white/10 flex items-center gap-2">
                      {product.category === 'complete' ? 'System Unit' : 'Logic Module'}
                    </span>
                  </div>

                  {/* Scanline Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Floating Cart Trigger */}
                <button 
                  onClick={(e) => { e.preventDefault(); addToCart(product); }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-accent hover:text-white active:scale-90"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={28} />
                </button>
              </div>

              {/* Data Section */}
              <div className="px-8 pb-8 pt-2 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-highlight gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} className={i >= 4 ? "text-white/10" : ""} />)}
                  </div>
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">Certified Grade A</span>
                </div>

                <Link to={`/store/product/${product.id}`} className="block mb-3 group/title">
                  <h3 className="text-2xl font-black text-white group-hover/title:text-accent transition-colors leading-tight tracking-tight truncate">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-2 h-10 mb-8 border-r-2 border-accent/20 pr-4">
                  {product.description}
                </p>

                {/* Hardware Spec HUD - Modernized */}
                {product.specs ? (
                  <div className="grid grid-cols-3 gap-3 mb-10">
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-white/5 hover:border-accent/20 group/spec">
                      <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Battery size={14} className="text-green-500" />
                      </div>
                      <span className="text-[10px] text-white font-mono font-black">{product.specs.battery}</span>
                      <span className="text-[8px] text-gray-600 font-bold uppercase mt-1">CAP</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-white/5 hover:border-accent/20 group/spec">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Move size={14} className="text-blue-500" />
                      </div>
                      <span className="text-[10px] text-white font-mono font-black">{product.specs.speed}</span>
                      <span className="text-[8px] text-gray-600 font-bold uppercase mt-1">VEL</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-white/5 hover:border-accent/20 group/spec">
                      <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Weight size={14} className="text-orange-500" />
                      </div>
                      <span className="text-[10px] text-white font-mono font-black">{product.specs.payload || product.specs.weight}</span>
                      <span className="text-[8px] text-gray-600 font-bold uppercase mt-1">LOAD</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-[78px] mb-10 bg-black/20 border border-dashed border-white/5 rounded-[1.5rem] flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <Cpu size={18} className="text-gray-700 animate-pulse" />
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Logic Extension</span>
                    </div>
                  </div>
                )}

                {/* Footer / CTA */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-gray-600 font-black uppercase mb-1 tracking-widest">Procurement</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-highlight font-mono tracking-tighter leading-none">{product.price}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">SAR</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-3 px-6 py-3.5 bg-white text-black hover:bg-accent hover:text-white rounded-2xl font-black text-xs transition-all shadow-[0_10px_25px_-5px_rgba(255,255,255,0.1)] active:scale-95 group/buy border-b-4 border-black/10"
                  >
                    <span>طلب وحدة</span>
                    <Plus size={18} className="transition-transform group-hover/buy:rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Error / No Results State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-secondary/20 rounded-[3rem] border border-dashed border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.02)_0%,transparent_70%)]"></div>
            <div className="w-24 h-24 bg-primary/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 text-gray-700 relative z-10">
              <Search size={48} />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 relative z-10">فشل في تحديد المواقع</h3>
            <p className="text-gray-400 text-lg font-light mb-10 max-w-md mx-auto relative z-10">
              لم نتمكن من العثور على أي عتاد يطابق معايير البحث الحالية. يرجى مراجعة نظام الفلترة.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}
              className="relative z-10 px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/10 active:scale-95"
            >
              إعادة تهيئة المسح الضوئي
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(1deg); }
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
import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, X, DollarSign, Eye, Check, Zap, Cpu, Settings, Star, ArrowRight, Package, Heart, ImageOff, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800";

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<('kit' | 'sensor' | 'part')[]>([]);
  
  // Custom Price Filter State
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc'>('relevance');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart, cartCount } = useCart();
  
  // Image Loading State
  const [loadedImages, setLoadedImages] = useState<{[key:string]: boolean}>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({...prev, [id]: true}));
  };

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    // Custom Price Logic
    const min = minPrice !== '' ? Number(minPrice) : 0;
    const max = maxPrice !== '' ? Number(maxPrice) : Infinity;
    const matchesPrice = product.price >= min && product.price <= max;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0; // relevance/default
  });

  const categories = [
    { id: 'kit', label: 'أطقم تعليمية', icon: Cpu, color: 'text-purple-400' },
    { id: 'sensor', label: 'مستشعرات', icon: Zap, color: 'text-cyan-400' },
    { id: 'part', label: 'قطع غيار', icon: Settings, color: 'text-orange-400' },
  ];

  const toggleCategory = (id: 'kit' | 'sensor' | 'part') => {
      setSelectedCategories(prev => 
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      );
  };

  const clearFilters = () => {
      setSearchTerm(''); 
      setSelectedCategories([]); 
      setMinPrice('');
      setMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-primary py-12 font-sans text-slate-200 selection:bg-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pb-8 border-b border-white/5">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">المتجر <span className="text-accent">التقني</span></h1>
            <p className="text-gray-400 font-light max-w-md leading-relaxed">
              تصفح أحدث المعدات الروبوتية. قطع عالية الجودة مختارة بعناية لضمان نجاح مشاريعك الهندسية.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
             <div className="w-full sm:w-40">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-secondary border border-white/10 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-accent cursor-pointer appearance-none hover:bg-white/5 transition shadow-sm font-bold"
                  >
                      <option value="relevance">ترتيب مقترح</option>
                      <option value="price_asc">الأقل سعراً</option>
                      <option value="price_desc">الأعلى سعراً</option>
                  </select>
             </div>

            <div className="relative w-full sm:w-64 group">
                <input 
                    type="text" 
                    placeholder="ابحث عن قطعة..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-secondary border border-white/10 rounded-lg py-3 pr-10 pl-10 text-white focus:border-accent focus:outline-none text-sm transition-all placeholder-gray-500 shadow-sm group-hover:border-white/20"
                />
                <Search className="absolute right-3 top-3 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute left-3 top-3 text-gray-500 hover:text-white transition-colors">
                       <X size={16} />
                  </button>
                )}
            </div>

            <button className="w-full sm:w-auto bg-accent hover:bg-accentHover text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20 text-sm font-bold border border-accent/50 hover:scale-[1.02]">
                <ShoppingCart size={18} />
                <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
             
             {/* Category Filter */}
             <div className="bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 shadow-inner">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                   <Filter size={14} />
                   التصنيف
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id as any)}
                        className={`w-full text-right px-3 py-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-between group relative overflow-hidden
                          ${selectedCategories.includes(cat.id as any) 
                            ? 'bg-accent/10 text-white border border-accent shadow-[0_0_10px_rgba(45,137,229,0.1)]' 
                            : 'text-gray-400 bg-transparent border border-transparent hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                            <cat.icon size={16} className={`transition-colors ${selectedCategories.includes(cat.id as any) ? cat.color : 'text-gray-600 group-hover:text-gray-300'}`} />
                            {cat.label}
                        </div>
                        {selectedCategories.includes(cat.id as any) && (
                           <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_currentColor]"></span>
                        )}
                      </button>
                  ))}
                </div>
             </div>

             {/* Price Filter (Min/Max Inputs) */}
             <div className="bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 shadow-inner">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                   <DollarSign size={14} />
                   نطاق السعر (ر.س)
                </h3>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                        <input 
                            type="number" 
                            placeholder="من" 
                            min="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full bg-primary border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:border-accent focus:outline-none placeholder-gray-600"
                        />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="flex-1">
                        <input 
                            type="number" 
                            placeholder="إلى" 
                            min="0"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-primary border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:border-accent focus:outline-none placeholder-gray-600"
                        />
                    </div>
                </div>
                {(minPrice || maxPrice) && (
                    <button 
                        onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                        className="w-full text-center text-[10px] text-red-400 hover:text-red-300 mt-2 flex items-center justify-center gap-1"
                    >
                        <X size={10} />
                        مسح الفلتر
                    </button>
                )}
             </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group relative bg-[#0F1216] rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 flex flex-col h-full hover:-translate-y-1">
                    
                    {/* Image Area */}
                    <div className="relative h-60 overflow-hidden bg-[#1A1E24] group-hover:bg-[#1f242b] transition-colors">
                        
                        {!loadedImages[product.id] && (
                            <div className="absolute inset-0 bg-white/5 animate-pulse z-10 flex items-center justify-center">
                                <ImageOff size={24} className="text-white/20" />
                            </div>
                        )}
                        <img 
                            src={product.image && product.image.trim() !== '' ? product.image : PLACEHOLDER_IMAGE} 
                            alt={product.name} 
                            onLoad={() => handleImageLoad(product.id)}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src !== PLACEHOLDER_IMAGE) {
                                    target.src = PLACEHOLDER_IMAGE;
                                }
                                handleImageLoad(product.id);
                            }}
                            className={`relative z-10 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100 ${loadedImages[product.id] ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1216] via-[#0F1216]/20 to-transparent opacity-80 z-20" />
                        
                        {/* Technical Corners */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/30 z-20"></div>
                        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/30 z-20"></div>

                        {/* Floating Quick Actions (Slide up on hover) */}
                        <div className="absolute inset-x-0 bottom-0 z-30 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-3">
                             <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setQuickViewProduct(product);
                                }}
                                className="h-10 px-4 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-accent hover:border-accent transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-xl hover:scale-105"
                             >
                                <Eye size={16} /> نظرة سريعة
                             </button>
                             <Link 
                                to={`/store/product/${product.id}`}
                                className="h-10 w-10 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center shadow-xl hover:scale-105"
                                title="التفاصيل"
                             >
                                <ArrowRight size={16} />
                             </Link>
                        </div>

                         {/* Badge Top Right */}
                         <div className="absolute top-3 left-3 z-30">
                            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2 py-1 rounded-md backdrop-blur-md border shadow-sm
                                ${product.category === 'kit' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 
                                  product.category === 'sensor' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 
                                  'bg-orange-500/20 text-orange-300 border-orange-500/30'}
                             `}>
                                {product.category === 'kit' ? 'KIT' : product.category === 'sensor' ? 'SENSOR' : 'PART'}
                                {product.category === 'kit' ? <Cpu size={12} /> : product.category === 'sensor' ? <Zap size={12} /> : <Settings size={12} />}
                             </span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-1 relative z-20 bg-[#0F1216]">
                        
                        <div className="mb-1 flex items-center gap-1">
                             <div className="flex text-yellow-500">
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} className="text-gray-700" />
                             </div>
                             <span className="text-[10px] text-gray-500 font-medium ml-1">(4.8)</span>
                        </div>

                        <Link to={`/store/product/${product.id}`} className="block group-hover:text-accent transition-colors duration-300">
                            <h3 className="text-base font-bold text-white mb-2 leading-tight min-h-[40px]">{product.name}</h3>
                        </Link>

                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                            {product.description}
                        </p>
                        
                        {/* Price & Action Row */}
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                             <div className="flex flex-col">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-white font-mono tracking-tight group-hover:text-highlight transition-colors">{product.price}</span>
                                    <span className="text-[10px] text-gray-400 font-bold">ر.س</span>
                                </div>
                             </div>
                             
                             <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product);
                                }}
                                className="w-10 h-10 rounded-full bg-white/5 text-white hover:bg-accent hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-accent hover:scale-110 active:scale-95 group/btn"
                                title="أضف للسلة"
                             >
                                <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                             </button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-secondary/30 border border-white/5 rounded-2xl text-center border-dashed">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500 animate-pulse">
                    <Package size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج مطابقة</h3>
                 <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                   حاول البحث بكلمات مختلفة أو تغيير الفلاتر للحصول على نتائج أفضل.
                 </p>
                 <button onClick={clearFilters} className="px-5 py-2 rounded-lg bg-primary hover:bg-white/5 text-white text-xs font-bold border border-white/10 transition-all hover:border-accent">
                      مسح جميع الفلاتر
                 </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modern Quick View Modal */}
      {quickViewProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setQuickViewProduct(null)}>
              <div 
                  className="bg-[#15191E] border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl relative flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
              >
                  <button 
                      onClick={() => setQuickViewProduct(null)}
                      className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white bg-black/50 backdrop-blur-md p-2 rounded-full transition-all hover:rotate-90 border border-white/10"
                  >
                      <X size={16} />
                  </button>

                  {/* Image Side */}
                  <div className="w-full md:w-1/2 relative bg-black group">
                       <img 
                          src={quickViewProduct.image && quickViewProduct.image.trim() !== '' ? quickViewProduct.image : PLACEHOLDER_IMAGE} 
                          alt={quickViewProduct.name} 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== PLACEHOLDER_IMAGE) {
                                target.src = PLACEHOLDER_IMAGE;
                            }
                          }}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] via-transparent to-transparent opacity-80"></div>
                  </div>

                  {/* Info Side */}
                  <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                       <div className="flex gap-2 mb-4">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border 
                                ${quickViewProduct.category === 'kit' ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' : 
                                  quickViewProduct.category === 'sensor' ? 'border-sky-500/30 text-sky-400 bg-sky-500/5' : 
                                  'border-amber-500/30 text-amber-400 bg-amber-500/5'}
                           `}>
                                {quickViewProduct.category}
                           </span>
                       </div>
                       
                       <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{quickViewProduct.name}</h2>
                       <div className="flex items-baseline gap-2 mb-6 border-b border-white/5 pb-6">
                            <span className="text-3xl font-mono font-bold text-highlight tracking-tighter">{quickViewProduct.price}</span>
                            <span className="text-sm text-gray-400">ر.س</span>
                       </div>

                       <div className="prose prose-invert prose-sm mb-8 text-gray-300">
                          <p>{quickViewProduct.description}</p>
                       </div>

                       <div className="flex gap-3 mt-auto">
                          <button 
                              onClick={() => {
                                  addToCart(quickViewProduct);
                                  setQuickViewProduct(null);
                              }}
                              className="flex-1 bg-accent hover:bg-accentHover text-white py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:-translate-y-0.5 border border-accent/50"
                          >
                              <ShoppingBag size={18} />
                              أضف للسلة
                          </button>
                          <Link 
                              to={`/store/product/${quickViewProduct.id}`}
                              className="px-5 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-white transition flex items-center justify-center font-bold text-sm hover:border-white/30"
                          >
                              التفاصيل
                          </Link>
                       </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Store;
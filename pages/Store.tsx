import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, X, DollarSign, Eye, Check, Zap, Cpu, Settings, Star, ArrowRight, Package, Heart, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800";

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<('kit' | 'sensor' | 'part')[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc'>('relevance');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart, cartCount } = useCart();
  
  // Image Loading State
  const [loadedImages, setLoadedImages] = useState<{[key:string]: boolean}>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({...prev, [id]: true}));
  };

  const priceRanges = [
    { id: 'all', label: 'الكل', min: 0, max: Infinity },
    { id: 'low', label: 'أقل من 100 ر.س', min: 0, max: 100 },
    { id: 'mid', label: '100 - 300 ر.س', min: 100, max: 300 },
    { id: 'high', label: 'أكثر من 300 ر.س', min: 300, max: Infinity },
  ];

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    const range = priceRanges.find(r => r.id === selectedPriceRange);
    const matchesPrice = range ? (product.price >= range.min && product.price < range.max) : true;

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
                            ? 'bg-white/5 text-white border border-white/10' 
                            : 'text-gray-400 bg-transparent border border-transparent hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                            <cat.icon size={16} className={`transition-colors ${selectedCategories.includes(cat.id as any) ? cat.color : 'text-gray-600 group-hover:text-gray-300'}`} />
                            {cat.label}
                        </div>
                        {selectedCategories.includes(cat.id as any) && (
                           <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                        )}
                        {selectedCategories.includes(cat.id as any) && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"></div>
                        )}
                      </button>
                  ))}
                </div>
             </div>

             {/* Price Filter */}
             <div className="bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 shadow-inner">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                   <DollarSign size={14} />
                   نطاق السعر
                </h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-right px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-between group
                          ${selectedPriceRange === range.id 
                            ? 'bg-accent/10 text-accent pl-3 border border-accent/20' 
                            : 'text-gray-400 border border-transparent hover:border-white/5 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        {range.label}
                        {selectedPriceRange === range.id && <Check size={12} />}
                      </button>
                  ))}
                </div>
             </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group relative bg-[#1A1E24] rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(45,137,229,0.1)] hover:-translate-y-2 flex flex-col h-full hover:border-white/20">
                    
                    {/* Image with overlay gradient */}
                    <div className="relative h-64 overflow-hidden bg-black/40">
                        {!loadedImages[product.id] && (
                            <div className="absolute inset-0 bg-white/5 animate-pulse z-10 flex items-center justify-center">
                                <ImageOff size={24} className="text-white/20" />
                            </div>
                        )}
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            onLoad={() => handleImageLoad(product.id)}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                                handleImageLoad(product.id);
                            }}
                            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100 ${loadedImages[product.id] ? 'opacity-100' : 'opacity-0'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E24] via-transparent to-transparent opacity-80" />
                        
                        {/* Badge */}
                        <div className="absolute top-4 right-4 z-20">
                             <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg flex items-center gap-2 transition-transform group-hover:scale-105
                                ${product.category === 'kit' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 
                                  product.category === 'sensor' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 
                                  'bg-orange-500/20 text-orange-300 border-orange-500/30'}
                             `}>
                                {product.category === 'kit' ? <Cpu size={12} /> : product.category === 'sensor' ? <Zap size={12} /> : <Settings size={12} />}
                                {product.category === 'kit' ? 'طقم تعليمي' : product.category === 'sensor' ? 'مستشعر' : 'قطعة غيار'}
                             </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 relative -mt-12 z-10">
                        <Link to={`/store/product/${product.id}`} className="block group-hover:text-accent transition-colors duration-300">
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{product.name}</h3>
                        </Link>
                        
                        <div className="flex items-center gap-1 mb-4 opacity-80">
                            <div className="flex text-yellow-500">
                               {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">(4.8)</span>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                            {product.description}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                             <div>
                                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">السعر</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white font-mono tracking-tighter group-hover:text-highlight transition-colors">{product.price}</span>
                                    <span className="text-xs text-gray-400">ر.س</span>
                                </div>
                             </div>
                             
                             <div className="flex gap-2">
                                 <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setQuickViewProduct(product);
                                    }}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 hover:border-white/20 flex items-center justify-center transition-all hover:scale-105"
                                    title="نظرة سريعة"
                                 >
                                    <Eye size={18} />
                                 </button>
                                 <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addToCart(product);
                                    }}
                                    className="w-10 h-10 rounded-xl bg-accent hover:bg-accentHover text-white flex items-center justify-center transition-all shadow-lg hover:shadow-accent/40 hover:scale-110 active:scale-95 group/cart"
                                    title="أضف للسلة"
                                 >
                                    <ShoppingCart size={18} className="transition-transform group-hover/cart:-rotate-12" />
                                 </button>
                             </div>
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
                 <button onClick={() => {setSearchTerm(''); setSelectedCategories([]); setSelectedPriceRange('all');}} className="px-5 py-2 rounded-lg bg-primary hover:bg-white/5 text-white text-xs font-bold border border-white/10 transition-all hover:border-accent">
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
                          src={quickViewProduct.image} 
                          alt={quickViewProduct.name} 
                          onError={(e) => (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE}
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
                              <ShoppingCart size={18} />
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
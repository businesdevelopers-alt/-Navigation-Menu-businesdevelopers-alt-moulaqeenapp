import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, X, DollarSign, Eye, Check, Zap, Cpu, Settings, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<('kit' | 'sensor' | 'part')[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc'>('relevance');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart, cartCount } = useCart();

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
    { id: 'kit', label: 'أطقم تعليمية', icon: Cpu },
    { id: 'sensor', label: 'مستشعرات', icon: Zap },
    { id: 'part', label: 'قطع غيار', icon: Settings },
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
                    className="w-full bg-secondary border border-white/10 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-accent cursor-pointer appearance-none hover:bg-white/5 transition shadow-sm"
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
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                   <Filter size={14} className="text-accent" />
                   التصنيف
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id as any)}
                        className={`w-full text-right px-3 py-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-between group
                          ${selectedCategories.includes(cat.id as any) 
                            ? 'bg-accent/10 text-accent border border-accent/20' 
                            : 'text-gray-400 bg-primary/50 border border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                            <cat.icon size={14} className={`transition-colors ${selectedCategories.includes(cat.id as any) ? 'text-accent' : 'text-gray-500 group-hover:text-white'}`} />
                            {cat.label}
                        </div>
                        {selectedCategories.includes(cat.id as any) && <Check size={14} className="text-accent" />}
                      </button>
                  ))}
                </div>
             </div>

             {/* Price Filter */}
             <div className="bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 shadow-inner">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                   <DollarSign size={14} className="text-accent" />
                   السعر
                </h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-right px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-between
                          ${selectedPriceRange === range.id 
                            ? 'bg-white/10 text-white border-r-2 border-accent pl-3' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        {range.label}
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
                  <div key={product.id} className="group relative bg-[#1A1E24] rounded-2xl border border-white/5 hover:border-accent/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(45,137,229,0.15)] hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                    
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/20 group-hover:bg-black/40 transition-colors">
                        {/* Badge */}
                        <div className="absolute top-3 right-3 z-10">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border
                            ${product.category === 'kit' ? 'bg-purple-500/20 text-purple-200 border-purple-500/30' : 
                              product.category === 'sensor' ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30' : 
                              'bg-amber-500/20 text-amber-200 border-amber-500/30'}
                          `}>
                            {product.category === 'kit' ? 'KIT' : product.category === 'sensor' ? 'SENSOR' : 'PART'}
                          </span>
                        </div>

                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                        />
                        
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E24] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Quick Action Overlay (Floating) */}
                        <div className="absolute bottom-4 inset-x-4 flex gap-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                            <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setQuickViewProduct(product);
                                }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-xl hover:bg-white/20 hover:scale-105 transition-all tooltip shadow-lg"
                                title="نظرة سريعة"
                            >
                                <Eye size={20} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                              }}
                              className="flex-1 bg-accent/90 backdrop-blur-md text-white p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-accent hover:scale-[1.02] transition-all shadow-lg border border-accent/20"
                            >
                              <ShoppingCart size={18} />
                              أضف للسلة
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-1 relative">
                        <Link to={`/store/product/${product.id}`} className="block mb-1">
                           <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                             {product.name}
                           </h3>
                        </Link>
                        
                        <div className="flex items-center gap-1 mb-3">
                            {[1,2,3,4,5].map(i => (
                                <Star key={i} size={12} className={`${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} `} />
                            ))}
                            <span className="text-[10px] text-gray-500 mr-2">(4.8)</span>
                        </div>
                        
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
                          {product.description}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-mono uppercase mb-0.5">السعر الحالي</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-white font-mono group-hover:text-highlight transition-colors">{product.price}</span>
                                    <span className="text-[10px] text-gray-400">ر.س</span>
                                </div>
                            </div>
                            <Link 
                                to={`/store/product/${product.id}`}
                                className="text-[10px] font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors group/link"
                            >
                                التفاصيل
                                <ArrowRight size={12} className="transition-transform group-hover/link:-translate-x-1" />
                            </Link>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-secondary/30 border border-white/5 rounded-2xl text-center border-dashed">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500 animate-pulse">
                    <Search size={40} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج مطابقة</h3>
                 <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                   لم نعثر على أي منتجات تطابق بحثك الحالي. حاول تغيير الكلمات المفتاحية أو إزالة الفلاتر.
                 </p>
                 <button onClick={() => {setSearchTerm(''); setSelectedCategories([]); setSelectedPriceRange('all');}} className="bg-primary hover:bg-white/5 text-white px-6 py-2 rounded-full text-sm font-bold border border-white/10 transition-all hover:border-accent">
                      مسح جميع الفلاتر
                 </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modern Quick View Modal */}
      {quickViewProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}>
              <div 
                  className="bg-[#15191E] border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl relative flex flex-col md:flex-row overflow-hidden animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
              >
                  <button 
                      onClick={() => setQuickViewProduct(null)}
                      className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white bg-black/40 backdrop-blur-md p-2 rounded-full transition-all hover:rotate-90"
                  >
                      <X size={20} />
                  </button>

                  {/* Image Side */}
                  <div className="w-full md:w-1/2 relative bg-black">
                       <img 
                          src={quickViewProduct.image} 
                          alt={quickViewProduct.name} 
                          className="w-full h-full object-cover opacity-90"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] to-transparent opacity-60"></div>
                  </div>

                  {/* Info Side */}
                  <div className="w-full md:w-1/2 p-8 flex flex-col">
                       <div className="flex gap-2 mb-4">
                           <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border 
                                ${quickViewProduct.category === 'kit' ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' : 
                                  quickViewProduct.category === 'sensor' ? 'border-sky-500/30 text-sky-400 bg-sky-500/5' : 
                                  'border-amber-500/30 text-amber-400 bg-amber-500/5'}
                           `}>
                                {quickViewProduct.category === 'kit' ? 'Robotics Kit' : quickViewProduct.category === 'sensor' ? 'Electronic Sensor' : 'Spare Part'}
                           </span>
                       </div>
                       
                       <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{quickViewProduct.name}</h2>
                       <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-mono font-bold text-highlight tracking-tighter">{quickViewProduct.price}</span>
                            <span className="text-sm text-gray-400">ر.س</span>
                       </div>

                       <div className="bg-primary/50 p-4 rounded-lg border border-white/5 mb-8">
                           <p className="text-gray-300 text-sm leading-relaxed">
                              {quickViewProduct.description}
                           </p>
                       </div>

                       <div className="flex gap-4 mt-auto">
                          <button 
                              onClick={() => {
                                  addToCart(quickViewProduct);
                                  setQuickViewProduct(null);
                              }}
                              className="flex-1 bg-accent hover:bg-accentHover text-white py-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:-translate-y-0.5"
                          >
                              <ShoppingCart size={20} />
                              أضف للسلة الآن
                          </button>
                          <Link 
                              to={`/store/product/${quickViewProduct.id}`}
                              className="px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white transition flex items-center justify-center font-bold text-sm hover:border-white/30"
                          >
                              التفاصيل الكاملة
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
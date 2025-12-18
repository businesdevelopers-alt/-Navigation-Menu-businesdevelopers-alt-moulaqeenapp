import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, X, DollarSign, Eye, Zap, Cpu, Settings, Star, ShoppingBag, Wand2, RefreshCw, SearchX, Plus, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
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
  const [failedImages, setFailedImages] = useState<{[key:string]: boolean}>({});
  const [generatedImages, setGeneratedImages] = useState<{[key:string]: string}>({});
  const [generatingIds, setGeneratingIds] = useState<{[key:string]: boolean}>({});

  // Persistence for generated images
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mulaqqen_generated_images');
      if (stored) {
        setGeneratedImages(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load images', e);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(generatedImages).length > 0) {
      localStorage.setItem('mulaqqen_generated_images', JSON.stringify(generatedImages));
    }
  }, [generatedImages]);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({...prev, [id]: true}));
  };

  const handleGenerateImage = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    setGeneratingIds(prev => ({...prev, [product.id]: true}));
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `Professional product photography of ${product.name} - ${product.description}. 
                Style: High-tech industrial robotics equipment. 
                Lighting: Dramatic cinematic lighting with subtle blue and orange rim lights (cyberpunk style). 
                Material: Brushed metal, carbon fiber, matte plastic.
                Background: Solid dark grey background (Hex color #1A1E24), clean and minimal.
                View: Isometric or 3/4 perspective.
                Quality: 8k resolution, highly detailed, photorealistic, sharp focus, no text overlay.` }]
            },
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });

        // Extract image
        let imageUrl = '';
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64String = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    imageUrl = `data:${mimeType};base64,${base64String}`;
                    break;
                }
            }
        }

        if (imageUrl) {
            setGeneratedImages(prev => ({...prev, [product.id]: imageUrl}));
            setFailedImages(prev => ({...prev, [product.id]: false})); 
        }

    } catch (error) {
        console.error("Failed to generate image", error);
    } finally {
        setGeneratingIds(prev => ({...prev, [product.id]: false}));
    }
  }

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
             <div className="bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 shadow-sm">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                   <Filter size={14} />
                   التصنيف
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id as any)}
                        className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-between group relative overflow-hidden border
                          ${selectedCategories.includes(cat.id as any) 
                            ? 'bg-accent/10 text-white border-accent shadow-[0_0_15px_rgba(45,137,229,0.15)]' 
                            : 'text-gray-400 bg-transparent border-white/5 hover:bg-white/5 hover:text-white hover:border-white/20'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                            <cat.icon size={16} className={`transition-colors duration-300 ${selectedCategories.includes(cat.id as any) ? 'text-accent' : 'text-gray-500 group-hover:text-gray-300'}`} />
                            {cat.label}
                        </div>
                        {selectedCategories.includes(cat.id as any) && (
                           <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                           </div>
                        )}
                      </button>
                  ))}
                </div>
             </div>

             {/* Price Filter (Min/Max Inputs) */}
             <div className="bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 shadow-sm">
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
                {filteredProducts.map((product) => {
                  const hasImage = (product.image && product.image.trim() !== '') && !failedImages[product.id];
                  const displayImage = generatedImages[product.id] || (hasImage ? product.image : PLACEHOLDER_IMAGE);
                  const isMissingImage = !hasImage && !generatedImages[product.id];
                  const isGenerated = !!generatedImages[product.id];

                  return (
                  <div key={product.id} className="group relative flex flex-col bg-[#1A1E24] rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(45,137,229,0.15)] hover:border-accent/40 hover:-translate-y-1">
                    
                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-[#121418]">
                        
                        {/* Loading Spinner */}
                        {!loadedImages[product.id] && !generatedImages[product.id] && hasImage && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#121418] z-10">
                                <RefreshCw size={24} className="text-white/20 animate-spin" />
                            </div>
                        )}

                        {/* Main Image */}
                        <img 
                            src={displayImage} 
                            alt={product.name}
                            onLoad={() => handleImageLoad(product.id)}
                            onError={(e) => {
                                if (!failedImages[product.id] && !generatedImages[product.id]) {
                                    setFailedImages(prev => ({...prev, [product.id]: true}));
                                }
                            }}
                            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 
                                ${loadedImages[product.id] || generatedImages[product.id] || !hasImage ? 'opacity-100' : 'opacity-0'}
                            `}
                        />
                        
                        {/* Gradient Overlay for bottom text visibility (if needed) and depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E24] via-transparent to-transparent opacity-20 z-10"></div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-20">
                            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl backdrop-blur-md border shadow-lg flex items-center gap-1.5
                                ${product.category === 'kit' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' : 
                                  product.category === 'sensor' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' : 
                                  'bg-orange-500/10 text-orange-300 border-orange-500/20'}
                            `}>
                                {product.category === 'kit' ? <Cpu size={12} /> : product.category === 'sensor' ? <Zap size={12} /> : <Settings size={12} />}
                                {product.category === 'kit' ? 'Kit' : product.category === 'sensor' ? 'Sensor' : 'Part'}
                            </span>
                        </div>
                        
                        {/* AI Generated Badge */}
                        {isGenerated && (
                            <div className="absolute top-4 right-4 z-20" title="Generated by AI">
                                <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-white/10 text-purple-400 shadow-lg">
                                    <Sparkles size={12} />
                                </div>
                            </div>
                        )}

                        {/* Floating Action Buttons */}
                        <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                            <button 
                                onClick={(e) => handleGenerateImage(e, product)}
                                disabled={generatingIds[product.id]}
                                className="w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-accent backdrop-blur-md rounded-full text-white border border-white/10 hover:border-accent transition-all shadow-lg disabled:opacity-50"
                                title="توليد صورة بالذكاء الاصطناعي"
                            >
                                {generatingIds[product.id] ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
                            </button>
                            
                            <button 
                                onClick={(e) => { e.preventDefault(); setQuickViewProduct(product); }}
                                className="w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-white hover:text-black backdrop-blur-md rounded-full text-white border border-white/10 transition-all shadow-lg"
                                title="نظرة سريعة"
                            >
                                <Eye size={16} />
                            </button>
                        </div>

                        {/* Missing Image State - Modern Blueprint Placeholder */}
                        {isMissingImage && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0F1216] p-6 text-center animate-in fade-in">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                <div className="w-16 h-16 mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <ImageIcon size={32} className="text-gray-600" />
                                </div>
                                <p className="text-xs text-gray-400 mb-4 font-medium max-w-[200px]">صورة المنتج غير متوفرة. يمكنك توليد صورة باستخدام الذكاء الاصطناعي.</p>
                                <button 
                                    onClick={(e) => handleGenerateImage(e, product)}
                                    disabled={generatingIds[product.id]}
                                    className="group/gen relative overflow-hidden bg-accent hover:bg-accentHover text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 shadow-lg shadow-accent/20 border border-accent/20"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/gen:translate-y-0 transition-transform duration-300"></div>
                                    {generatingIds[product.id] ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                                    <span className="relative z-10">توليد صورة تلقائية</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content Body */}
                    <div className="flex flex-col flex-1 p-5 relative z-10">
                        <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-md border border-white/5">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-[10px] font-bold text-gray-400 pt-0.5">4.8</span>
                             </div>
                        </div>

                        <Link to={`/store/product/${product.id}`} className="group-hover:text-accent transition-colors duration-300 block mb-2">
                            <h3 className="text-lg font-bold text-white leading-tight line-clamp-1">{product.name}</h3>
                        </Link>

                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-6 h-9">
                            {product.description}
                        </p>

                        {/* Footer Actions */}
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                             <div className="flex flex-col">
                                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 font-mono">Price</span>
                                 <div className="flex items-baseline gap-1">
                                     <span className="text-xl font-mono font-bold text-white tracking-tight">{product.price}</span>
                                     <span className="text-[10px] text-accent font-bold">ر.س</span>
                                 </div>
                             </div>

                             <button 
                                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-accent text-white border border-white/10 hover:border-accent transition-all flex items-center gap-2 group/btn active:scale-95"
                                title="أضف للسلة"
                             >
                                <span className="text-xs font-bold">أضف للسلة</span>
                                <Plus size={14} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                             </button>
                        </div>
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-secondary/20 border border-white/5 rounded-3xl text-center border-dashed group animate-in fade-in duration-500">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600 group-hover:scale-110 group-hover:text-accent transition-all duration-500">
                    <SearchX size={40} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">لا توجد نتائج مطابقة</h3>
                 <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                   {searchTerm 
                     ? `عذراً، لم نعثر على أي منتجات تطابق "${searchTerm}". جرب كلمات مفتاحية أخرى.`
                     : 'لا توجد نتائج توافق الفلاتر الحالية. حاول إزالة بعض الفلاتر لرؤية المزيد من المنتجات.'}
                 </p>
                 <button 
                    onClick={clearFilters} 
                    className="px-8 py-3 rounded-xl bg-accent hover:bg-accentHover text-white font-bold shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                 >
                      <RefreshCw size={18} />
                      مسح الفلاتر وإظهار الكل
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
                  className="bg-[#1A1E24] border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl relative flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200"
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
                          src={generatedImages[quickViewProduct.id] || (quickViewProduct.image && quickViewProduct.image.trim() !== '' && !failedImages[quickViewProduct.id] ? quickViewProduct.image : PLACEHOLDER_IMAGE)} 
                          alt={quickViewProduct.name} 
                          onError={(e) => {
                             // Fallback in modal as well
                             const target = e.target as HTMLImageElement;
                             if (target.src !== PLACEHOLDER_IMAGE) target.src = PLACEHOLDER_IMAGE;
                          }}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#121418] via-transparent to-transparent opacity-80"></div>
                       
                       {/* AI Regenerate in Modal */}
                       <div className="absolute top-4 left-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button 
                                onClick={(e) => handleGenerateImage(e, quickViewProduct)}
                                disabled={generatingIds[quickViewProduct.id]}
                                className="p-2 bg-black/60 hover:bg-accent backdrop-blur-md rounded-lg text-white border border-white/10 hover:border-accent transition shadow-lg disabled:opacity-50"
                                title="توليد صورة جديدة"
                            >
                                {generatingIds[quickViewProduct.id] ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
                            </button>
                        </div>
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
                              <ArrowRight size={18} />
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
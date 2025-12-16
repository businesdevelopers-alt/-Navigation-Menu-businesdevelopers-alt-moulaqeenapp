import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ArrowRight, ShoppingCart, Check, Star, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);
  const { addToCart } = useCart();

  // Gallery State
  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  // Image Loading
  useEffect(() => {
    if (product) {
        // Mock gallery images based on product ID to keep them consistent
        const images = [
            product.image,
            `https://picsum.photos/800/800?random=${product.id}-1`,
            `https://picsum.photos/800/800?random=${product.id}-2`,
            `https://picsum.photos/800/800?random=${product.id}-3`,
            `https://picsum.photos/800/800?random=${product.id}-4`,
            `https://picsum.photos/800/800?random=${product.id}-5`,
        ];
        setGallery(images);
        setSelectedImage(images[0]);
    }
  }, [product]);

  // Zoom Logic
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    
    // Calculate percentage position
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;
    
    // Clamp values
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setMousePos({ x, y });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Thumbnail Carousel Logic
  const [scrollIndex, setScrollIndex] = useState(0);
  const THUMBNAILS_PER_VIEW = 4;

  const nextThumbnails = () => {
     if (scrollIndex + THUMBNAILS_PER_VIEW < gallery.length) {
         setScrollIndex(prev => prev + 1);
     }
  };

  const prevThumbnails = () => {
     if (scrollIndex > 0) {
         setScrollIndex(prev => prev - 1);
     }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white font-bold mb-4">المنتج غير موجود</h2>
          <Link to="/store" className="text-accent hover:text-white transition flex items-center justify-center gap-2">
            <ArrowRight size={20} />
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/store" className="hover:text-white transition">المتجر</Link>
          <span>/</span>
          <span className="text-accent">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4 select-none">
            {/* Main Image Viewport */}
            <div 
                ref={imgContainerRef}
                className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-secondary shadow-2xl relative cursor-crosshair group z-10"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
              <img 
                src={selectedImage || product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-200 ease-out pointer-events-none"
                style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isHovering ? 'scale(1.5)' : 'scale(1)'
                }}
              />
              
              {/* Zoom Hint */}
              {!isHovering && (
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                          <Check size={10} /> Hover to Zoom
                      </span>
                  </div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            <div className="relative group/thumbs">
                 {/* Prev Button */}
                 <button 
                    onClick={prevThumbnails}
                    disabled={scrollIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-accent text-white p-1.5 rounded-r border-y border-r border-white/10 disabled:opacity-0 disabled:pointer-events-none transition-all shadow-lg backdrop-blur-sm transform -translate-x-2 group-hover/thumbs:translate-x-0"
                 >
                    <ChevronLeft size={16} />
                 </button>

                 <div className="overflow-hidden -mx-2 py-1">
                     <div 
                        className="flex transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${scrollIndex * (100 / THUMBNAILS_PER_VIEW)}%)` }}
                     >
                        {gallery.map((img, idx) => (
                            <div 
                                key={idx} 
                                className="flex-shrink-0 px-2"
                                style={{ width: `${100 / THUMBNAILS_PER_VIEW}%` }}
                            >
                                <div 
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 relative
                                        ${selectedImage === img 
                                            ? 'border-accent ring-2 ring-accent ring-offset-2 ring-offset-[#0F1216] opacity-100 scale-[0.98]' 
                                            : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30 hover:scale-105'
                                        }
                                    `}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        ))}
                     </div>
                 </div>

                 {/* Next Button */}
                 <button 
                    onClick={nextThumbnails}
                    disabled={scrollIndex + THUMBNAILS_PER_VIEW >= gallery.length}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-accent text-white p-1.5 rounded-l border-y border-l border-white/10 disabled:opacity-0 disabled:pointer-events-none transition-all shadow-lg backdrop-blur-sm transform translate-x-2 group-hover/thumbs:translate-x-0"
                 >
                    <ChevronRight size={16} />
                 </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
               <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-accent text-xs font-bold mb-4 border border-white/10">
                 {product.category === 'kit' ? 'طقم تعليمي' : product.category === 'sensor' ? 'مستشعر إلكتروني' : 'قطعة غيار'}
               </span>
               <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
               <div className="flex items-center gap-4 mb-4">
                 <div className="flex text-yellow-400">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" className="text-gray-600" />
                 </div>
                 <span className="text-gray-400 text-sm">(24 تقييم)</span>
               </div>
               <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-secondary rounded-xl p-6 border border-white/10 mb-8">
               <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-highlight">{product.price} ر.س</span>
                  <span className="text-green-400 flex items-center gap-1 text-sm">
                    <Check size={16} />
                    متوفر في المخزون
                  </span>
               </div>

               <div className="flex gap-4">
                 <div className="flex items-center bg-primary rounded-lg border border-white/10 px-4">
                    <button className="text-gray-400 hover:text-white text-xl font-bold">-</button>
                    <span className="mx-4 text-white font-mono">1</span>
                    <button className="text-gray-400 hover:text-white text-xl font-bold">+</button>
                 </div>
                 <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-accent hover:opacity-90 text-white py-3 px-6 rounded-lg font-bold shadow-lg shadow-accent/20 transition flex items-center justify-center gap-2"
                 >
                    <ShoppingCart size={20} />
                    أضف للسلة
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                  <Shield className="text-highlight mb-2" size={24} />
                  <span className="text-white text-sm font-bold">ضمان سنتين</span>
                  <span className="text-gray-500 text-xs">على العيوب المصنعية</span>
               </div>
               <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                  <Truck className="text-highlight mb-2" size={24} />
                  <span className="text-white text-sm font-bold">شحن سريع</span>
                  <span className="text-gray-500 text-xs">خلال 3-5 أيام عمل</span>
               </div>
               <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                  <RotateCcw className="text-highlight mb-2" size={24} />
                  <span className="text-white text-sm font-bold">استرجاع مجاني</span>
                  <span className="text-gray-500 text-xs">خلال 14 يوم</span>
               </div>
            </div>

          </div>
        </div>

        {/* Additional Tabs/Info */}
        <div className="mt-16">
           <div className="border-b border-white/10 flex gap-8 mb-8 overflow-x-auto">
              <button className="pb-4 text-accent font-bold border-b-2 border-accent whitespace-nowrap">الوصف التفصيلي</button>
              <button className="pb-4 text-gray-400 hover:text-white transition whitespace-nowrap">المواصفات التقنية</button>
              <button className="pb-4 text-gray-400 hover:text-white transition whitespace-nowrap">التقييمات</button>
           </div>
           <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                هذا المنتج مصمم خصيصاً للمبتدئين والمحترفين في مجال الروبوتات. يتميز بجودة تصنيع عالية وتوافق تام مع منصات التحكم الشهيرة مثل الاردوينو والرازبري باي.
              </p>
              <p>
                يحتوي الطقم على جميع الأدوات اللازمة للتركيب والتشغيل، بالإضافة إلى دليل مستخدم شامل باللغة العربية والإنجليزية. سواء كنت طالباً أو هاوياً، سيمنحك هذا المنتج تجربة تعليمية ممتعة وعملية.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
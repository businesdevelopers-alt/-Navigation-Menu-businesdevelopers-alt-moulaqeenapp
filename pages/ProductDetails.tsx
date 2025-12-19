
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { 
  ArrowRight, ShoppingCart, Check, Star, Shield, 
  Truck, RotateCcw, ChevronLeft, ChevronRight, 
  Cpu, Zap, Activity, ShieldCheck, Download, 
  Share2, Info, Crosshair, Scan
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import AIProductImage from '../components/AIProductImage';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
        const images = product.image ? [
            product.image,
            `https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop`,
            `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop`,
            `https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=800&auto=format&fit=crop`
        ] : [];
        setGallery(images);
        setSelectedImage(images[0] || '');
    }
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
    setIsHovering(true);
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-primary py-12 selection:bg-accent/30 overflow-x-hidden">
      {/* Background HUD Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.5)_1px,transparent_0)] bg-[size:30px_30px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation / Dossier Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
           <nav className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
            <Link to="/store" className="hover:text-accent transition">Procurement Hub</Link>
            <ChevronLeft size={10} className="rotate-180" />
            <span className="text-white">Dossier ID: {product.id.toUpperCase()}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded text-[10px] font-black text-green-400 uppercase tracking-widest">
               <ShieldCheck size={12} />
               Inventory: Nominal
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <Activity size={12} />
               Tech Version: 4.2.0
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Visual Presentation Area */}
          <div className="lg:col-span-7 space-y-6">
            <div 
                ref={imgContainerRef}
                className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 bg-black relative cursor-crosshair group shadow-2xl"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsHovering(false)}
            >
              {/* Technical Grid Overlay */}
              <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
              
              <AIProductImage 
                src={selectedImage || product.image} 
                alt={product.name} 
                description={product.description}
                className="w-full h-full object-contain p-12 transition-transform duration-200 ease-out pointer-events-none"
                style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isHovering ? 'scale(1.4)' : 'scale(1)'
                }}
              />
              
              {/* HUD Frame */}
              <div className="absolute inset-8 border border-white/5 pointer-events-none rounded-2xl">
                 <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent/40 rounded-tl-2xl"></div>
                 <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent/40 rounded-br-2xl"></div>
              </div>

              {/* Scanning Line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent h-20 w-full animate-scan pointer-events-none"></div>
              
              <div className="absolute bottom-10 left-10 z-20 text-[10px] font-mono text-white/40 leading-tight">
                X_POS: {Math.round(mousePos.x)}% <br/>
                Y_POS: {Math.round(mousePos.y)}% <br/>
                MAG_LEVEL: {isHovering ? '1.4X' : '1.0X'}
              </div>

              {/* Reticle following mouse */}
              {isHovering && (
                  <div 
                    className="absolute w-12 h-12 border border-accent/60 rounded-full pointer-events-none z-30"
                    style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="absolute top-1/2 left-0 w-full h-px bg-accent/40"></div>
                    <div className="absolute left-1/2 top-0 h-full w-px bg-accent/40"></div>
                  </div>
              )}
            </div>

            {/* Technical Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {gallery.length > 0 ? gallery.map((img, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setSelectedImage(img)}
                        className={`w-24 h-24 rounded-2xl border-2 transition-all flex-shrink-0 overflow-hidden bg-black/40
                            ${selectedImage === img ? 'border-accent shadow-[0_0_15px_rgba(45,137,229,0.3)] scale-105' : 'border-white/5 opacity-50 hover:opacity-100'}
                        `}
                    >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                )) : (
                  <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl w-full text-center">
                    Additional Views Currently Offline
                  </div>
                )}
            </div>
          </div>

          {/* Data Sheet Area */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-10">
               <div className="flex items-center gap-2 mb-6">
                 <span className="px-3 py-1 bg-highlight text-black text-[10px] font-black uppercase rounded shadow-lg tracking-wider">Classification: {product.category.toUpperCase()} UNIT</span>
                 <div className="flex text-highlight gap-0.5 ml-auto">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} className={i >= 4 ? "text-gray-800" : ""} />)}
                 </div>
               </div>

               <h1 className="text-5xl font-black text-white mb-6 leading-tight tracking-tighter uppercase">{product.name}</h1>
               <p className="text-gray-400 text-lg leading-relaxed font-light mb-10 border-r-4 border-accent pr-6">
                  {product.description}
               </p>
            </div>

            {/* Spec Readout Board */}
            <div className="bg-[#111418] rounded-[2.5rem] p-8 border border-white/10 mb-10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-gray-500 font-mono font-bold uppercase mb-2 tracking-[0.2em]">Procurement Value</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-highlight font-mono tracking-tighter">{product.price}</span>
                        <span className="text-sm font-bold text-gray-500 uppercase">sar</span>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-500 flex items-center justify-end gap-2 text-[10px] font-black uppercase mb-1">
                        <Scan size={12} /> Stock Verified
                    </div>
                    <div className="text-gray-500 text-[10px] font-mono">EST_LEAD_TIME: 48H</div>
                  </div>
               </div>

               {/* Core Specs Grid */}
               <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="bg-primary/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4 transition-colors hover:bg-secondary">
                      <Zap className="text-blue-400" size={24} />
                      <div>
                         <div className="text-[10px] text-gray-500 font-mono uppercase font-bold mb-1">Energy Module</div>
                         <div className="text-base text-white font-mono font-black">{product.specs?.battery || 'INTERNAL_DC'}</div>
                      </div>
                   </div>
                   <div className="bg-primary/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4 transition-colors hover:bg-secondary">
                      <Cpu className="text-purple-400" size={24} />
                      <div>
                         <div className="text-[10px] text-gray-500 font-mono uppercase font-bold mb-1">Core Logic</div>
                         <div className="text-base text-white font-mono font-black">{product.specs?.processor || 'ARM_V8_SOC'}</div>
                      </div>
                   </div>
               </div>

               <div className="flex gap-4">
                 <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-white text-black hover:bg-accent hover:text-white py-6 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 border-b-8 border-black/10 group"
                 >
                    <Shield size={28} className="transition-transform group-hover:rotate-12" />
                    AUTHORIZE PROCUREMENT
                 </button>
               </div>
            </div>

            {/* Industrial Meta Info */}
            <div className="grid grid-cols-3 gap-8 pt-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-white/90 font-black text-[10px] uppercase tracking-widest">
                        <ShieldCheck size={18} className="text-accent" /> Warranted
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Multi-Year Coverage on Hardware Degradation</p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-white/90 font-black text-[10px] uppercase tracking-widest">
                        <Truck size={18} className="text-accent" /> Logistics
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Secure Global Transit with Real-Time Telemetry</p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-white/90 font-black text-[10px] uppercase tracking-widest">
                        <RotateCcw size={18} className="text-accent" /> Integrity
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Quality Assurance Certificate Included</p>
                </div>
            </div>

          </div>
        </div>

        {/* Detailed Data Section */}
        <div className="mt-32 bg-[#0D1013] rounded-[4rem] border border-white/5 p-12 md:p-20 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-accent rounded-b-full"></div>
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
           
           <div className="grid lg:grid-cols-2 gap-20">
              <div className="relative z-10">
                 <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                    <div className="w-2 h-8 bg-accent rounded-full"></div>
                    TECHNICAL SPECIFICATIONS
                 </h2>
                 <div className="space-y-8 text-gray-400 leading-loose text-lg font-light">
                    <p>
                        This hardware unit is engineered for mission-critical deployments. Integrated with sub-cycle feedback loops and adaptive torque management, it provides unparalleled reliability for high-stakes robotics operations.
                    </p>
                    <p>
                        Constructed from aerospace-grade polymers and reinforced with carbon fiber struts, the chassis minimizes vibrational interference while maintaining structural rigidity across extreme thermal ranges.
                    </p>
                    <div className="flex gap-4 pt-6">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all">
                            <Download size={14} /> DOWNLOAD DATASHEET
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all">
                            <Share2 size={14} /> SHARE REPORT
                        </button>
                    </div>
                 </div>
              </div>

              <div className="bg-black/40 rounded-[2.5rem] p-10 border border-white/10 relative z-10 backdrop-blur-xl">
                 <h3 className="text-[11px] font-mono font-black text-gray-500 mb-8 uppercase tracking-[0.3em]">Deployment Diagnostics</h3>
                 <div className="space-y-2">
                    {[
                        { label: 'Control Latency', value: '< 1.4ms', status: 'optimal' },
                        { label: 'Thermal Resistance', value: '-25°C to +90°C', status: 'standard' },
                        { label: 'Network Throughput', value: '1.2 Gbps', status: 'optimal' },
                        { label: 'Power Efficiency', value: '94.2%', status: 'optimal' },
                        { label: 'API Protocols', value: 'gRPC / Websockets', status: 'standard' }
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 group/diag">
                            <span className="text-[12px] text-gray-500 uppercase font-mono font-bold group-hover/diag:text-gray-300 transition-colors">{row.label}</span>
                            <div className="flex items-center gap-3">
                                <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'optimal' ? 'bg-green-500' : 'bg-highlight'}`}></span>
                                <span className="text-[13px] text-accent font-mono font-black">{row.value}</span>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>

      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(400%); }
        }
        .animate-scan {
            animation: scan 5s linear infinite;
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

export default ProductDetails;
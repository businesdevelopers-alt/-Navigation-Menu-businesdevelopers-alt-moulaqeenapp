
import React, { useState, Suspense } from 'react';
import { 
  Wifi, Eye, Activity, Compass, Video, Cpu, Zap, Scale, Save, Box, Disc, 
  Settings2, Radar, Crosshair, RotateCcw, Info, CheckCircle2, Map, Scan, 
  ChevronDown, ChevronUp, Palette, Upload, X, Download, Share2, Globe, 
  Layers, Play, Loader2, Target, Cog, Sparkles, MousePointer2
} from 'lucide-react';
import { RobotConfig, SensorType } from '../types';

const SimulationViewport = React.lazy(() => Promise.resolve({ default: () => <div className="h-full w-full bg-black flex items-center justify-center text-white font-mono text-sm opacity-50 uppercase tracking-widest">Simulation Engine Connecting...</div> }));

interface RobotBuilderProps {
  config: RobotConfig;
  setConfig: (config: RobotConfig) => void;
  onSave: () => void;
}

type ComponentCategory = 'distance' | 'vision' | 'navigation' | 'compute' | 'actuators';

interface ComponentDefinition {
  id: string;
  name: string;
  desc: string;
  icon: any;
  power: number;
  weight: number;
  category: ComponentCategory;
}

const COMPONENTS: ComponentDefinition[] = [
  // Sensors
  { id: 'ultrasonic', name: 'حساس مسافة صوتي', desc: 'قياس المسافة عبر الصدى.', icon: Wifi, power: 5, weight: 10, category: 'distance' },
  { id: 'lidar', name: 'ماسح LiDAR', desc: 'خرائط نقطية ليزرية.', icon: Scan, power: 45, weight: 160, category: 'distance' },
  { id: 'infrared', name: 'متتبع الخط IR', desc: 'التعرف على التباين الضوئي.', icon: Activity, power: 3, weight: 5, category: 'distance' },
  { id: 'camera', name: 'كاميرا AI رؤية', desc: 'معالجة صور ذكية.', icon: Video, power: 15, weight: 25, category: 'vision' },
  { id: 'camera_depth', name: 'كاميرا العمق', desc: 'إدراك ثلاثي الأبعاد.', icon: Layers, power: 25, weight: 40, category: 'vision' },
  { id: 'color', name: 'حساس ألوان', desc: 'تمييز الأطياف اللونية.', icon: Eye, power: 4, weight: 8, category: 'vision' },
  { id: 'imu', name: 'وحدة IMU دقيقة', desc: 'تحديد الحركة الخطية.', icon: Crosshair, power: 8, weight: 5, category: 'navigation' },
  { id: 'gyro', name: 'جيروسكوب ملاحي', desc: 'موازنة الدوران.', icon: Compass, power: 2, weight: 5, category: 'navigation' },
  { id: 'gps', name: 'وحدة ملاحية GPS', desc: 'تحديد الموقع العالمي.', icon: Globe, power: 12, weight: 15, category: 'navigation' },
  // Compute
  { id: 'standard_cpu', name: 'معالج Cortex M4', desc: 'أداء قياسي للمهام الأساسية.', icon: Cpu, power: 10, weight: 2, category: 'compute' },
  { id: 'ai_jetson', name: 'Nvidia Jetson Nano', desc: 'قوة معالجة للذكاء الاصطناعي.', icon: Cpu, power: 50, weight: 20, category: 'compute' },
  // Actuators
  { id: 'servo_high', name: 'سيرفو عالي العزم', desc: 'دقة دوران للمفاصل.', icon: Cog, power: 20, weight: 55, category: 'actuators' },
  { id: 'dc_geared', name: 'محرك DC مسنن', desc: 'دفع قوي للعجلات.', icon: Zap, power: 35, weight: 120, category: 'actuators' },
];

const CATEGORY_LABELS: Record<ComponentCategory, { label: string; icon: any }> = {
  distance: { label: 'المسافة', icon: Scan },
  vision: { label: 'الرؤية', icon: Eye },
  navigation: { label: 'الملاحة', icon: Map },
  compute: { label: 'المعالجة', icon: Cpu },
  actuators: { label: 'المحركات', icon: Cog },
};

const RobotBuilder: React.FC<RobotBuilderProps> = ({ config, setConfig, onSave }) => {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('distance');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComp, setDraggedComp] = useState<ComponentDefinition | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const onDragStart = (comp: ComponentDefinition) => {
    setDraggedComp(comp);
  };

  const onDrop = (slot: keyof RobotConfig['slots']) => {
    if (!draggedComp) return;

    // Validation
    const isValid = (slot === 'core' && draggedComp.category === 'compute') ||
                  ((slot === 'front' || slot === 'back') && ['distance', 'vision', 'navigation'].includes(draggedComp.category)) ||
                  ((slot === 'left' || slot === 'right') && draggedComp.category === 'actuators');

    if (!isValid) {
        alert('هذا المكون غير متوافق مع المنفذ المختار!');
        return;
    }

    const newSlots = { ...config.slots, [slot]: draggedComp.id };
    const newSensors = Object.values(newSlots).filter(id => 
        COMPONENTS.find(c => c.id === id && ['distance', 'vision', 'navigation'].includes(c.category))
    ) as SensorType[];

    setConfig({
      ...config,
      slots: newSlots,
      sensors: Array.from(new Set(newSensors))
    });

    setDraggedComp(null);
    setDropTarget(null);
  };

  const limits = { maxPower: 500, maxWeight: 2000 };
  const assembledItems = COMPONENTS.filter(c => Object.values(config.slots).includes(c.id));
  const totalPower = assembledItems.reduce((acc, curr) => acc + curr.power, 20); 
  const totalWeight = assembledItems.reduce((acc, curr) => acc + curr.weight, 500); 
  
  const powerPercent = Math.min((totalPower / limits.maxPower) * 100, 100);
  const weightPercent = Math.min((totalWeight / limits.maxWeight) * 100, 100);

  const getSlotDisplay = (slotId: keyof RobotConfig['slots']) => {
      const compId = config.slots[slotId];
      const comp = COMPONENTS.find(c => c.id === compId);
      return { comp, label: slotId.toUpperCase() };
  };

  const renderSlot = (slotId: keyof RobotConfig['slots'], icon: any) => {
      const { comp, label } = getSlotDisplay(slotId);
      const isTarget = dropTarget === slotId;

      return (
          <div 
            onDragOver={(e) => { e.preventDefault(); setDropTarget(slotId); }}
            onDragLeave={() => setDropTarget(null)}
            onDrop={() => onDrop(slotId)}
            className={`relative w-28 h-28 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300
                ${comp ? 'bg-accent/10 border-accent/40 shadow-lg' : 'bg-black/40 border-white/10'}
                ${isTarget ? 'scale-110 border-highlight bg-highlight/5 shadow-[0_0_20px_rgba(247,198,0,0.3)]' : ''}
            `}
          >
              {comp ? (
                  <>
                    <div className="text-accent mb-1">{React.createElement(comp.icon, { size: 24 })}</div>
                    <span className="text-[8px] font-black text-white text-center px-2 leading-tight uppercase">{comp.name}</span>
                    <button 
                        onClick={() => setConfig({ ...config, slots: { ...config.slots, [slotId]: null } })}
                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                        <X size={12} />
                    </button>
                  </>
              ) : (
                  <>
                    <div className="text-gray-700 mb-2">{React.createElement(icon, { size: 20 })}</div>
                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{label}</span>
                  </>
              )}
              {isTarget && <div className="absolute inset-0 bg-highlight/10 animate-pulse rounded-3xl"></div>}
          </div>
      );
  };

  return (
    <div className="h-full p-6 lg:p-10 animate-fade-in overflow-y-auto custom-scrollbar bg-primary selection:bg-accent/30 text-slate-200">
      <div className="max-w-[1600px] mx-auto pb-24">
        
        {/* HUD Header */}
        <div className="flex flex-col xl:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-10">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <Sparkles size={14} className="animate-pulse" /> Modular Assembly Link Active
            </div>
            <h1 className="text-6xl font-black text-white mb-3 tracking-tighter leading-none">
                ورشة <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent via-blue-400 to-indigo-500 uppercase">التهيئة</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-xl text-lg">قم بسحب المكونات من المكتبة الجانبية وإسقاطها في منافذ الروبوت المخصصة.</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
              <button 
                onClick={onSave} 
                className="flex-1 xl:flex-none px-12 py-5 bg-accent hover:bg-accentHover text-white rounded-2xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95"
              >
                 <Save size={20} />
                 <span>حفظ وبرمجة التكوين</span>
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Left Panel: Hardware Chassis Overview */}
          <div className="xl:col-span-5 space-y-8">
            <div className="bg-[#111418] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
               <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-[0.05] pointer-events-none"></div>
               
               <div className="mb-12 text-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase font-black tracking-[0.4em]">Hardware_Map_v4.0</span>
                    <h3 className="text-2xl font-black text-white mt-2 uppercase tracking-tighter">{config.name || 'UNIT_01'}</h3>
               </div>

               {/* Assembly Grid */}
               <div className="relative w-full max-w-md aspect-square bg-black/40 rounded-[4rem] border border-white/5 flex flex-col items-center justify-between p-12 shadow-inner group">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,137,229,0.05)_0%,transparent_70%)] animate-pulse"></div>
                   
                   {/* Front Slot */}
                   {renderSlot('front', Radar)}

                   <div className="flex justify-between w-full items-center">
                       {/* Left Slot */}
                       {renderSlot('left', Cog)}

                       {/* Central Processing Core */}
                       <div 
                          onDragOver={(e) => { e.preventDefault(); setDropTarget('core'); }}
                          onDragLeave={() => setDropTarget(null)}
                          onDrop={() => onDrop('core')}
                          className={`w-32 h-32 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center justify-center relative
                            ${config.slots.core ? 'bg-accent/20 border-accent shadow-[0_0_30px_rgba(45,137,229,0.4)]' : 'bg-primary/60 border-white/20 border-dashed'}
                            ${dropTarget === 'core' ? 'scale-110 border-highlight bg-highlight/10 shadow-2xl' : ''}
                          `}
                          style={{ backgroundColor: config.slots.core ? config.color : undefined }}
                       >
                           {config.slots.core ? (
                               <div className="flex flex-col items-center text-center p-2">
                                   <Cpu size={32} className="text-white mb-1 drop-shadow-lg" />
                                   <span className="text-[8px] font-black text-white uppercase leading-tight">
                                       {COMPONENTS.find(c => c.id === config.slots.core)?.name}
                                   </span>
                               </div>
                           ) : (
                               <div className="flex flex-col items-center gap-1 opacity-40">
                                   <Cpu size={28} />
                                   <span className="text-[7px] font-black uppercase tracking-widest">Process Core</span>
                               </div>
                           )}
                           {dropTarget === 'core' && <div className="absolute inset-0 bg-highlight/5 animate-ping rounded-[2.5rem]"></div>}
                       </div>

                       {/* Right Slot */}
                       {renderSlot('right', Cog)}
                   </div>

                   {/* Rear Slot */}
                   {renderSlot('back', Zap)}

                   {/* Background Labels */}
                   <div className="absolute top-1/2 left-8 -translate-y-1/2 -rotate-90 text-[8px] font-mono text-white/10 uppercase tracking-[1em]">Port_Alpha_L</div>
                   <div className="absolute top-1/2 right-8 -translate-y-1/2 rotate-90 text-[8px] font-mono text-white/10 uppercase tracking-[1em]">Port_Alpha_R</div>
               </div>

               {/* Stats HUD */}
               <div className="w-full mt-12 grid grid-cols-2 gap-6">
                  <div className="bg-black/60 p-6 rounded-3xl border border-white/5">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-widest flex items-center gap-2"><Zap size={12} className="text-highlight" /> Power</span>
                         <span className="text-[10px] font-mono font-black">{totalPower}mA</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                         <div className="h-full bg-highlight transition-all duration-1000" style={{ width: `${powerPercent}%` }}></div>
                      </div>
                  </div>
                  <div className="bg-black/60 p-6 rounded-3xl border border-white/5">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-widest flex items-center gap-2"><Scale size={12} className="text-blue-400" /> Mass</span>
                         <span className="text-[10px] font-mono font-black">{totalWeight}g</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                         <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${weightPercent}%` }}></div>
                      </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Panel: Modular Library */}
          <div className="xl:col-span-7 space-y-8">
            <div className="bg-[#111418] p-3 rounded-[2.5rem] border border-white/5 flex gap-2 shadow-2xl overflow-x-auto scrollbar-hide">
               {(Object.keys(CATEGORY_LABELS) as ComponentCategory[]).map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-[2rem] font-black text-[10px] transition-all uppercase tracking-[0.2em] whitespace-nowrap
                       ${activeCategory === category 
                       ? 'bg-accent text-white shadow-lg' 
                       : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                  >
                     {React.createElement(CATEGORY_LABELS[category].icon, { size: 16 })}
                     {CATEGORY_LABELS[category].label}
                  </button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMPONENTS.filter(c => c.category === activeCategory).map((comp) => (
                    <div 
                        key={comp.id}
                        draggable
                        onDragStart={() => onDragStart(comp)}
                        onDragEnd={() => setDraggedComp(null)}
                        className={`group relative bg-[#15191E] p-6 rounded-[2.5rem] border border-white/5 cursor-grab active:cursor-grabbing hover:border-accent/40 transition-all duration-300 flex items-center gap-5
                            ${draggedComp?.id === comp.id ? 'opacity-40 grayscale scale-95' : 'hover:-translate-y-1 shadow-lg'}
                        `}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-500 shadow-inner">
                            {React.createElement(comp.icon, { size: 28 })}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-white text-sm uppercase tracking-tight mb-1">{comp.name}</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">{comp.desc}</p>
                            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600">
                                <span className="flex items-center gap-1"><Zap size={10} className="text-highlight" /> {comp.power}mA</span>
                                <span className="flex items-center gap-1"><Scale size={10} className="text-blue-400" /> {comp.weight}g</span>
                            </div>
                        </div>
                        <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                             <MousePointer2 size={12} className="text-accent animate-bounce" />
                             <span className="text-[8px] font-black text-accent uppercase tracking-widest">Sحب للتركيب</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Advisor Panel */}
            <div className="mt-12 bg-indigo-500/5 border border-indigo-500/20 p-10 rounded-[3rem] flex items-start gap-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/30"></div>
               <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform"><Sparkles size={36} /></div>
               <div>
                 <h4 className="font-black text-indigo-200 text-xl mb-3 tracking-tighter uppercase">AI Assembly Advisor • مستشار التجميع الذكي</h4>
                 <p className="text-indigo-300/60 leading-relaxed text-lg font-light">
                   قم بموازنة الكتلة الكلية (Mass) لضمان استقرار حركة الروبوت. إسقاط المكونات الثقيلة في المنفذ الخلفي قد يحسن التوازن للروبوتات ذات الدفع الأمامي.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default RobotBuilder;
import React, { useState, Suspense } from 'react';
import { 
  Wifi, Eye, Activity, Compass, Video, Cpu, Zap, Scale, Save, Box, Disc, 
  Settings2, Radar, Crosshair, RotateCcw, Info, CheckCircle2, Map, Scan, 
  ChevronDown, ChevronUp, Palette, Upload, X, Download, Share2, Globe, 
  Layers, Play, Loader2, Target
} from 'lucide-react';
import { RobotConfig, SensorType } from '../types';

const SimulationViewport = React.lazy(() => Promise.resolve({ default: () => <div className="h-full w-full bg-black flex items-center justify-center text-white font-mono text-sm opacity-50 uppercase tracking-widest">Simulation Engine Connecting...</div> }));

interface RobotBuilderProps {
  config: RobotConfig;
  setConfig: (config: RobotConfig) => void;
  onSave: () => void;
}

type SensorCategory = 'distance' | 'vision' | 'navigation';

const SENSORS: { 
  id: SensorType; 
  name: string; 
  desc: string; 
  details: string;
  icon: any; 
  power: number; 
  weight: number;
  category: SensorCategory;
}[] = [
  { id: 'ultrasonic', name: 'حساس مسافة صوتي', desc: 'قياس المسافة عبر الصدى.', details: 'يستخدم الأمواج فوق الصوتية لاكتشاف العوائق.', icon: Wifi, power: 5, weight: 10, category: 'distance' },
  { id: 'lidar', name: 'ماسح LiDAR', desc: 'خرائط نقطية ليزرية.', details: 'دقة عالية جداً لرسم خرائط البيئة 360 درجة.', icon: Scan, power: 45, weight: 160, category: 'distance' },
  { id: 'infrared', name: 'متتبع الخط IR', desc: 'التعرف على التباين الضوئي.', details: 'أساسي لروبوتات تتبع المسارات الأرضية.', icon: Activity, power: 3, weight: 5, category: 'distance' },
  { id: 'camera', name: 'كاميرا AI رؤية', desc: 'معالجة صور ذكية.', details: 'تمكن الروبوت من التعرف على الكائنات والوجوه.', icon: Video, power: 15, weight: 25, category: 'vision' },
  { id: 'camera_depth', name: 'كاميرا العمق', desc: 'إدراك ثلاثي الأبعاد.', details: 'خرائط عمق دقيقة لتفادي العقبات المعقدة.', icon: Layers, power: 25, weight: 40, category: 'vision' },
  { id: 'color', name: 'حساس ألوان', desc: 'تمييز الأطياف اللونية.', details: 'قراءة قيم RGB للأسطح والأجسام.', icon: Eye, power: 4, weight: 8, category: 'vision' },
  { id: 'imu', name: 'وحدة IMU دقيقة', desc: 'تحديد الحركة الخطية.', details: 'تجمع بيانات التسارع والاهتزاز بدقة.', icon: Crosshair, power: 8, weight: 5, category: 'navigation' },
  { id: 'gyro', name: 'جيروسكوب ملاحي', desc: 'موازنة الدوران.', details: 'يضمن استقرار الروبوت وانعطافات دقيقة.', icon: Compass, power: 2, weight: 5, category: 'navigation' },
  { id: 'gps', name: 'وحدة ملاحية GPS', desc: 'تحديد الموقع العالمي.', details: 'استقبال إشارات الأقمار الصناعية للمهام الخارجية.', icon: Globe, power: 12, weight: 15, category: 'navigation' }
];

const CATEGORY_LABELS: Record<SensorCategory, { label: string; icon: any }> = {
  distance: { label: 'المسافة', icon: Scan },
  vision: { label: 'الرؤية', icon: Eye },
  navigation: { label: 'الملاحة', icon: Map },
};

const ROBOT_LIMITS = {
  rover: { maxPower: 300, maxWeight: 1200 },
  drone: { maxPower: 150, maxWeight: 600 },
  arm: { maxPower: 400, maxWeight: 1500 }
};

const DEFAULT_CONFIGS: Partial<Record<SensorType, any>> = {
  ultrasonic: { range: 200 },
  infrared: { sensitivity: 50 },
  color: { illumination: true },
  gyro: { axis: '3-axis' },
  camera: { resolution: '720p', illumination: false, sensitivity: 'Medium', exposure: 0 },
  lidar: { range: 8, sampleRate: 4000 },
  imu: { accelRange: '4g', gyroRange: '500dps' },
  gps: { updateRate: '1Hz' },
  camera_depth: { resolution: '480p', technology: 'Stereo' }
};

const RobotBuilder: React.FC<RobotBuilderProps> = ({ config, setConfig, onSave }) => {
  const [activeCategory, setActiveCategory] = useState<SensorCategory>('distance');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedSensors, setExpandedSensors] = useState<string[]>(config.sensors);

  const toggleSensor = (id: SensorType) => {
    const isAdding = !config.sensors.includes(id);
    const newSensors = isAdding ? [...config.sensors, id] : config.sensors.filter(s => s !== id);
    let newSensorConfig = { ...config.sensorConfig };
    
    if (isAdding) {
      if (!(newSensorConfig as any)[id] && DEFAULT_CONFIGS[id]) {
         (newSensorConfig as any)[id] = { ...DEFAULT_CONFIGS[id] };
      }
      setExpandedSensors(prev => Array.from(new Set([...prev, id])));
    } else {
      setExpandedSensors(prev => prev.filter(s => s !== id));
    }
    
    setConfig({ ...config, sensors: newSensors, sensorConfig: newSensorConfig });
  };

  const toggleExpansion = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedSensors(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const updateSensorConfig = (id: SensorType, key: string, value: any) => {
    setConfig({ ...config, sensorConfig: { ...config.sensorConfig, [id]: { ...(config.sensorConfig as any)[id], [key]: value } } });
  };

  const handleLogoProcess = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setConfig({
        ...config,
        branding: {
          ...(config.branding || { primaryColor: config.color, secondaryColor: '#475569' }),
          logo: reader.result as string
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoProcess(e.dataTransfer.files[0]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoProcess(e.target.files[0]);
    }
  };

  const limits = ROBOT_LIMITS[config.type] || ROBOT_LIMITS.rover;
  const totalPower = SENSORS.filter(s => config.sensors.includes(s.id)).reduce((acc, curr) => acc + curr.power, 20); 
  const totalWeight = SENSORS.filter(s => config.sensors.includes(s.id)).reduce((acc, curr) => acc + curr.weight, 500); 
  
  const powerPercent = Math.min((totalPower / limits.maxPower) * 100, 100);
  const weightPercent = Math.min((totalWeight / limits.maxWeight) * 100, 100);

  const getStatusColorClass = (percent: number) => {
    if (percent > 90) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    if (percent > 70) return 'bg-highlight shadow-[0_0_15px_rgba(247,198,0,0.5)]';
    return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]';
  };

  return (
    <div className="h-full p-6 lg:p-10 animate-fade-in overflow-y-auto custom-scrollbar bg-primary selection:bg-accent/30 text-slate-200">
      <div className="max-w-[1600px] mx-auto pb-24">
        
        {/* Cinematic Header HUD */}
        <div className="flex flex-col xl:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-10">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-[0_0_20px_rgba(45,137,229,0.15)]">
                <Target size={14} className="animate-pulse" /> Advanced Assembly Authorized
            </div>
            <h1 className="text-6xl font-black text-white mb-3 tracking-tighter leading-none">
                ورشة <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent via-blue-400 to-indigo-500 uppercase">التهيئة</span> الصناعية
            </h1>
            <p className="text-gray-500 font-medium max-w-xl text-lg">تحكم في المعاملات الفيزيائية، حدد بروتوكولات الحساسات، وراقب كفاءة الطاقة الحيوية للنظام.</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
              <button 
                onClick={() => setIsTestModalOpen(true)} 
                className="flex-1 xl:flex-none px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black border border-white/10 transition-all flex items-center justify-center gap-4 group"
              >
                 <Play size={20} fill="currentColor" className="group-hover:text-accent transition-colors" /> 
                 <span>تشغيل المحاكاة</span>
              </button>
              <button 
                onClick={onSave} 
                className="flex-1 xl:flex-none px-12 py-5 bg-accent hover:bg-accentHover text-white rounded-2xl font-black shadow-2xl shadow-accent/20 transition-all flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 border-b-4 border-black/20"
              >
                 <Save size={20} />
                 <span>حفظ وبرمجة التكوين</span>
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Left Panel: Unit Core Visualization & ID */}
          <div className="xl:col-span-4 space-y-8">
            <div className="bg-[#111418] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-[0.05] pointer-events-none"></div>
               
               <div className="mb-10">
                 <label className="block text-gray-600 text-[10px] font-mono font-black uppercase mb-3 tracking-widest">Unit Access Identifier</label>
                 <input 
                    type="text" 
                    value={config.name}
                    onChange={(e) => setConfig({...config, name: e.target.value})}
                    className="w-full bg-primary/60 border border-white/10 rounded-2xl px-5 py-4 text-white font-black uppercase tracking-tight focus:border-accent transition-all text-xl outline-none shadow-inner"
                    placeholder="ENTER_NAME..."
                 />
               </div>

               {/* Branding / Dropzone UI */}
               <div className="mb-10">
                    <label className="block text-gray-600 text-[10px] font-mono font-black uppercase mb-3 tracking-widest">براند الروبوت (Drag & Drop Logo)</label>
                    <div className="flex gap-4">
                        <div 
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex-1 relative h-28 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer overflow-hidden
                                ${isDragging ? 'bg-accent/20 border-accent shadow-[0_0_30px_rgba(45,137,229,0.4)] scale-[1.02]' : 'bg-primary/40 border-white/10 hover:border-white/20 hover:bg-primary/60'}
                            `}
                        >
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                accept="image/*" 
                                onChange={handleLogoUpload} 
                            />
                            
                            {isDragging && (
                                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                                    <div className="w-full h-1 bg-accent/40 shadow-[0_0_15px_#2D89E5] animate-scan-fast"></div>
                                </div>
                            )}

                            <div className={`transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
                                <Upload size={24} className={isDragging ? 'text-accent' : 'text-gray-600 group-hover:text-gray-400'} />
                            </div>
                            <span className={`text-[10px] font-black uppercase transition-colors tracking-widest ${isDragging ? 'text-accent' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                {isDragging ? 'أسقط الشعار هنا' : 'ارفع شعار البراند'}
                            </span>
                        </div>
                        
                        {config.branding?.logo && (
                            <div className="w-28 h-28 rounded-3xl bg-black/60 border border-white/10 p-3 relative group shrink-0 animate-in zoom-in-95 duration-500">
                                <img src={config.branding.logo} className="w-full h-full object-contain filter drop-shadow-md" alt="Logo Preview" />
                                <button 
                                    onClick={() => setConfig({...config, branding: { ...config.branding!, logo: undefined }})}
                                    className="absolute inset-0 bg-red-600/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl scale-95 group-hover:scale-100"
                                >
                                    <X size={24} />
                                    <span className="text-[8px] font-black uppercase mt-1">حذف الشعار</span>
                                </button>
                            </div>
                        )}
                    </div>
               </div>

               <div className="grid grid-cols-3 gap-3 mb-10">
                    {[
                      { id: 'rover', label: 'Rover', icon: Box },
                      { id: 'arm', label: 'Arm', icon: Zap },
                      { id: 'drone', label: 'Drone', icon: Disc },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setConfig({...config, type: type.id as any})}
                        className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-500
                          ${config.type === type.id 
                            ? 'bg-accent/10 border-accent text-white shadow-[0_0_30px_rgba(45,137,229,0.15)]' 
                            : 'bg-primary/50 border-transparent text-gray-600 hover:border-white/10 hover:text-gray-400'}`}
                      >
                        <type.icon size={28} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{type.label}</span>
                      </button>
                    ))}
               </div>

               {/* Core Visualization Engine */}
               <div className="relative aspect-square rounded-[3rem] bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden mb-10 shadow-inner group-hover:border-accent/20 transition-colors">
                   <div className="absolute top-8 left-8 z-20"><Crosshair className="text-accent/30 animate-pulse" size={48} /></div>
                   <div className="absolute top-8 right-8 z-20"><Scan className="text-accent/30" size={32} /></div>
                   <div className="absolute bottom-8 left-8 z-20 text-[9px] font-mono text-white/20 uppercase font-black">System_Link_v2.4</div>
                   
                   <div 
                        className="w-56 h-56 rounded-[3.5rem] border-2 border-white/10 relative shadow-[0_0_60px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-1000 scale-105 group-hover:rotate-1" 
                        style={{ backgroundColor: config.color }}
                   >
                       {config.branding?.logo ? (
                         <div className="w-40 h-40 opacity-50 mix-blend-overlay group-hover:opacity-70 transition-opacity">
                            <img src={config.branding.logo} className="w-full h-full object-contain grayscale brightness-200 contrast-125" alt="Core Logo" />
                         </div>
                       ) : (
                         <Cpu size={80} className="text-white opacity-20 animate-pulse" />
                       )}
                       
                       <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-16 bg-white/10 rounded-full border border-white/5 backdrop-blur-md"></div>
                       <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-16 bg-white/10 rounded-full border border-white/5 backdrop-blur-md"></div>
                   </div>

                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,137,229,0.1)_0%,transparent_70%)] animate-pulse"></div>
               </div>

               {/* Live Performance HUD */}
               <div className="space-y-6">
                  <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 transition-all hover:bg-black/60">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-mono text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                             <Zap size={14} className={totalPower > limits.maxPower * 0.9 ? 'text-red-400' : 'text-highlight'} /> استهلاك الطاقة
                         </span>
                         <span className={`text-[11px] font-mono font-black ${totalPower > limits.maxPower * 0.9 ? 'text-red-400' : 'text-highlight'}`}>{totalPower} / {limits.maxPower} mAh</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px] relative">
                         <div className={`h-full transition-all duration-1000 ease-out ${getStatusColorClass(powerPercent)}`} style={{ width: `${powerPercent}%` }}></div>
                         <div className="absolute top-0 bottom-0 w-[2px] bg-red-500/50" style={{ left: '90%' }}></div>
                      </div>
                  </div>
                  <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 transition-all hover:bg-black/60">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-mono text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                             <Scale size={14} className={totalWeight > limits.maxWeight * 0.9 ? 'text-red-400' : 'text-blue-400'} /> الكتلة الكلية
                         </span>
                         <span className={`text-[11px] font-mono font-black ${totalWeight > limits.maxWeight * 0.9 ? 'text-red-400' : 'text-blue-400'}`}>{totalWeight} / {limits.maxWeight} g</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px] relative">
                         <div className={`h-full transition-all duration-1000 ease-out ${getStatusColorClass(weightPercent)}`} style={{ width: `${weightPercent}%` }}></div>
                         <div className="absolute top-0 bottom-0 w-[2px] bg-red-500/50" style={{ left: '90%' }}></div>
                      </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Panel: Tabbed Modular Module Configuration (Vertical Accordion Style) */}
          <div className="xl:col-span-8 space-y-8">
            {/* Improved Filter Tabs HUD */}
            <div className="bg-[#111418] p-3 rounded-[2.5rem] border border-white/5 flex gap-3 shadow-2xl">
               {(Object.keys(CATEGORY_LABELS) as SensorCategory[]).map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-1 flex items-center justify-center gap-4 py-6 rounded-[2rem] font-black text-xs transition-all uppercase tracking-[0.2em] relative group/btn
                       ${activeCategory === category 
                       ? 'bg-accent text-white shadow-[0_0_30px_rgba(45,137,229,0.3)] scale-[1.02]' 
                       : 'text-gray-600 hover:bg-white/5 hover:text-gray-300'}`}
                  >
                     {React.createElement(CATEGORY_LABELS[category].icon, { size: 18, className: activeCategory === category ? 'animate-pulse' : '' })}
                     {CATEGORY_LABELS[category].label}
                     {activeCategory === category && (
                         <div className="absolute -top-1 -left-1 w-3 h-3 bg-highlight rounded-full border-2 border-[#111418]"></div>
                     )}
                  </button>
               ))}
            </div>

            {/* Modules Vertical Stack (Accordion Style) */}
            <div className="flex flex-col gap-4 min-h-[400px]">
                {SENSORS.filter(s => s.category === activeCategory).map((sensor) => {
                    const isSelected = config.sensors.includes(sensor.id);
                    const isExpanded = expandedSensors.includes(sensor.id);
                    
                    return (
                    <div 
                        key={sensor.id}
                        className={`rounded-[2rem] border-2 transition-all duration-500 overflow-hidden relative group/sensor animate-in zoom-in-95 duration-500
                        ${isSelected ? 'bg-[#15191E] border-accent/40 shadow-xl' : 'bg-primary/40 border-white/5 hover:border-white/20'}`}
                    >
                        {/* Header Row */}
                        <div 
                            className="p-6 flex items-center justify-between cursor-pointer select-none" 
                            onClick={() => toggleSensor(sensor.id)}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                                    ${isSelected ? 'bg-accent text-white shadow-[0_10px_20px_rgba(45,137,229,0.3)]' : 'bg-black text-gray-700 border border-white/5'}`}>
                                    <sensor.icon size={24} />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                                    <div>
                                        <h4 className={`font-black text-base uppercase tracking-tighter ${isSelected ? 'text-white' : 'text-gray-500 group-hover/sensor:text-gray-300'}`}>{sensor.name}</h4>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest hidden md:block">{sensor.desc}</p>
                                    </div>
                                    
                                    {/* Inline Stats */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                                            <Zap size={12} className={isSelected ? 'text-highlight' : ''} />
                                            <span>{sensor.power}mA</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                                            <Scale size={12} className={isSelected ? 'text-blue-400' : ''} />
                                            <span>{sensor.weight}g</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                {/* Status Badge */}
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
                                    ${isSelected ? 'bg-accent/10 border-accent/40 text-accent shadow-[0_0_10px_rgba(45,137,229,0.2)]' : 'bg-black/40 border-white/5 text-gray-600'}`}>
                                    {isSelected ? 'Active' : 'Offline'}
                                </div>

                                {/* Expand/Collapse Trigger */}
                                {isSelected && (
                                    <button 
                                        onClick={(e) => toggleExpansion(e, sensor.id)}
                                        className="p-2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Parameter Control Panel (The Accordion Body) */}
                        {isSelected && isExpanded && (
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-4 duration-500 border-t border-white/5">
                                <div className="pt-6 grid gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-accent text-[9px] font-black uppercase tracking-[0.2em]">
                                            <Settings2 size={14} /> Modular Config: MLQN-{(sensor.id.length + 100).toString(16)}
                                        </div>
                                    </div>
                                    
                                    {sensor.id === 'ultrasonic' && (
                                        <ConfigSlider label="Operational Range" value={config.sensorConfig.ultrasonic?.range || 200} min={50} max={400} unit="cm" onChange={(v: number) => updateSensorConfig('ultrasonic', 'range', v)} />
                                    )}
                                    {sensor.id === 'camera' && (
                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                            <span className="text-[10px] text-gray-600 font-mono uppercase mb-4 block font-black tracking-widest">Image Fidelity</span>
                                            <div className="flex gap-3">
                                                {['720p', '1080p'].map(res => (
                                                    <button 
                                                        key={res} 
                                                        onClick={() => updateSensorConfig('camera', 'resolution', res)} 
                                                        className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all border
                                                        ${config.sensorConfig.camera?.resolution === res ? 'bg-accent border-accent text-white shadow-lg' : 'bg-primary border-white/5 text-gray-600 hover:text-gray-300'}`}
                                                    >
                                                        {res}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {sensor.id === 'imu' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ConfigDropdown 
                                                label="Accelerometer Range" 
                                                value={config.sensorConfig.imu?.accelRange || '4g'} 
                                                options={['2g', '4g', '8g', '16g']} 
                                                onChange={(v: string) => updateSensorConfig('imu', 'accelRange', v)} 
                                            />
                                            <ConfigDropdown 
                                                label="Gyroscope Range" 
                                                value={config.sensorConfig.imu?.gyroRange || '500dps'} 
                                                options={['250dps', '500dps', '1000dps', '2000dps']} 
                                                onChange={(v: string) => updateSensorConfig('imu', 'gyroRange', v)} 
                                            />
                                        </div>
                                    )}
                                    {sensor.id === 'gps' && (
                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                            <span className="text-[10px] text-gray-600 font-mono uppercase mb-4 block font-black tracking-widest">Update Frequency</span>
                                            <div className="flex gap-3">
                                                {['1Hz', '5Hz', '10Hz'].map(rate => (
                                                    <button 
                                                        key={rate} 
                                                        onClick={() => updateSensorConfig('gps', 'updateRate', rate)} 
                                                        className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all border
                                                        ${config.sensorConfig.gps?.updateRate === rate ? 'bg-accent border-accent text-white shadow-lg' : 'bg-primary border-white/5 text-gray-600 hover:text-gray-300'}`}
                                                    >
                                                        {rate}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {sensor.id === 'camera_depth' && (
                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                            <span className="text-[10px] text-gray-600 font-mono uppercase mb-4 block font-black tracking-widest">Depth Technology</span>
                                            <div className="flex gap-3">
                                                {['Stereo', 'ToF'].map(tech => (
                                                    <button 
                                                        key={tech} 
                                                        onClick={() => updateSensorConfig('camera_depth', 'technology', tech)} 
                                                        className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all border
                                                        ${config.sensorConfig.camera_depth?.technology === tech ? 'bg-accent border-accent text-white shadow-lg' : 'bg-primary border-white/5 text-gray-600 hover:text-gray-300'}`}
                                                    >
                                                        {tech}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="text-[8px] font-mono text-white/10 uppercase font-black text-right">
                                        SYSTEM_READY_V2
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    );
                })}
            </div>

            {/* Industrial Advisory HUD */}
            <div className="mt-12 bg-indigo-500/5 border border-indigo-500/20 p-10 rounded-[3rem] flex items-start gap-8 shadow-2xl relative overflow-hidden group/advisory">
               <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/30"></div>
               <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover/advisory:scale-110 transition-transform"><Video size={36} /></div>
               <div>
                 <h4 className="font-black text-indigo-200 text-xl mb-3 tracking-tighter uppercase">AI System Advisory • المعلم الذكي</h4>
                 <p className="text-indigo-300/60 leading-relaxed text-lg font-light">
                   إن تكامل وحدات الرؤية (AI Cam) و LiDAR يزيد بشكل ملحوظ من استهلاك الطاقة الكلي. يُنصح بتحسين سعة البطارية أو الاعتماد على حساسات المسافة للمهام البسيطة لتمديد دورة التشغيل.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Simulation HUD Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-fade-in duration-500">
            <div className="w-full max-w-7xl h-[800px] bg-[#0A0C0F] rounded-[4rem] border border-white/10 flex flex-col overflow-hidden relative shadow-[0_0_150px_rgba(0,0,0,1)]">
                <div className="absolute top-10 right-10 z-50">
                    <button 
                        onClick={() => setIsTestModalOpen(false)} 
                        className="p-5 bg-white/5 hover:bg-red-500/20 text-white rounded-[2rem] transition-all border border-white/10 group flex items-center gap-3"
                    >
                        <X size={24} className="group-hover:text-red-400" />
                        <span className="text-xs font-black uppercase tracking-widest hidden md:block">Close Link</span>
                    </button>
                </div>
                
                <div className="flex-1 relative">
                    <Suspense fallback={<div className="h-full flex flex-col items-center justify-center gap-6"><Loader2 className="animate-spin text-accent" size={64} /><span className="text-gray-500 font-mono text-sm uppercase tracking-widest">Compiling Visuals...</span></div>}>
                        <SimulationViewport config={config} isRunning={true} />
                    </Suspense>
                    
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl px-12 py-4 rounded-full border border-white/10 flex items-center gap-6 text-sm font-black uppercase tracking-[0.4em] text-white shadow-2xl">
                        <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-[0_0_15px_#2D89E5]"></div>
                        Live Telemetry Active • Nominal
                    </div>
                </div>
            </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes scan-fast {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(2800%); }
        }
        .animate-scan-fast {
            animation: scan-fast 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

const ConfigSlider = ({ label, value, min, max, unit, onChange }: any) => (
  <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5">
    <div className="flex justify-between text-[11px] text-gray-500 font-mono font-black uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-accent">{value}{unit}</span>
    </div>
    <input 
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-accent transition-all"
    />
  </div>
);

const ConfigDropdown = ({ label, value, options, onChange }: any) => (
    <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5">
      <label className="text-[11px] text-gray-500 font-mono font-black uppercase tracking-widest block">{label}</label>
      <div className="relative">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-primary border border-white/10 rounded-xl py-3 px-5 text-sm text-white appearance-none focus:border-accent transition-all outline-none font-bold"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt} className="bg-primary text-white">{opt}</option>
          ))}
        </select>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
           <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );

export default RobotBuilder;
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Send, Terminal, Battery, Thermometer, Activity, Bot, Sparkles, FileCode, Loader2, Wrench, Cpu, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronDown, Package, X, GripVertical, MagicWand } from 'lucide-react';
import { SimulationEngine } from '../services/simulationEngine';
import { streamAssistantHelp, translateCommands } from '../services/geminiService';
import { RobotState, RobotSchema, ComponentSchema } from '../types';

const GRID_SIZE = 10;
const DEFAULT_CODE = `// SYSTEM INITIALIZATION
// COMMANDS: FORWARD, BACKWARD, TURN_LEFT, TURN_RIGHT, WAIT

FORWARD
FORWARD
TURN_RIGHT
FORWARD
`;

// Available Components for the Parts Box
const AVAILABLE_COMPONENTS: ComponentSchema[] = [
  { id: 'ultra', type: 'sensor-dist', name: 'حساس مسافة', powerConsumption: 1 },
  { id: 'lidar', type: 'lidar', name: 'ماسح ليزر', powerConsumption: 3 },
  { id: 'cam', type: 'camera', name: 'كاميرا AI', powerConsumption: 4 },
  { id: 'temp', type: 'temp', name: 'حساس حرارة', powerConsumption: 1 },
  { id: 'servo', type: 'motor', name: 'محرك سيرفو', powerConsumption: 2 },
  { id: 'dc', type: 'motor', name: 'محرك DC', powerConsumption: 3 },
];

const INITIAL_ROBOT_CONFIG: RobotSchema = {
  processor: { type: 'standard', position: 'center' },
  slots: {
    front: AVAILABLE_COMPONENTS.find(c => c.id === 'ultra') || null,
    back: null,
    left: AVAILABLE_COMPONENTS.find(c => c.id === 'servo') || null,
    right: AVAILABLE_COMPONENTS.find(c => c.id === 'servo') || null,
  },
  power: {
    totalCapacity: 100,
    current: 100,
    consumptionPerTick: 0.5
  }
};

const Simulator: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [logs, setLogs] = useState<string[]>([]);
  const [robotState, setRobotState] = useState<RobotState>({ x: 0, y: 0, direction: 90 });
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [temperature, setTemperature] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  // Tabs: Editor, Chat, Config
  const [activeTab, setActiveTab] = useState<'editor' | 'chat' | 'config'>('editor');
  
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // AI Command Generator State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  // Robot Configuration State
  const [robotConfig, setRobotConfig] = useState<RobotSchema>(INITIAL_ROBOT_CONFIG);

  // Engine Ref
  const engineRef = useRef<SimulationEngine | null>(null);
  const intervalRef = useRef<number | null>(null);
  const commandsQueueRef = useRef<string[]>([]);

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState<ComponentSchema | null>(null);

  // Initialize Engine
  useEffect(() => {
    initEngine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-initialize engine when config changes (if not running)
  useEffect(() => {
    if (!isRunning) {
        initEngine();
        setLogs(prev => [...prev, '> Robot configuration updated.']);
    }
  }, [robotConfig]);

  const initEngine = () => {
    const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    // Add some obstacles
    initialGrid[3][3] = 'obstacle';
    initialGrid[4][7] = 'obstacle';
    initialGrid[7][2] = 'obstacle';

    engineRef.current = new SimulationEngine(
      robotConfig,
      initialGrid as any,
      { x: 0, y: 0, direction: 90, battery: 100, temperature: 25 }
    );
  };

  const handleRun = async () => {
    if (isRunning && !isPaused) return; // Already running
    if (isPaused) {
      setIsPaused(false);
      runLoop();
      return;
    }

    setLogs(['> System initializing...', '> Parsing commands...']);
    setIsRunning(true);
    
    // Parse Code
    const lines = code.split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('//')); // Simple parser
    
    commandsQueueRef.current = lines;
    
    runLoop();
  };

  const runLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (commandsQueueRef.current.length === 0) {
        handleStop();
        return;
      }

      const cmd = commandsQueueRef.current.shift();
      if (cmd && engineRef.current) {
        const result = engineRef.current.step(cmd);
        
        // Update State
        setRobotState({ x: result.x, y: result.y, direction: result.direction });
        setBatteryLevel(result.battery);
        setTemperature(result.temperature);
        
        // Handle Collision Shake
        if (result.sensors.collision) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400); // Reset shake after 400ms
        }

        if (result.logs.length > 0) {
            setLogs(prev => [...prev, ...result.logs]);
        }
      }
    }, 800); // 800ms per tick
  };

  const handlePause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    commandsQueueRef.current = [];
    setLogs(prev => [...prev, '> Execution finished.']);
  };

  const handleReset = () => {
    handleStop();
    setRobotState({ x: 0, y: 0, direction: 90 });
    setBatteryLevel(100);
    setTemperature(25);
    setLogs(['> System Reset.']);
    initEngine();
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, component: ComponentSchema) => {
    setDraggedItem(component);
    e.dataTransfer.setData('componentId', component.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, slot: 'front' | 'back' | 'left' | 'right') => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData('componentId');
    const component = AVAILABLE_COMPONENTS.find(c => c.id === componentId);
    
    if (component) {
        setRobotConfig(prev => ({
            ...prev,
            slots: {
                ...prev.slots,
                [slot]: component
            }
        }));
    }
    setDraggedItem(null);
  };

  const handleRemovePart = (slot: 'front' | 'back' | 'left' | 'right') => {
      setRobotConfig(prev => ({
          ...prev,
          slots: {
              ...prev.slots,
              [slot]: null
          }
      }));
  };

  // --- AI HANDLERS ---
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
        const stream = await streamAssistantHelp(userMsg, code, { ...robotState, battery: batteryLevel, config: robotConfig });
        
        let fullResponse = "";
        setChatMessages(prev => [...prev, { role: 'model', text: '' }]);
        
        for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
                fullResponse += text;
                setChatMessages(prev => {
                    const newArr = [...prev];
                    newArr[newArr.length - 1].text = fullResponse;
                    return newArr;
                });
            }
        }
    } catch (error) {
        setChatMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال بالمساعد الذكي." }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiGenerating(true);
    try {
      const commands = await translateCommands(aiPrompt);
      if (commands && commands.length > 0) {
        const comment = `\n// AI: ${aiPrompt}\n`;
        const codeBlock = commands.join('\n') + '\n';
        setCode(prev => prev + comment + codeBlock);
        setLogs(prev => [...prev, `> AI generated ${commands.length} commands.`]);
        setAiPrompt('');
        setShowAiInput(false);
      } else {
        setLogs(prev => [...prev, '> AI could not understand the instruction.']);
      }
    } catch (err) {
      setLogs(prev => [...prev, '> Error generating code.']);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Grid Rendering
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isRobot = robotState.x === x && robotState.y === y;
        const isObstacle = ((x === 3 && y === 3) || (x === 7 && y === 4) || (x === 2 && y === 7));
        
        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={`
              w-full h-full border-[0.5px] border-white/5 flex items-center justify-center relative
              ${isObstacle ? 'bg-red-500/20' : 'bg-transparent'}
            `}
          >
            {isRobot && (
              <div 
                className="transition-all duration-500 flex items-center justify-center"
                style={{ transform: `rotate(${robotState.direction - 90}deg)` }} 
              >
                <div className={`${isShaking ? 'animate-shake text-red-500' : 'text-accent'}`}>
                  <Bot size={32} />
                </div>
              </div>
            )}
            {isObstacle && <div className="w-3 h-3 bg-red-500 rounded-sm opacity-50"></div>}
          </div>
        );
      }
    }
    return cells;
  };

  // Helper for Drop Zone
  const renderDropZone = (slot: 'front' | 'back' | 'left' | 'right', label: string, icon: React.ReactNode) => {
    const component = robotConfig.slots[slot];
    
    return (
        <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, slot)}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 h-24 w-24
                ${component 
                    ? 'border-accent bg-accent/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                }
            `}
        >
            {/* Slot Label */}
            <div className={`absolute -top-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm
                 ${component ? 'bg-accent text-white' : 'bg-black border border-white/10 text-gray-500'}
            `}>
                {label}
            </div>

            {component ? (
                <>
                   <button 
                      onClick={() => handleRemovePart(slot)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 z-10"
                   >
                      <X size={12} />
                   </button>
                   <div className="flex flex-col items-center text-center p-1">
                      {component.type.includes('motor') ? <Zap size={20} className="text-yellow-400 mb-1" /> : 
                       component.type.includes('camera') ? <Bot size={20} className="text-blue-400 mb-1" /> :
                       <Activity size={20} className="text-green-400 mb-1" />}
                      <span className="text-[9px] font-bold text-white leading-tight">{component.name}</span>
                      <span className="text-[8px] font-mono text-gray-400 mt-0.5">{component.powerConsumption}⚡</span>
                   </div>
                </>
            ) : (
                <div className="text-gray-600 flex flex-col items-center opacity-50">
                    {icon}
                    <span className="text-[9px] mt-1">فارغ</span>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-primary pt-20 pb-10 px-4 font-sans h-screen flex flex-col">
       <div className="max-w-7xl mx-auto w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Simulator Visualizer */}
          <div className="lg:col-span-7 flex flex-col gap-4 h-full">
              {/* Header */}
              <div className="flex items-center justify-between bg-secondary p-4 rounded-xl border border-white/10">
                 <div className="flex items-center gap-3">
                    <Activity className="text-accent" />
                    <h2 className="text-white font-bold">المحاكي المباشر</h2>
                 </div>
                 <div className="flex gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                       <Battery size={14} className={batteryLevel < 20 ? 'text-red-500' : 'text-green-500'} />
                       <span className="text-white">{Math.round(batteryLevel)}%</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                       <Thermometer size={14} className="text-orange-500" />
                       <span className="text-white">{Math.round(temperature)}°C</span>
                    </div>
                 </div>
              </div>

              {/* Grid */}
              <div className="flex-1 bg-[#0F1216] rounded-xl border border-white/10 p-4 relative overflow-hidden">
                 <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-0">
                    {renderGrid()}
                 </div>
              </div>

              {/* Logs */}
              <div className="h-48 bg-black rounded-xl border border-white/10 p-4 font-mono text-xs overflow-y-auto">
                 <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-white/10 pb-2">
                    <Terminal size={14} />
                    <span>System Logs</span>
                 </div>
                 <div className="space-y-1">
                    {logs.map((log, i) => (
                       <div key={i} className={`text-green-400/80 ${log === 'COLLISION_IMPACT' ? 'text-red-500 font-bold' : ''}`}>{log}</div>
                    ))}
                    <div className="animate-pulse text-accent">_</div>
                 </div>
              </div>
          </div>

          {/* Right Column: Code & Tools */}
          <div className="lg:col-span-5 flex flex-col h-full bg-secondary rounded-xl border border-white/10 overflow-hidden">
             
             {/* Tabs */}
             <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('editor')}
                  className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors
                    ${activeTab === 'editor' ? 'bg-white/5 text-white border-b-2 border-accent' : 'text-gray-400 hover:text-white'}
                  `}
                >
                   <FileCode size={16} />
                   الكود
                </button>
                <button 
                  onClick={() => setActiveTab('config')}
                  className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors
                    ${activeTab === 'config' ? 'bg-white/5 text-white border-b-2 border-accent' : 'text-gray-400 hover:text-white'}
                  `}
                >
                   <Wrench size={16} />
                   تجهيز
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors
                    ${activeTab === 'chat' ? 'bg-white/5 text-white border-b-2 border-accent' : 'text-gray-400 hover:text-white'}
                  `}
                >
                   <Sparkles size={16} />
                   مساعد AI
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 flex flex-col overflow-hidden relative">
                {activeTab === 'editor' && (
                   <>
                     {/* AI Magic Input */}
                     <div className="bg-[#15191e] border-b border-white/5">
                        {!showAiInput ? (
                           <button 
                              onClick={() => setShowAiInput(true)}
                              className="w-full py-2 px-4 flex items-center justify-center gap-2 text-xs text-accent hover:bg-white/5 transition-colors font-medium"
                           >
                              <Sparkles size={14} />
                              اضغط هنا لتوليد الكود باللغة العربية
                           </button>
                        ) : (
                           <form onSubmit={handleGenerateCode} className="p-3 animate-in slide-in-from-top duration-200">
                              <div className="relative">
                                 <input 
                                    type="text" 
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="مثال: تحرك للأمام 3 خطوات ثم لف يمين..."
                                    className="w-full bg-black border border-accent/30 rounded-lg py-2 pl-3 pr-20 text-sm text-white focus:border-accent focus:outline-none"
                                    autoFocus
                                 />
                                 <div className="absolute left-1 top-1 flex items-center gap-1">
                                    <button 
                                       type="submit" 
                                       disabled={isAiGenerating}
                                       className="bg-accent hover:bg-accentHover text-white p-1.5 rounded transition disabled:opacity-50"
                                    >
                                       {isAiGenerating ? <Loader2 size={14} className="animate-spin" /> : <ArrowLeft size={14} />}
                                    </button>
                                    <button 
                                       type="button" 
                                       onClick={() => setShowAiInput(false)}
                                       className="bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white p-1.5 rounded transition"
                                    >
                                       <X size={14} />
                                    </button>
                                 </div>
                              </div>
                           </form>
                        )}
                     </div>

                     <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-[#0d1117] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                        spellCheck={false}
                     />
                     <div className="p-4 bg-secondary border-t border-white/10 flex items-center gap-2">
                        {!isRunning || isPaused ? (
                           <button 
                              onClick={handleRun}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                           >
                              <Play size={18} />
                              {isPaused ? 'استئناف' : 'تشغيل'}
                           </button>
                        ) : (
                           <button 
                              onClick={handlePause}
                              className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                           >
                              <Pause size={18} />
                              إيقاف مؤقت
                           </button>
                        )}
                        
                        <button 
                           onClick={handleReset}
                           className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition"
                        >
                           <RotateCcw size={18} />
                        </button>
                     </div>
                   </>
                )}

                {activeTab === 'config' && (
                    <div className="flex flex-col h-full bg-[#0F1216]">
                        {/* Header Message */}
                        <div className="p-4 border-b border-white/10 bg-secondary/50">
                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                <Package size={14} className="text-accent" />
                                اسحب القطع من الأسفل وأفلتها في مكانها المناسب على هيكل الروبوت.
                            </p>
                        </div>

                        {/* Drag & Drop Area */}
                        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-hidden relative bg-grid">
                            
                            {/* Robot Visual Body (The Drop Target) */}
                            <div className="relative">
                                {/* Connecting Lines */}
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-0"></div>
                                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/10 -z-0"></div>

                                {/* Center (Processor) */}
                                <div className="w-24 h-24 bg-secondary rounded-2xl border-2 border-white/20 flex flex-col items-center justify-center z-10 relative shadow-2xl">
                                    <Cpu size={32} className="text-white mb-2" />
                                    <span className="text-[9px] text-gray-400 font-mono">CORE V2</span>
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                </div>

                                {/* Top Slot (Front) */}
                                <div className="absolute -top-28 left-0">
                                    {renderDropZone('front', 'أمامي', <ArrowUp size={16} />)}
                                </div>

                                {/* Bottom Slot (Back) */}
                                <div className="absolute -bottom-28 left-0">
                                    {renderDropZone('back', 'خلفي', <ArrowDown size={16} />)}
                                </div>

                                {/* Left Slot */}
                                <div className="absolute top-0 -left-28">
                                    {renderDropZone('left', 'يسار', <ArrowLeft size={16} />)}
                                </div>

                                {/* Right Slot */}
                                <div className="absolute top-0 -right-28">
                                    {renderDropZone('right', 'يمين', <ArrowRight size={16} />)}
                                </div>
                            </div>

                        </div>

                        {/* Stats Panel */}
                        <div className="bg-secondary p-3 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-yellow-500" />
                                <span className="text-xs text-gray-300 font-bold">الاستهلاك الكلي:</span>
                                <span className="text-sm font-mono text-white font-bold">
                                    {[robotConfig.slots.front, robotConfig.slots.back, robotConfig.slots.left, robotConfig.slots.right].reduce((acc, slot) => acc + (slot?.powerConsumption || 0), 0) + 0.5} / tick
                                </span>
                            </div>
                        </div>

                        {/* Parts Box (Draggable Source) */}
                        <div className="h-40 bg-[#1A1E24] border-t border-white/10 overflow-y-auto p-4 custom-scrollbar">
                             <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                <Wrench size={12} /> القطع المتاحة (اسحبني)
                             </h4>
                             <div className="flex gap-3 overflow-x-auto pb-2">
                                {AVAILABLE_COMPONENTS.map(component => (
                                    <div 
                                        key={component.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, component)}
                                        className="flex-shrink-0 w-24 bg-primary border border-white/10 rounded-lg p-3 cursor-grab hover:border-accent hover:shadow-lg transition-all active:cursor-grabbing flex flex-col items-center text-center group"
                                    >
                                        <div className="mb-2 text-gray-400 group-hover:text-white transition-colors">
                                            {component.type.includes('motor') ? <Zap size={20} /> : 
                                             component.type.includes('camera') ? <Bot size={20} /> :
                                             <Activity size={20} />}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-300 leading-tight mb-1">{component.name}</span>
                                        <div className="mt-auto flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded">
                                            <Zap size={8} className="text-yellow-500" />
                                            <span className="text-[9px] font-mono text-gray-400">{component.powerConsumption}</span>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'chat' && (
                   <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                         {chatMessages.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">
                               <Bot size={40} className="mx-auto mb-4 opacity-50" />
                               <p className="text-sm">مرحباً! أنا مساعدك الذكي.</p>
                               <p className="text-xs mt-2">يمكنك سؤالي عن الأوامر، أو طلب كتابة كود، أو شرح مشكلة.</p>
                            </div>
                         )}
                         {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed
                                  ${msg.role === 'user' 
                                     ? 'bg-accent text-white rounded-br-none' 
                                     : 'bg-white/10 text-gray-200 rounded-bl-none'
                                  }
                               `}>
                                  {msg.text}
                               </div>
                            </div>
                         ))}
                         {isChatLoading && (
                            <div className="flex justify-start">
                               <div className="bg-white/10 rounded-2xl p-3 rounded-bl-none">
                                  <Loader2 size={16} className="animate-spin text-gray-400" />
                               </div>
                            </div>
                         )}
                      </div>
                      <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/10 flex gap-2">
                         <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="اكتب سؤالك هنا..."
                            className="flex-1 bg-primary border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-accent focus:outline-none"
                         />
                         <button type="submit" disabled={isChatLoading} className="bg-accent hover:bg-accentHover text-white p-2 rounded-lg transition disabled:opacity-50">
                            <Send size={18} />
                         </button>
                      </form>
                   </div>
                )}
             </div>
          </div>

       </div>
    </div>
  );
};

export default Simulator;
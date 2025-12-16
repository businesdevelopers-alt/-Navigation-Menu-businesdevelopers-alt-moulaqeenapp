import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Send, Terminal, Battery, Thermometer, Activity, Bot, Sparkles, FileCode, Loader2, Wrench, Cpu, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronDown, Package } from 'lucide-react';
import { SimulationEngine } from '../services/simulationEngine';
import { streamAssistantHelp } from '../services/geminiService';
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
  { id: 'empty', type: 'empty', name: 'منفذ فارغ', powerConsumption: 0 },
  { id: 'ultra', type: 'sensor-dist', name: 'حساس مسافة (Ultrasonic)', powerConsumption: 1 },
  { id: 'lidar', type: 'lidar', name: 'ماسح ليزر (Lidar)', powerConsumption: 3 },
  { id: 'cam', type: 'camera', name: 'كاميرا ذكية (AI Cam)', powerConsumption: 4 },
  { id: 'temp', type: 'temp', name: 'حساس حرارة (Thermal)', powerConsumption: 1 },
  { id: 'servo', type: 'motor', name: 'محرك سيرفو (Servo)', powerConsumption: 2 },
  { id: 'dc', type: 'motor', name: 'محرك DC قوي', powerConsumption: 3 },
];

const INITIAL_ROBOT_CONFIG: RobotSchema = {
  processor: { type: 'standard', position: 'center' },
  slots: {
    front: AVAILABLE_COMPONENTS.find(c => c.id === 'ultra') || null,
    back: AVAILABLE_COMPONENTS.find(c => c.id === 'empty') || null,
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

  // Robot Configuration State
  const [robotConfig, setRobotConfig] = useState<RobotSchema>(INITIAL_ROBOT_CONFIG);

  // Engine Ref
  const engineRef = useRef<SimulationEngine | null>(null);
  const intervalRef = useRef<number | null>(null);
  const commandsQueueRef = useRef<string[]>([]);

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

  const handleConfigChange = (slot: 'front' | 'back' | 'left' | 'right', componentId: string) => {
    const component = AVAILABLE_COMPONENTS.find(c => c.id === componentId) || null;
    setRobotConfig(prev => ({
        ...prev,
        slots: {
            ...prev.slots,
            [slot]: component
        }
    }));
  };

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
                className={`transition-all duration-500 ${isShaking ? 'animate-shake text-red-500' : 'text-accent'}`}
                style={{ transform: `rotate(${robotState.direction - 90}deg)` }} 
              >
                <Bot size={32} />
              </div>
            )}
            {isObstacle && <div className="w-3 h-3 bg-red-500 rounded-sm opacity-50"></div>}
          </div>
        );
      }
    }
    return cells;
  };

  // Helper for rendering slot selection
  const renderSlotSelector = (label: string, slotKey: 'front' | 'back' | 'left' | 'right', icon: React.ReactNode) => {
      const selectedId = robotConfig.slots[slotKey]?.id || 'empty';
      const selectedComponent = AVAILABLE_COMPONENTS.find(c => c.id === selectedId);

      return (
        <div className="bg-primary p-4 rounded-xl border border-white/10 flex flex-col gap-3 group hover:border-accent/30 transition-colors">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {icon} {label}
               </div>
               {selectedComponent?.type !== 'empty' && (
                   <div className={`w-2 h-2 rounded-full ${selectedComponent?.type === 'motor' ? 'bg-yellow-500' : 'bg-blue-500'} shadow-[0_0_8px_currentColor]`}></div>
               )}
            </div>
            
            <div className="relative">
                <select 
                   className="w-full bg-secondary border border-white/10 text-white text-sm rounded-lg p-3 pl-8 appearance-none focus:border-accent cursor-pointer hover:bg-white/5 transition-colors focus:outline-none"
                   value={selectedId}
                   onChange={(e) => handleConfigChange(slotKey, e.target.value)}
                >
                    {AVAILABLE_COMPONENTS.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.powerConsumption > 0 ? `(${c.powerConsumption}⚡)` : ''}
                        </option>
                    ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown size={14} />
                </div>
            </div>

            <div className="flex justify-between items-center px-1 border-t border-white/5 pt-3 mt-1">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">استهلاك الطاقة</span>
               </div>
               <span className={`text-xs font-mono font-bold ${selectedComponent?.powerConsumption ? 'text-white' : 'text-gray-600'}`}>
                  {selectedComponent?.powerConsumption || 0} <span className="text-[10px] text-gray-500">/tick</span>
               </span>
            </div>
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
                    <div className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar">
                        <div className="mb-6 p-5 bg-gradient-to-br from-secondary to-primary rounded-xl border border-white/10 relative overflow-hidden shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10">
                                <div className="p-1.5 bg-accent/20 rounded-lg">
                                    <Package size={16} className="text-accent" />
                                </div>
                                صندوق القطع (Components Box)
                            </h3>
                            <p className="text-xs text-gray-400 relative z-10 leading-relaxed max-w-md">
                                قم بتخصيص عتاد الروبوت. اختيار محركات أقوى يزيد السرعة ولكن يستهلك البطارية. إضافة حساسات متقدمة يفتح إمكانيات برمجية جديدة.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* Front Slot - Full Width */}
                            <div className="col-span-2">
                                {renderSlotSelector('المنفذ الأمامي (Front)', 'front', <ArrowUp size={14} className="text-accent" />)}
                            </div>
                            
                            {/* Left Slot */}
                            <div>
                                {renderSlotSelector('المنفذ الأيسر (Left)', 'left', <ArrowLeft size={14} className="text-accent" />)}
                            </div>
                            
                            {/* Right Slot */}
                            <div>
                                {renderSlotSelector('المنفذ الأيمن (Right)', 'right', <ArrowRight size={14} className="text-accent" />)}
                            </div>

                            {/* Back Slot - Full Width */}
                            <div className="col-span-2">
                                {renderSlotSelector('المنفذ الخلفي (Back)', 'back', <ArrowDown size={14} className="text-accent" />)}
                            </div>
                        </div>

                        <div className="mt-auto bg-[#0F1216] p-4 rounded-xl border border-white/10 shadow-inner">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-yellow-500" />
                                    <span className="text-xs text-gray-300 font-bold">معدل استهلاك الطاقة</span>
                                </div>
                                <span className="text-sm font-mono text-white font-bold">
                                    {[robotConfig.slots.front, robotConfig.slots.back, robotConfig.slots.left, robotConfig.slots.right].reduce((acc, slot) => acc + (slot?.powerConsumption || 0), 0) + 0.5} / tick
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, ([robotConfig.slots.front, robotConfig.slots.back, robotConfig.slots.left, robotConfig.slots.right].reduce((acc, slot) => acc + (slot?.powerConsumption || 0), 0) + 0.5) * 10)}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 text-right opacity-60">
                                * المعالج يستهلك 0.5 وحدة بشكل ثابت
                            </p>
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
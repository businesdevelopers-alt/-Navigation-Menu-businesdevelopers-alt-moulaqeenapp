import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Send, Terminal, Battery, Thermometer, Activity, Bot, Sparkles, FileCode, Loader2, Wrench, Cpu, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Package, X, Flag, Trophy, AlertTriangle, ChevronsRight, Plus, MessageSquare, HelpCircle, Trash2, Wand2, Copy, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SimulationEngine } from '../services/simulationEngine';
import { streamAssistantHelp, translateCommands } from '../services/geminiService';
import { RobotState, RobotSchema, ComponentSchema } from '../types';

const GRID_SIZE = 10;
const TARGET_POS = { x: 8, y: 2 }; // Goal position for the mission
// Centralized Obstacles Configuration
const OBSTACLES = [
  {x: 3, y: 3}, {x: 4, y: 7}, {x: 7, y: 2}, {x: 2, y: 5}
];

const DEFAULT_CODE = `// Mission: Reach the Green Flag!
// Commands: FORWARD, TURN_RIGHT, TURN_LEFT

FORWARD
FORWARD
TURN_RIGHT
FORWARD
FORWARD`;

// Available Components
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
  // --- STATE ---
  const [code, setCode] = useState(DEFAULT_CODE);
  const [logs, setLogs] = useState<string[]>([]);
  const [robotState, setRobotState] = useState<RobotState>({ x: 0, y: 0, direction: 90 });
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [temperature, setTemperature] = useState(25);
  
  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [missionStatus, setMissionStatus] = useState<'idle' | 'running' | 'success' | 'crash'>('idle');
  const [pathHistory, setPathHistory] = useState<{x: number, y: number}[]>([]);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<'editor' | 'chat' | 'config'>('editor');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  // Robot Config
  const [robotConfig, setRobotConfig] = useState<RobotSchema>(INITIAL_ROBOT_CONFIG);
  const [draggedItem, setDraggedItem] = useState<ComponentSchema | null>(null);

  // Refs
  const engineRef = useRef<SimulationEngine | null>(null);
  const intervalRef = useRef<number | null>(null);
  const commandsQueueRef = useRef<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    initEngine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isRunning) {
        initEngine();
        setLogs(prev => [...prev, '> تم تحديث هيكل الروبوت.']);
    }
  }, [robotConfig]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const initEngine = () => {
    const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    // Set Obstacles from constant
    OBSTACLES.forEach(obs => {
        if (obs.x < GRID_SIZE && obs.y < GRID_SIZE) {
            initialGrid[obs.y][obs.x] = 'obstacle';
        }
    });

    engineRef.current = new SimulationEngine(
      robotConfig,
      initialGrid as any,
      { x: 0, y: 0, direction: 90, battery: 100, temperature: 25 }
    );
    setRobotState({ x: 0, y: 0, direction: 90 });
    setPathHistory([{x: 0, y: 0}]);
    setCurrentAction(null);
  };

  // --- EXECUTION LOGIC ---
  const handleRun = async () => {
    if (isRunning && !isPaused) return; 
    if (isPaused) {
      setIsPaused(false);
      runLoop();
      return;
    }

    // Reset before run
    setMissionStatus('running');
    setLogs(['> جاري تهيئة النظام...', '> تحليل الأكواد...']);
    setIsRunning(true);
    setPathHistory([{x: 0, y: 0}]);
    setCurrentAction(null);
    
    // Check Motors
    if (!robotConfig.slots.left || !robotConfig.slots.right) {
        setLogs(prev => [...prev, 'CRITICAL: المحركات مفقودة! ركب المحركات أولاً.']);
        setMissionStatus('crash');
        setIsRunning(false);
        return;
    }

    // Simple Parse
    const lines = code.split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('//'));
    
    commandsQueueRef.current = lines;
    runLoop();
  };

  const runLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (commandsQueueRef.current.length === 0) {
        handleStop(true); // Finished commands
        return;
      }

      const cmd = commandsQueueRef.current.shift();
      if (cmd && engineRef.current) {
        setCurrentAction(cmd);
        const result = engineRef.current.step(cmd);
        
        setRobotState({ x: result.x, y: result.y, direction: result.direction });
        setBatteryLevel(result.battery);
        setTemperature(result.temperature);
        setPathHistory(prev => [...prev, {x: result.x, y: result.y}]);

        // Check Win Condition
        if (result.x === TARGET_POS.x && result.y === TARGET_POS.y) {
             setMissionStatus('success');
             handleStop(false);
             return;
        }

        // Check Crash/Fail Condition
        if (result.sensors.collision || result.battery <= 0) {
             setMissionStatus('crash');
             handleStop(false);
             return;
        }

        if (result.logs.length > 0) {
            setLogs(prev => [...prev, ...result.logs]);
        }
      }
    }, 800); // 800ms tick for smoother transition observation
  };

  const handleStop = (graceful: boolean) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentAction(null);
    commandsQueueRef.current = [];
    if (graceful && missionStatus !== 'success') {
        setLogs(prev => [...prev, '> انتهى تنفيذ الأوامر.']);
    }
  };

  const handleReset = () => {
    handleStop(false);
    setMissionStatus('idle');
    setBatteryLevel(100);
    setTemperature(25);
    setLogs(['> إعادة ضبط النظام.']);
    setPathHistory([]);
    initEngine();
  };

  // --- EDITOR HELPERS ---
  const insertCommand = (cmd: string) => {
    const newCode = code + (code.endsWith('\n') ? '' : '\n') + cmd + '\n';
    setCode(newCode);
    if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  // --- DRAG & DROP ---
  const handleDragStart = (e: React.DragEvent, component: ComponentSchema) => {
    setDraggedItem(component);
    e.dataTransfer.setData('componentId', component.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent, slot: 'front' | 'back' | 'left' | 'right') => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData('componentId');
    const component = AVAILABLE_COMPONENTS.find(c => c.id === componentId);
    if (component) {
        setRobotConfig(prev => ({ ...prev, slots: { ...prev.slots, [slot]: component } }));
    }
    setDraggedItem(null);
  };

  const handleRemovePart = (slot: 'front' | 'back' | 'left' | 'right') => {
      setRobotConfig(prev => ({ ...prev, slots: { ...prev.slots, [slot]: null } }));
  };

  // --- AI FEATURES ---
  const handleGenerateCode = async (e: React.FormEvent, suggestion?: string) => {
    e.preventDefault();
    const promptToUse = suggestion || aiPrompt;
    if (!promptToUse.trim()) return;
    
    setIsAiGenerating(true);
    try {
      // Pass full simulation context to the AI
      const simulationContext = {
          robotState: { x: robotState.x, y: robotState.y, direction: robotState.direction },
          target: TARGET_POS,
          obstacles: OBSTACLES,
          gridSize: GRID_SIZE
      };

      const commands = await translateCommands(promptToUse, simulationContext);
      
      if (commands && commands.length > 0) {
        const codeBlock = commands.join('\n') + '\n';
        insertCommand(`\n// AI: ${promptToUse}\n` + codeBlock);
        setLogs(prev => [...prev, `> AI generated ${commands.length} commands successfully.`]);
        setAiPrompt('');
        setShowAiInput(false);
      } else {
        setLogs(prev => [...prev, '> AI could not interpret the request.']);
      }
    } catch (err) { 
        setLogs(prev => [...prev, '> Error generating code.']); 
    } finally { 
        setIsAiGenerating(false); 
    }
  };

  const handleChatSubmit = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = customInput || chatInput;
    if (!textToSend.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
        const contextState = {
            ...robotState,
            battery: batteryLevel,
            config: robotConfig
        };

        const stream = await streamAssistantHelp(textToSend, code, contextState);
        
        setChatMessages(prev => [...prev, { role: 'model', text: '' }]);
        let fullResponse = "";
        
        for await (const chunk of stream) {
            if (chunk.text) {
                fullResponse += chunk.text;
                setChatMessages(prev => {
                    const newArr = [...prev];
                    newArr[newArr.length - 1].text = fullResponse;
                    return newArr;
                });
            }
        }
    } catch (error) { 
        setChatMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى." }]); 
    } finally { 
        setIsChatLoading(false); 
    }
  };

  const handleQuickAction = (action: string) => {
      let prompt = "";
      switch(action) {
          case 'analyze': prompt = "هل يمكنك تحليل الكود الخاص بي واكتشاف أي أخطاء محتملة؟"; break;
          case 'design': prompt = "كيف يمكنني تحسين تصميم الروبوت الحالي بناءً على المكونات المركبة؟"; break;
          case 'explain': prompt = "اشرح لي أوامر الحركة المتاحة (FORWARD, BACKWARD, etc.) وكيفية استخدامها."; break;
          default: return;
      }
      handleChatSubmit(undefined, prompt);
  };

  // Simple Markdown Parser for Code Blocks
  const renderMessageText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const codeContent = part.replace(/```\w*\n?/, '').replace(/```$/, '');
        return (
          <div key={index} className="my-3 rounded-lg bg-black/50 border border-white/10 overflow-hidden shadow-sm dir-ltr text-left">
             <div className="bg-white/5 px-3 py-1.5 text-[10px] text-gray-500 border-b border-white/5 flex justify-between items-center select-none">
                 <span className="font-mono">Code Snippet</span>
                 <button onClick={() => {
                     navigator.clipboard.writeText(codeContent);
                 }} className="hover:text-white transition flex items-center gap-1 cursor-pointer">
                    <span className="text-[10px]">نسخ</span>
                 </button>
             </div>
             <pre className="p-3 overflow-x-auto custom-scrollbar font-mono text-xs text-emerald-400 bg-[#0c0c0c]">
               <code>{codeContent}</code>
             </pre>
          </div>
        );
      }
      // Handle simple bolding **text**
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={index}>
            {boldParts.map((subPart, subIndex) => {
                if (subPart.startsWith('**') && subPart.endsWith('**')) {
                    return <strong key={subIndex} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
                }
                return subPart;
            })}
        </span>
      );
    });
  };

  // --- RENDERING ---
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isTarget = TARGET_POS.x === x && TARGET_POS.y === y;
        // Check Obstacles Array
        const isObstacle = OBSTACLES.some(obs => obs.x === x && obs.y === y);
        const isPath = pathHistory.some(p => p.x === x && p.y === y);
        
        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={`
              w-full h-full border-[0.5px] border-white/5 flex items-center justify-center relative transition-colors duration-300
              ${isObstacle ? 'bg-red-500/10 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]' : ''}
              ${isTarget ? 'bg-green-500/10 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)]' : ''}
              ${isPath ? 'bg-accent/5' : ''}
            `}
          >
            {isPath && <div className="w-1.5 h-1.5 rounded-full bg-accent/30 animate-in zoom-in"></div>}
            
            {isObstacle && (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-500/20 rounded-md border border-red-500/40 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}
            
            {isTarget && (
                <div className="flex flex-col items-center justify-center opacity-80 animate-bounce">
                    <Flag size={20} className="text-green-500 fill-green-500/30" />
                </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  const renderDropZone = (slot: 'front' | 'back' | 'left' | 'right', label: string, icon: React.ReactNode) => {
    const component = robotConfig.slots[slot];
    return (
        <div 
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
            onDrop={(e) => handleDrop(e, slot)}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 h-24 w-24 group
                ${component 
                    ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(45,137,229,0.15)]' 
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                }
            `}
        >
            <div className={`absolute -top-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm
                 ${component ? 'bg-accent text-white' : 'bg-black border border-white/10 text-gray-500'}
            `}>
                {label}
            </div>

            {component ? (
                <>
                   <button 
                      onClick={() => handleRemovePart(slot)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <X size={10} />
                   </button>
                   <div className="flex flex-col items-center text-center p-1 animate-in zoom-in-95">
                      {component.type.includes('motor') ? <Zap size={24} className="text-yellow-400 mb-1" /> : 
                       component.type.includes('camera') ? <Bot size={24} className="text-blue-400 mb-1" /> :
                       <Activity size={24} className="text-green-400 mb-1" />}
                      <span className="text-[9px] font-bold text-white leading-tight">{component.name}</span>
                   </div>
                </>
            ) : (
                <div className="text-gray-600 flex flex-col items-center opacity-40 group-hover:opacity-80 transition-opacity">
                    {icon}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-primary pt-20 pb-6 px-4 font-sans h-screen flex flex-col overflow-hidden">
       <div className="max-w-7xl mx-auto w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* Left Column: Simulator Visualizer */}
          <div className="lg:col-span-7 flex flex-col gap-4 h-full relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between bg-secondary p-4 rounded-xl border border-white/10 shadow-lg">
                 <div className="flex items-center gap-3">
                    <Activity className="text-accent" />
                    <div>
                        <h2 className="text-white font-bold leading-none">مهمة: الوصول للعلم</h2>
                        <span className="text-[10px] text-gray-400">الإحداثيات: {robotState.x}, {robotState.y}</span>
                    </div>
                 </div>
                 <div className="flex gap-4 items-center">
                    <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-300 border border-white/5 transition">
                        <LayoutDashboard size={14} />
                        لوحة التحكم
                    </Link>
                    <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                    <div className="flex gap-4 text-xs font-mono">
                        <div className="flex flex-col bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 min-w-[110px]">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                                <Battery size={12} className={batteryLevel < 20 ? 'text-red-500 animate-pulse' : 'text-gray-400'} />
                                <span className="text-[10px] text-gray-400">طاقة</span>
                            </div>
                            <span className={`text-[10px] font-bold ${batteryLevel < 20 ? 'text-red-500' : 'text-white'}`}>{Math.round(batteryLevel)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${
                                    batteryLevel < 20 ? 'bg-red-500' : 
                                    batteryLevel <= 50 ? 'bg-yellow-500' : 
                                    'bg-green-500'
                                }`} 
                                style={{ width: `${Math.max(0, Math.min(100, batteryLevel))}%` }}
                            ></div>
                        </div>
                        </div>
                        <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                        <Thermometer size={14} className="text-orange-500" />
                        <span className="text-white">{Math.round(temperature)}°C</span>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Grid Container */}
              <div className="flex-1 bg-[#0F1216] rounded-xl border border-white/10 p-6 relative overflow-hidden flex items-center justify-center shadow-inner">
                 <div className="relative aspect-square h-full max-h-[500px] w-full max-w-[500px]">
                    {/* Grid Background */}
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1">
                        {renderGrid()}
                    </div>

                    {/* Robot Layer - Absolute Positioning for Smooth Transition */}
                    <div 
                        className="absolute w-[10%] h-[10%] flex items-center justify-center transition-all duration-500 ease-in-out z-20"
                        style={{
                            left: `${robotState.x * 10}%`,
                            top: `${robotState.y * 10}%`,
                            transform: `rotate(${robotState.direction}deg)` // Assumes 0 is Up, 90 is Right
                        }}
                    >
                         {/* Visual Feedback Bubble */}
                        {currentAction && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap animate-in fade-in zoom-in duration-200 z-30 border border-white/20">
                                {currentAction}
                            </div>
                        )}

                        <div className={`filter drop-shadow-[0_0_8px_rgba(45,137,229,0.5)] ${missionStatus === 'crash' ? 'text-red-500 animate-shake' : 'text-accent'}`}>
                            <Bot size={36} strokeWidth={1.5} />
                        </div>
                        {/* Head Light - Always relative to robot direction */}
                        <div className="absolute -top-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
                    </div>
                 </div>

                 {/* Success Overlay */}
                 {missionStatus === 'success' && (
                     <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                         <div className="bg-secondary border border-green-500/30 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] transform animate-in zoom-in-95 duration-300">
                             <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                                 <Trophy size={40} />
                             </div>
                             <h2 className="text-3xl font-bold text-white mb-2">مهمة ناجحة!</h2>
                             <p className="text-gray-300 mb-6">أحسنت! وصل الروبوت إلى الهدف بسلام.</p>
                             <div className="flex gap-3 justify-center">
                                 <button onClick={handleReset} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition">
                                     محاولة أخرى
                                 </button>
                             </div>
                         </div>
                     </div>
                 )}

                 {/* Crash Overlay */}
                 {missionStatus === 'crash' && (
                     <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                         <div className="bg-secondary border border-red-500/30 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] transform animate-in zoom-in-95 duration-300">
                             <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                 <AlertTriangle size={40} />
                             </div>
                             <h2 className="text-3xl font-bold text-white mb-2">فشلت المهمة</h2>
                             <p className="text-gray-300 mb-6">تحطم الروبوت أو نفدت البطارية. تأكد من مسارك!</p>
                             <button onClick={handleReset} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition">
                                 إعادة المحاولة
                             </button>
                         </div>
                     </div>
                 )}
              </div>

              {/* Logs */}
              <div className="h-40 bg-black rounded-xl border border-white/10 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                 <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-white/10 pb-2">
                    <Terminal size={14} />
                    <span>System Output</span>
                 </div>
                 <div className="space-y-1">
                    {logs.map((log, i) => (
                       <div key={i} className={`font-medium ${log.includes('CRITICAL') ? 'text-red-500' : log.includes('AI') ? 'text-purple-400' : 'text-green-400/80'}`}>
                           <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                           {log}
                       </div>
                    ))}
                    <div className="animate-pulse text-accent">_</div>
                 </div>
              </div>
          </div>

          {/* Right Column: Code & Tools */}
          <div className="lg:col-span-5 flex flex-col h-full bg-secondary rounded-xl border border-white/10 overflow-hidden shadow-2xl">
             
             {/* Tabs Header */}
             <div className="flex border-b border-white/10 bg-black/20">
                <button 
                  onClick={() => setActiveTab('editor')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative
                    ${activeTab === 'editor' ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                   <FileCode size={16} />
                   المحرر
                   {activeTab === 'editor' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('config')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative
                    ${activeTab === 'config' ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                   <Wrench size={16} />
                   التجهيز
                   {activeTab === 'config' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative
                    ${activeTab === 'chat' ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                   <Sparkles size={16} />
                   المساعد
                   {activeTab === 'chat' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></div>}
                </button>
             </div>

             {/* Content Area */}
             <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* EDITOR TAB */}
                {activeTab === 'editor' && (
                   <>
                     {/* Quick Actions Toolbar */}
                     <div className="bg-[#15191e] border-b border-white/5 p-2 flex gap-2 overflow-x-auto no-scrollbar">
                        {[
                            { label: 'أمام', cmd: 'FORWARD', icon: ArrowUp },
                            { label: 'خلف', cmd: 'BACKWARD', icon: ArrowDown },
                            { label: 'يمين', cmd: 'TURN_RIGHT', icon: ArrowRight },
                            { label: 'يسار', cmd: 'TURN_LEFT', icon: ArrowLeft },
                            { label: 'انتظر', cmd: 'WAIT', icon: Pause },
                        ].map((action, idx) => (
                            <button 
                                key={idx}
                                onClick={() => insertCommand(action.cmd)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition whitespace-nowrap"
                            >
                                <action.icon size={12} />
                                {action.label}
                            </button>
                        ))}
                        <div className="w-px h-6 bg-white/10 mx-1"></div>
                        <button 
                            onClick={() => setShowAiInput(!showAiInput)}
                            className={`px-3 py-1.5 border border-transparent rounded-lg text-xs flex items-center gap-1.5 transition whitespace-nowrap font-bold
                                ${showAiInput ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-purple-400 hover:bg-purple-500/10'}
                            `}
                        >
                            <Sparkles size={12} />
                            توليد ذكي
                        </button>
                     </div>

                     {/* AI Input */}
                     {showAiInput && (
                        <div className="p-4 bg-purple-900/10 border-b border-purple-500/20 animate-in slide-in-from-top duration-200">
                             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-300">
                                <Bot size={14} />
                                <span>المولد الذكي (Context Aware)</span>
                             </div>
                             <form onSubmit={(e) => handleGenerateCode(e)} className="relative">
                                 <input 
                                    type="text" 
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="مثال: وصلني للعلم وتجنب العقبات"
                                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg py-3 pl-3 pr-24 text-sm text-white focus:border-purple-400 focus:outline-none shadow-inner"
                                    autoFocus
                                 />
                                 <button 
                                    type="submit" 
                                    disabled={isAiGenerating}
                                    className="absolute left-1 top-1.5 bottom-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3 rounded-md transition disabled:opacity-50 flex items-center gap-1 text-xs font-bold"
                                 >
                                    {isAiGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                    توليد
                                 </button>
                             </form>
                             <div className="flex flex-wrap gap-2 mt-2">
                                 <button onClick={(e) => handleGenerateCode(e as any, "وصلني للعلم")} className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded hover:bg-purple-500/30 transition border border-purple-500/10">🎯 وصلني للعلم</button>
                                 <button onClick={(e) => handleGenerateCode(e as any, "ارسم مربع")} className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded hover:bg-purple-500/30 transition border border-purple-500/10">⏹ ارسم مربع</button>
                             </div>
                        </div>
                     )}

                     <textarea 
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-[#0d1117] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-accent/30"
                        spellCheck={false}
                     />
                     
                     <div className="p-4 bg-secondary border-t border-white/10 flex items-center gap-3">
                        {!isRunning || isPaused ? (
                           <button 
                              onClick={handleRun}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-green-900/20 active:scale-[0.98]"
                           >
                              <Play size={20} fill="currentColor" />
                              {isPaused ? 'استئناف المهمة' : 'تشغيل الكود'}
                           </button>
                        ) : (
                           <button 
                              onClick={() => setIsPaused(true)}
                              className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                           >
                              <Pause size={20} fill="currentColor" />
                              إيقاف مؤقت
                           </button>
                        )}
                        
                        <button 
                           onClick={handleReset}
                           className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition hover:border-white/30"
                           title="إعادة ضبط"
                        >
                           <RotateCcw size={20} />
                        </button>
                     </div>
                   </>
                )}

                {/* CONFIG TAB */}
                {activeTab === 'config' && (
                    <div className="flex flex-col h-full bg-[#0F1216]">
                        <div className="p-4 border-b border-white/10 bg-secondary/50">
                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                <Package size={14} className="text-accent" />
                                اسحب القطع من الأسفل لتركيبها. تحتاج لمحركات للحركة!
                            </p>
                        </div>

                        {/* Interactive Blueprint Area */}
                        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-hidden relative bg-grid">
                            
                            <div className="relative animate-in zoom-in-95 duration-500">
                                {/* Chassis Lines */}
                                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                                {/* Central Core */}
                                <div className="w-28 h-28 bg-[#1A1E24] rounded-2xl border border-white/20 flex flex-col items-center justify-center z-10 relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <Cpu size={32} className="text-white/80 mb-1" />
                                    <span className="text-[10px] text-gray-500 font-mono tracking-widest">MULAQQEN V2</span>
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                                    </div>
                                </div>

                                {/* Drop Zones */}
                                <div className="absolute -top-32 left-2">{renderDropZone('front', 'مقدمة', <ArrowUp size={20} />)}</div>
                                <div className="absolute -bottom-32 left-2">{renderDropZone('back', 'مؤخرة', <ArrowDown size={20} />)}</div>
                                <div className="absolute top-2 -left-32">{renderDropZone('left', 'محرك أيسر', <ArrowLeft size={20} />)}</div>
                                <div className="absolute top-2 -right-32">{renderDropZone('right', 'محرك أيمن', <ArrowRight size={20} />)}</div>
                            </div>
                        </div>

                        {/* Inventory Drawer */}
                        <div className="h-44 bg-[#15191E] border-t border-white/10 p-4">
                             <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                                    <Wrench size={12} /> المخزون
                                </h4>
                                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                                    الاستهلاك: <span className="text-white font-bold">{[robotConfig.slots.front, robotConfig.slots.back, robotConfig.slots.left, robotConfig.slots.right].reduce((acc, slot) => acc + (slot?.powerConsumption || 0), 0) + 0.5}</span> واط
                                </span>
                             </div>
                             <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                {AVAILABLE_COMPONENTS.map(component => (
                                    <div 
                                        key={component.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, component)}
                                        className="flex-shrink-0 w-24 bg-[#0F1216] border border-white/10 rounded-xl p-3 cursor-grab hover:border-accent hover:shadow-[0_0_15px_rgba(45,137,229,0.15)] transition-all active:cursor-grabbing flex flex-col items-center text-center group"
                                    >
                                        <div className="mb-2 text-gray-500 group-hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                                            {component.type.includes('motor') ? <Zap size={18} /> : 
                                             component.type.includes('camera') ? <Bot size={18} /> :
                                             <Activity size={18} />}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-300 leading-tight mb-1">{component.name}</span>
                                        <div className="mt-auto flex items-center gap-1">
                                            <span className="text-[9px] font-mono text-gray-500">{component.powerConsumption}⚡</span>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {/* CHAT TAB */}
                {activeTab === 'chat' && (
                   <div className="flex flex-col h-full bg-[#0F1216]">
                      {/* Header with Clear Action */}
                      {chatMessages.length > 0 && (
                          <div className="p-2 border-b border-white/5 flex justify-end">
                              <button 
                                onClick={() => setChatMessages([])}
                                className="text-[10px] text-gray-500 hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition"
                              >
                                  <Trash2 size={12} />
                                  مسح المحادثة
                              </button>
                          </div>
                      )}

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                         {chatMessages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 opacity-80 animate-in fade-in zoom-in duration-500">
                               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                                    <Bot size={32} className="text-accent" />
                               </div>
                               <p className="text-sm font-bold text-white mb-2">مساعد مُلَقّن الذكي</p>
                               <p className="text-xs leading-relaxed max-w-[250px] mx-auto mb-6">
                                  اسألني عن الأكواد، أو اطلب مني شرحاً للمكونات، أو ساعدني في حل مشكلة برمجية.
                               </p>
                               
                               <div className="grid grid-cols-1 gap-2 w-full max-w-[260px]">
                                   <button 
                                      onClick={() => handleQuickAction('analyze')}
                                      className="text-xs bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg py-2.5 px-3 text-left transition flex items-center gap-2 group"
                                   >
                                      <FileCode size={14} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                      اكتشف الأخطاء في الكود
                                   </button>
                                   <button 
                                      onClick={() => handleQuickAction('design')}
                                      className="text-xs bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg py-2.5 px-3 text-left transition flex items-center gap-2 group"
                                   >
                                      <Cpu size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                      تحسين تصميم الروبوت
                                   </button>
                                   <button 
                                      onClick={() => handleQuickAction('explain')}
                                      className="text-xs bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg py-2.5 px-3 text-left transition flex items-center gap-2 group"
                                   >
                                      <HelpCircle size={14} className="text-green-400 group-hover:scale-110 transition-transform" />
                                      شرح الأوامر المتاحة
                                   </button>
                               </div>
                            </div>
                         )}
                         
                         {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                                  ${msg.role === 'user' 
                                     ? 'bg-accent text-white rounded-br-none' 
                                     : 'bg-[#1A1E24] border border-white/10 text-gray-200 rounded-bl-none'
                                  }
                               `}>
                                  {msg.role === 'model' ? renderMessageText(msg.text) : msg.text}
                               </div>
                            </div>
                         ))}
                         
                         {isChatLoading && (
                            <div className="flex justify-start">
                               <div className="bg-white/5 rounded-2xl p-3 rounded-bl-none flex gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                               </div>
                            </div>
                         )}
                         <div ref={chatEndRef}></div>
                      </div>

                      {/* Input Area */}
                      <form onSubmit={(e) => handleChatSubmit(e)} className="p-4 bg-secondary border-t border-white/10 flex gap-2">
                         <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="اكتب سؤالك هنا..."
                            disabled={isChatLoading}
                            className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
                         />
                         <button 
                            type="submit" 
                            disabled={isChatLoading || !chatInput.trim()} 
                            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition disabled:opacity-50 border border-white/5"
                         >
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
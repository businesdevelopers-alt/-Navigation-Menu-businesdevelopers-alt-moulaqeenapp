import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Send, Terminal, Battery, Thermometer, Activity, Bot, Sparkles, FileCode, Loader2, Wrench, Cpu, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Package, X, Flag, Trophy, AlertTriangle, ChevronsRight, Plus, MessageSquare, HelpCircle, Trash2, Wand2, Copy, LayoutDashboard, MousePointer2, GripHorizontal, Save, Download, Filter, Info, AlertOctagon, User, Settings, ScanEye, Cog } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SimulationEngine } from '../services/simulationEngine';
import { streamAssistantHelp, translateCommands } from '../services/geminiService';
import { RobotState, RobotSchema, ComponentSchema } from '../types';

const GRID_SIZE = 10;
const TARGET_POS = { x: 8, y: 2 }; 
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

interface ConfigIssue {
    location: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
}

interface CommandSource {
    text: string;
    lineIndex: number;
}

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
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [failedLineIndex, setFailedLineIndex] = useState<number | null>(null);

  // Visual Effects State
  const [collisionCell, setCollisionCell] = useState<{x: number, y: number} | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<'editor' | 'chat' | 'config'>('editor');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [partsFilter, setPartsFilter] = useState<'all' | 'motor' | 'sensor'>('all');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Robot Config
  const [robotConfig, setRobotConfig] = useState<RobotSchema>(INITIAL_ROBOT_CONFIG);
  const [draggedItem, setDraggedItem] = useState<ComponentSchema | null>(null);
  const [configIssues, setConfigIssues] = useState<ConfigIssue[]>([]);

  // Refs
  const engineRef = useRef<SimulationEngine | null>(null);
  const intervalRef = useRef<number | null>(null);
  const commandsQueueRef = useRef<CommandSource[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isRestoringRef = useRef(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    initEngine();
  }, []);

  useEffect(() => {
    if (!isRunning) {
        if (isRestoringRef.current) {
            isRestoringRef.current = false;
            return;
        }
        initEngine();
        setLogs(prev => [...prev, '> تم تحديث هيكل الروبوت.']);
    }
    analyzeConfig();
  }, [robotConfig]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isStreaming, isChatLoading]);

  useEffect(() => {
    if (aiFeedback) {
      const timer = setTimeout(() => setAiFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [aiFeedback]);

  const initEngine = () => {
    const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
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
    setCollisionCell(null);
    setActiveLineIndex(null);
    setFailedLineIndex(null);
  };

  const analyzeConfig = () => {
      const issues: ConfigIssue[] = [];
      const { slots } = robotConfig;
      const totalPower = [slots.front, slots.back, slots.left, slots.right].reduce((acc, c) => acc + (c?.powerConsumption || 0), 0) + 0.5;
      
      if (totalPower > 8) issues.push({ location: 'center', severity: 'critical', message: 'System Overload! High Power Consumption.' });
      else if (totalPower > 6) issues.push({ location: 'center', severity: 'warning', message: 'Power consumption is high.' });
      else issues.push({ location: 'center', severity: 'info', message: 'Power levels nominal.' });

      if (!slots.left) issues.push({ location: 'left', severity: 'critical', message: 'Missing Left Motor. Cannot turn or move properly.' });
      if (!slots.right) issues.push({ location: 'right', severity: 'critical', message: 'Missing Right Motor. Cannot turn or move properly.' });
      if (!slots.front) issues.push({ location: 'front', severity: 'warning', message: 'No front sensor. High risk of collision.' });

      setConfigIssues(issues);
  };

  const getIssueForLocation = (loc: string) => configIssues.find(i => i.location === loc);

  const handleSaveState = () => {
      const state = { robotConfig, robotState, batteryLevel, temperature, code, pathHistory, timestamp: new Date().toISOString() };
      try {
        localStorage.setItem('mulaqqen_simulator_state', JSON.stringify(state));
        setLogs(prev => [...prev, '> تم حفظ حالة المحاكي بنجاح.']);
      } catch (e) {
        setLogs(prev => [...prev, '> فشل حفظ الحالة. قد تكون المساحة ممتلئة.']);
      }
  };

  const handleLoadState = () => {
      const saved = localStorage.getItem('mulaqqen_simulator_state');
      if (!saved) {
          setLogs(prev => [...prev, '> لا توجد حالة محفوظة مسبقاً.']);
          return;
      }
      try {
          const parsed = JSON.parse(saved);
          isRestoringRef.current = true;
          setRobotConfig(parsed.robotConfig);
          setRobotState(parsed.robotState);
          setBatteryLevel(parsed.batteryLevel);
          setTemperature(parsed.temperature);
          setCode(parsed.code);
          setPathHistory(parsed.pathHistory || []);
          initEngine();
          setLogs(prev => [...prev, '> تم استعادة الحالة المحفوظة بنجاح.']);
      } catch (err) {
          setLogs(prev => [...prev, '> خطأ أثناء استعادة الحالة. الملف تالف.']);
      }
  };

  const handleRun = async () => {
    if (isRunning && !isPaused) return; 
    if (isPaused) {
      setIsPaused(false);
      runLoop();
      return;
    }

    setMissionStatus('running');
    setLogs(['> جاري تهيئة النظام...', '> تحليل الأكواد...']);
    setIsRunning(true);
    setPathHistory([{x: 0, y: 0}]);
    setCurrentAction(null);
    setCollisionCell(null);
    setFailedLineIndex(null);
    
    if (!robotConfig.slots.left || !robotConfig.slots.right) {
        setLogs(prev => [...prev, 'CRITICAL: المحركات مفقودة! ركب المحركات أولاً.']);
        setMissionStatus('crash');
        setIsRunning(false);
        return;
    }

    const commandSources: CommandSource[] = code.split('\n').map((text, idx) => ({
        text: text.trim(),
        lineIndex: idx
    })).filter(cmd => cmd.text && !cmd.text.startsWith('//'));
    
    commandsQueueRef.current = commandSources;
    runLoop();
  };

  const runLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (commandsQueueRef.current.length === 0) {
        handleStop(true);
        return;
      }

      const cmdSource = commandsQueueRef.current.shift();
      if (cmdSource && engineRef.current) {
        setCurrentAction(cmdSource.text);
        setActiveLineIndex(cmdSource.lineIndex);
        
        const result = engineRef.current.step(cmdSource.text);
        setRobotState({ x: result.x, y: result.y, direction: result.direction });
        setBatteryLevel(result.battery);
        setTemperature(result.temperature);
        setPathHistory(prev => [...prev, {x: result.x, y: result.y}]);

        if (result.collisionPoint) {
            setCollisionCell(result.collisionPoint);
            setTimeout(() => setCollisionCell(null), 400);
        }

        if (result.x === TARGET_POS.x && result.y === TARGET_POS.y) {
             setMissionStatus('success');
             handleStop(false);
             return;
        }

        if (result.sensors.collision || result.battery <= 0) {
             setMissionStatus('crash');
             setFailedLineIndex(cmdSource.lineIndex);
             handleStop(false);
             return;
        }

        if (result.logs.length > 0) setLogs(prev => [...prev, ...result.logs]);
      }
    }, 800);
  };

  const handleStop = (graceful: boolean) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentAction(null);
    setActiveLineIndex(null);
    commandsQueueRef.current = [];
    if (graceful && missionStatus !== 'success') setLogs(prev => [...prev, '> انتهى تنفيذ الأوامر.']);
  };

  const handleReset = () => {
    handleStop(false);
    setMissionStatus('idle');
    setBatteryLevel(100);
    setTemperature(25);
    setLogs(['> إعادة ضبط النظام.']);
    setPathHistory([]);
    setCollisionCell(null);
    setFailedLineIndex(null);
    initEngine();
  };

  const insertCommand = (cmd: string) => {
    const newCode = code + (code.endsWith('\n') ? '' : '\n') + cmd + '\n';
    setCode(newCode);
    if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  const handleDragStart = (e: React.DragEvent, component: ComponentSchema) => {
    setDraggedItem(component);
    e.dataTransfer.setData('componentId', component.id);
  };

  const handleDrop = (e: React.DragEvent, slot: 'front' | 'back' | 'left' | 'right') => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData('componentId');
    const component = AVAILABLE_COMPONENTS.find(c => c.id === componentId);
    if (component) setRobotConfig(prev => ({ ...prev, slots: { ...prev.slots, [slot]: component } }));
    setDraggedItem(null);
  };

  const handleGenerateCode = async (e: React.FormEvent, suggestion?: string) => {
    e.preventDefault();
    const promptToUse = suggestion || aiPrompt;
    if (!promptToUse.trim()) return;
    
    setIsAiGenerating(true);
    try {
      const simulationContext = { robotState, target: TARGET_POS, obstacles: OBSTACLES, gridSize: GRID_SIZE };
      const commands = await translateCommands(promptToUse, simulationContext);
      
      if (commands && commands.length > 0) {
        if (isRunning && !isPaused) {
             const newCommands = commands.map(c => ({ text: c, lineIndex: -1 }));
             commandsQueueRef.current = [...commandsQueueRef.current, ...newCommands];
             setAiFeedback(`🤖 تم إضافة ${commands.length} أوامر للمحاكي!`);
             setAiPrompt('');
        } else {
             const codeBlock = commands.join('\n') + '\n';
             insertCommand(`\n// AI: ${promptToUse}\n` + codeBlock);
             setAiFeedback(`✅ تم توليد الكود بنجاح`);
             setAiPrompt('');
             setShowAiInput(false);
        }
      }
    } catch (err) { setAiFeedback(`❌ حدث خطأ`); } finally { setIsAiGenerating(false); }
  };

  const handleChatSubmit = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = customInput || chatInput;
    if (!textToSend.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    if (!customInput) setChatInput('');
    setIsChatLoading(true);

    try {
        const contextState = { ...robotState, battery: batteryLevel, config: robotConfig };
        const stream = await streamAssistantHelp(textToSend, code, contextState);
        setIsChatLoading(false);
        setIsStreaming(true);
        setChatMessages(prev => [...prev, { role: 'model', text: '' }]);
        let fullResponse = "";
        for await (const chunk of stream) {
            if (chunk.text) {
                fullResponse += chunk.text;
                setChatMessages(prev => {
                    const newArr = [...prev];
                    newArr[newArr.length - 1] = { ...newArr[newArr.length - 1], text: fullResponse };
                    return newArr;
                });
            }
        }
    } catch (error) { setChatMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى." }]); } finally { setIsChatLoading(false); setIsStreaming(false); }
  };

  const getActionIcon = (cmd: string) => {
    switch(cmd) {
        case 'FORWARD': return <ArrowUp size={14} />;
        case 'BACKWARD': return <ArrowDown size={14} />;
        case 'TURN_RIGHT': return <ArrowRight size={14} />;
        case 'TURN_LEFT': return <ArrowLeft size={14} />;
        case 'WAIT': return <Pause size={14} />;
        default: return <Activity size={14} />;
    }
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const codeContent = part.replace(/```\w*\n?/, '').replace(/```$/, '');
        return (
          <div key={index} className="my-3 rounded-lg bg-black/50 border border-white/10 overflow-hidden shadow-sm dir-ltr text-left">
             <div className="bg-white/5 px-3 py-1.5 text-[10px] text-gray-500 border-b border-white/5 flex justify-between items-center">
                 <span className="font-mono">Code Snippet</span>
                 <button onClick={() => navigator.clipboard.writeText(codeContent)} className="hover:text-white transition flex items-center gap-1 cursor-pointer">
                    <span className="text-[10px]">نسخ</span>
                 </button>
             </div>
             <pre className="p-3 overflow-x-auto custom-scrollbar font-mono text-xs text-emerald-400 bg-[#0c0c0c]">
               <code>{codeContent}</code>
             </pre>
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isTarget = TARGET_POS.x === x && TARGET_POS.y === y;
        const isObstacle = OBSTACLES.some(obs => obs.x === x && obs.y === y);
        const isPath = pathHistory.some(p => p.x === x && p.y === y);
        const isHit = collisionCell && collisionCell.x === x && collisionCell.y === y;
        cells.push(
          <div key={`${x}-${y}`} className={`w-full h-full border-[0.5px] border-white/5 flex items-center justify-center relative transition-colors duration-300 ${isHit ? 'bg-red-500 animate-pulse z-30' : ''} ${!isHit && isObstacle ? 'bg-red-500/10' : ''} ${isTarget ? 'bg-green-500/10' : ''} ${isPath && !isHit ? 'bg-accent/5' : ''}`}>
            {isPath && !isHit && <div className="w-1.5 h-1.5 rounded-full bg-accent/30 animate-in zoom-in"></div>}
            {isObstacle && <div className="w-full h-full flex items-center justify-center"><div className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${isHit ? 'bg-red-600 border-white text-white scale-110' : 'bg-red-500/20 border-red-500/40'}`}><div className={`w-2 h-2 rounded-full ${isHit ? 'bg-white' : 'bg-red-500 animate-pulse'}`}></div></div></div>}
            {isTarget && <div className="flex flex-col items-center justify-center opacity-80 animate-bounce"><Flag size={20} className="text-green-500" /></div>}
          </div>
        );
      }
    }
    return cells;
  };

  const renderCodeEditor = () => {
    const lines = code.split('\n');
    const showOverlay = isRunning || missionStatus === 'crash';

    return (
        <div className="relative flex-1 overflow-hidden flex flex-col">
            {/* Real Textarea for Editing */}
            <textarea 
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full h-full bg-[#0d1117] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-accent/30 ${showOverlay ? 'opacity-0' : 'opacity-100'}`}
                spellCheck={false}
                disabled={showOverlay}
            />

            {/* Styled Code View with Highlighting Overlay */}
            {showOverlay && (
                <div className="absolute inset-0 bg-[#0d1117] overflow-y-auto custom-scrollbar p-4 font-mono text-sm leading-relaxed">
                    {lines.map((line, idx) => {
                        const isActive = activeLineIndex === idx;
                        const isFailed = failedLineIndex === idx;
                        return (
                            <div 
                                key={idx} 
                                className={`flex items-start transition-colors duration-200 relative
                                    ${isActive ? 'bg-accent/10' : ''}
                                    ${isFailed ? 'bg-red-500/20 border-r-4 border-red-500' : ''}
                                `}
                            >
                                <span className="w-8 text-gray-600 text-right pr-3 select-none text-[10px] pt-1">{idx + 1}</span>
                                <span className={`flex-1 whitespace-pre-wrap ${isActive ? 'text-white' : isFailed ? 'text-red-400' : 'text-gray-400'}`}>
                                    {line || ' '}
                                </span>
                                {isFailed && (
                                    <div className="absolute left-2 top-1 animate-in slide-in-from-right text-red-500">
                                        <AlertOctagon size={14} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
  };

  /**
   * Helper to render robot configuration drop zones
   */
  const renderDropZone = (slot: 'front' | 'back' | 'left' | 'right', label: string, icon: React.ReactNode) => {
    const component = robotConfig.slots[slot];
    const issue = getIssueForLocation(slot);
    
    return (
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, slot)}
        className={`relative w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all group/slot
          ${component ? 'bg-accent/10 border-accent/40 shadow-[0_0_15px_rgba(45,137,229,0.15)]' : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-black/60'}
          ${issue?.severity === 'critical' ? 'border-red-500/50' : issue?.severity === 'warning' ? 'border-yellow-500/50' : ''}
        `}
      >
        {component ? (
          <>
            <div className="text-accent mb-1">{icon}</div>
            <span className="text-[8px] font-bold text-white text-center px-2 line-clamp-1">{component.name}</span>
            <button 
              onClick={() => setRobotConfig(prev => ({ ...prev, slots: { ...prev.slots, [slot]: null } }))}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/slot:opacity-100 transition-opacity"
            >
              <X size={10} />
            </button>
          </>
        ) : (
          <>
            <div className="text-gray-600 mb-1">{icon}</div>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter text-center px-1">{label}</span>
          </>
        )}
        
        {issue && (
           <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full w-32 p-2 rounded bg-black border text-[8px] z-50 pointer-events-none opacity-0 group-hover/slot:opacity-100 transition-opacity
             ${issue.severity === 'critical' ? 'border-red-500/30 text-red-400' : 'border-yellow-500/30 text-yellow-400'}
           `}>
             {issue.message}
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-primary pt-20 pb-6 px-4 font-sans h-screen flex flex-col overflow-hidden">
       <div className="max-w-7xl mx-auto w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          <div className="lg:col-span-7 flex flex-col gap-4 h-full relative z-10">
              <div className="flex items-center justify-between bg-secondary p-4 rounded-xl border border-white/10">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isRunning ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
                        {isRunning ? <Activity className="animate-pulse" size={20} /> : <Activity size={20} />}
                    </div>
                    <div>
                        <h2 className="text-white font-bold leading-none mb-1">مهمة: الوصول للعلم</h2>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-400 font-mono">X:{robotState.x}, Y:{robotState.y}</span>
                             <span className={`text-[10px] px-1.5 rounded uppercase font-bold ${isRunning ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                                {isRunning ? 'Running' : 'Idle'}
                             </span>
                        </div>
                    </div>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="flex gap-4 text-xs font-mono">
                        <div className="flex flex-col bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 min-w-[110px]">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1"><Battery size={12} className={batteryLevel < 20 ? 'text-red-500 animate-pulse' : 'text-gray-400'} /><span className="text-[10px] text-gray-400">طاقة</span></div>
                                <span className={`text-[10px] font-bold ${batteryLevel < 20 ? 'text-red-500' : 'text-white'}`}>{Math.round(batteryLevel)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-500 ${batteryLevel < 20 ? 'bg-red-500' : batteryLevel <= 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.max(0, Math.min(100, batteryLevel))}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5"><Thermometer size={14} className="text-orange-500" /><span className="text-white">{Math.round(temperature)}°C</span></div>
                    </div>
                 </div>
              </div>

              <div className="flex-1 bg-[#0F1216] rounded-xl border border-white/10 p-6 relative overflow-hidden flex items-center justify-center shadow-inner group">
                 {aiFeedback && <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-purple-500/30 text-white px-4 py-2 rounded-full shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-2"><Sparkles size={16} className="text-purple-400" /><span className="text-xs font-bold">{aiFeedback}</span></div>}
                 <div className="relative aspect-square h-full max-h-[500px] w-full max-w-[500px]">
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1">{renderGrid()}</div>
                    <div className="absolute w-[10%] h-[10%] flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] z-20" style={{ left: `${robotState.x * 10}%`, top: `${robotState.y * 10}%`, transform: `rotate(${robotState.direction}deg) scale(${isRunning ? 1.05 : 1})` }}>
                        {currentAction && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in duration-300 z-30 border border-white/20 flex items-center gap-2" style={{ transform: `rotate(-${robotState.direction}deg)` }}>{getActionIcon(currentAction)}<span className="text-[10px] font-bold font-mono">{currentAction}</span><div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rotate-45 border-r border-b border-white/20"></div></div>}
                        {isRunning && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/30 rounded-full blur-xl animate-pulse"></div>}
                        <div className={`filter drop-shadow-[0_0_8px_rgba(45,137,229,0.5)] transition-colors duration-300 ${missionStatus === 'crash' ? 'text-red-500 animate-shake' : 'text-accent'}`}><Bot size={36} strokeWidth={1.5} /></div>
                    </div>
                 </div>
                 {missionStatus === 'success' && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="bg-secondary border border-green-500/30 p-8 rounded-2xl text-center shadow-2xl"><div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400"><Trophy size={40} /></div><h2 className="text-3xl font-bold text-white mb-2">مهمة ناجحة!</h2><button onClick={handleReset} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold">محاولة أخرى</button></div></div>}
                 {missionStatus === 'crash' && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="bg-secondary border border-red-500/30 p-8 rounded-2xl text-center shadow-2xl"><div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={40} /></div><h2 className="text-3xl font-bold text-white mb-2">فشلت المهمة</h2><p className="text-gray-300 mb-6">تحطم الروبوت أو نفدت البطارية. راقب السطر المميز باللون الأحمر!</p><button onClick={handleReset} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold">إعادة المحاولة</button></div></div>}
              </div>

              <div className="h-40 bg-black rounded-xl border border-white/10 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                 <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-white/10 pb-2"><Terminal size={14} /><span>System Output</span></div>
                 <div className="space-y-1">
                    {logs.map((log, i) => (<div key={i} className={`font-medium ${log.includes('CRITICAL') ? 'text-red-500' : log.includes
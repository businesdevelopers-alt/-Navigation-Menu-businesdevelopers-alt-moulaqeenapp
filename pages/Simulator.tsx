import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Send, Terminal, Battery, Thermometer, Activity, Bot, Sparkles, FileCode, Loader2, Wrench, Cpu, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Package, X, Flag, Trophy, AlertTriangle, ChevronsRight, Plus, MessageSquare, HelpCircle, Trash2, Wand2, Copy, LayoutDashboard, MousePointer2, GripHorizontal, Save, Download, Filter, Info, AlertOctagon } from 'lucide-react';
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

interface ConfigIssue {
    location: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
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

  // UI State
  const [activeTab, setActiveTab] = useState<'editor' | 'chat' | 'config'>('editor');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [partsFilter, setPartsFilter] = useState<'all' | 'motor' | 'sensor'>('all');

  // Robot Config
  const [robotConfig, setRobotConfig] = useState<RobotSchema>(INITIAL_ROBOT_CONFIG);
  const [draggedItem, setDraggedItem] = useState<ComponentSchema | null>(null);
  const [configIssues, setConfigIssues] = useState<ConfigIssue[]>([]);

  // Refs
  const engineRef = useRef<SimulationEngine | null>(null);
  const intervalRef = useRef<number | null>(null);
  const commandsQueueRef = useRef<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isRestoringRef = useRef(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    initEngine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const analyzeConfig = () => {
      const issues: ConfigIssue[] = [];
      const { slots } = robotConfig;

      // Power Analysis
      const totalPower = [slots.front, slots.back, slots.left, slots.right].reduce((acc, c) => acc + (c?.powerConsumption || 0), 0) + 0.5;
      if (totalPower > 8) {
          issues.push({ location: 'center', severity: 'critical', message: 'System Overload! High Power Consumption.' });
      } else if (totalPower > 6) {
          issues.push({ location: 'center', severity: 'warning', message: 'Power consumption is high.' });
      } else {
          issues.push({ location: 'center', severity: 'info', message: 'Power levels nominal.' });
      }

      // Motor Analysis
      if (!slots.left && !slots.right) {
          // General critical if both missing
      } 
      if (!slots.left) issues.push({ location: 'left', severity: 'critical', message: 'Missing Left Motor. Cannot turn or move properly.' });
      if (!slots.right) issues.push({ location: 'right', severity: 'critical', message: 'Missing Right Motor. Cannot turn or move properly.' });

      // Sensor Analysis
      if (!slots.front) {
          issues.push({ location: 'front', severity: 'warning', message: 'No front sensor. High risk of collision.' });
      }

      setConfigIssues(issues);
  };

  const getIssueForLocation = (loc: string) => configIssues.find(i => i.location === loc);

  // --- SAVE / LOAD STATE ---
  const handleSaveState = () => {
      const state = {
          robotConfig,
          robotState,
          batteryLevel,
          temperature,
          code,
          pathHistory,
          timestamp: new Date().toISOString()
      };
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
          
          if (!parsed.robotConfig || !parsed.robotState) throw new Error("Invalid state structure");

          // Set restoring flag to prevent useEffect from resetting engine state
          isRestoringRef.current = true;
          
          setRobotConfig(parsed.robotConfig);
          setRobotState(parsed.robotState);
          setBatteryLevel(parsed.batteryLevel);
          setTemperature(parsed.temperature);
          setCode(parsed.code);
          setPathHistory(parsed.pathHistory || []);
          
          // Re-init engine manually with restored values
          const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
          OBSTACLES.forEach(obs => {
             if (obs.x < GRID_SIZE && obs.y < GRID_SIZE) initialGrid[obs.y][obs.x] = 'obstacle';
          });
          
          engineRef.current = new SimulationEngine(
              parsed.robotConfig,
              initialGrid as any,
              { 
                  x: parsed.robotState.x, 
                  y: parsed.robotState.y, 
                  direction: parsed.robotState.direction, 
                  battery: parsed.batteryLevel, 
                  temperature: parsed.temperature 
              }
          );

          setLogs(prev => [...prev, '> تم استعادة الحالة المحفوظة بنجاح.']);
      } catch (err) {
          setLogs(prev => [...prev, '> خطأ أثناء استعادة الحالة. الملف تالف.']);
          console.error(err);
      }
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

  const handleDragEnd = () => {
    setDraggedItem(null);
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
        if (isRunning && !isPaused) {
             // LIVE MODE: Inject into queue
             commandsQueueRef.current = [...commandsQueueRef.current, ...commands];
             setLogs(prev => [...prev, `> 🤖 AI Injected: ${commands.join(', ')}`]);
             setAiPrompt('');
             // Keep input open for more commands
        } else {
             // EDITOR MODE: Append to code
             const codeBlock = commands.join('\n') + '\n';
             insertCommand(`\n// AI: ${promptToUse}\n` + codeBlock);
             setLogs(prev => [...prev, `> AI generated ${commands.length} commands successfully.`]);
             setAiPrompt('');
             setShowAiInput(false);
        }
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

  // Helper to get action icon
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
  const renderIssueMarker = (issue: ConfigIssue) => {
    if (!issue) return null;
    
    const colorClass = issue.severity === 'critical' ? 'bg-red-500' : issue.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
    const shadowClass = issue.severity === 'critical' ? 'shadow-red-500/50' : issue.severity === 'warning' ? 'shadow-yellow-500/50' : 'shadow-blue-500/50';
    
    return (
      <div className="absolute -top-3 -right-3 z-50 cursor-help group/marker">
        <div className={`relative flex h-4 w-4`}>
          {(issue.severity === 'critical' || issue.severity === 'warning') && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClass} opacity-75`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-4 w-4 ${colorClass} shadow-lg ${shadowClass} border border-white/20 items-center justify-center`}>
             {issue.severity === 'critical' ? <X size={10} className="text-white" /> : issue.severity === 'warning' ? <AlertTriangle size={10} className="text-black" /> : <Info size={10} className="text-white" />}
          </span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] px-3 py-2 bg-black/90 border border-white/10 text-white text-[10px] rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl backdrop-blur-sm">
            <p className={`font-bold mb-0.5 uppercase ${issue.severity === 'critical' ? 'text-red-400' : issue.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`}>{issue.severity}</p>
            {issue.message}
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45"></div>
        </div>
      </div>
    );
  };

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
    const issue = getIssueForLocation(slot);
    // Visual cue for drag target: if we are dragging something, highlight empty slots
    const isTarget = draggedItem && !component;
    
    return (
        <div 
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
            onDrop={(e) => handleDrop(e, slot)}
            className={`relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 h-24 w-24 group z-20
                ${component 
                    ? 'border-2 border-accent bg-secondary shadow-[0_0_20px_rgba(45,137,229,0.2)]' 
                    : isTarget 
                        ? 'border-2 border-dashed border-green-500/70 bg-green-500/10 scale-105 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse'
                        : 'border-2 border-dashed border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5'
                }
            `}
        >
            {issue && renderIssueMarker(issue)}

            <div className={`absolute -top-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm z-30
                 ${component ? 'bg-accent text-white' : isTarget ? 'bg-green-600 text-white' : 'bg-black border border-white/10 text-gray-500'}
            `}>
                {label}
            </div>

            {/* Connection Wire to Center */}
            <div className={`absolute pointer-events-none -z-10 bg-white/10
                ${slot === 'front' ? 'h-10 w-0.5 bottom-[-40px]' : ''}
                ${slot === 'back' ? 'h-10 w-0.5 top-[-40px]' : ''}
                ${slot === 'left' ? 'w-10 h-0.5 right-[-40px]' : ''}
                ${slot === 'right' ? 'w-10 h-0.5 left-[-40px]' : ''}
            `}></div>

            {component ? (
                <div key={component.id} className="relative w-full h-full flex flex-col items-center justify-center animate-in zoom-in-50 duration-300">
                   <button 
                      onClick={() => handleRemovePart(slot)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-40 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                   >
                      <X size={10} />
                   </button>
                   <div className="flex flex-col items-center text-center p-1">
                      <div className="p-2 bg-white/10 rounded-full mb-1">
                        {component.type.includes('motor') ? <Zap size={20} className="text-yellow-400" /> : 
                         component.type.includes('camera') ? <Bot size={20} className="text-blue-400" /> :
                         <Activity size={20} className="text-green-400" />}
                      </div>
                      <span className="text-[9px] font-bold text-white leading-tight">{component.name}</span>
                   </div>
                </div>
            ) : (
                <div className={`flex flex-col items-center transition-opacity ${isTarget ? 'opacity-100 text-green-400' : 'opacity-30 text-gray-600 group-hover:opacity-60'}`}>
                    {icon}
                    {isTarget && <span className="text-[8px] font-bold mt-1 uppercase tracking-widest">Drop Here</span>}
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
              <div className="flex-1 bg-[#0F1216] rounded-xl border border-white/10 p-6 relative overflow-hidden flex items-center justify-center shadow-inner group">
                 <div className="relative aspect-square h-full max-h-[500px] w-full max-w-[500px]">
                    {/* Grid Background */}
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1">
                        {renderGrid()}
                    </div>

                    {/* Robot Layer - Absolute Positioning for Smooth Transition */}
                    <div 
                        className="absolute w-[10%] h-[10%] flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] z-20"
                        style={{
                            left: `${robotState.x * 10}%`,
                            top: `${robotState.y * 10}%`,
                            transform: `rotate(${robotState.direction}deg) scale(${isRunning ? 1.05 : 1})`
                        }}
                    >
                         {/* Visual Feedback Bubble - Improved */}
                        {currentAction && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-1.5 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.5)] whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300 z-30 border border-white/20 flex items-center gap-2 transform -rotate-[${robotState.direction}deg]" style={{ transform: `rotate(-${robotState.direction}deg)` }}>
                                {getActionIcon(currentAction)}
                                <span className="text-[10px] font-bold font-mono tracking-wide">{currentAction}</span>
                                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rotate-45 border-r border-b border-white/20"></div>
                            </div>
                        )}

                        {/* Thruster/Glow Effect */}
                        {isRunning && (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/30 rounded-full blur-xl animate-pulse"></div>
                        )}

                        <div className={`filter drop-shadow-[0_0_8px_rgba(45,137,229,0.5)] transition-colors duration-300 ${missionStatus === 'crash' ? 'text-red-500 animate-shake' : 'text-accent'}`}>
                            <Bot size={36} strokeWidth={1.5} />
                        </div>
                        {/* Head Light - Always relative to robot direction */}
                        <div className="absolute -top-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
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
                     {/* Control Panel - Improved Accessibility */}
                     <div className="bg-[#15191e] border-b border-white/5 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <MousePointer2 size={12} />
                                إدراج سريع
                            </h3>
                            <button 
                                onClick={() => setShowAiInput(!showAiInput)}
                                className={`px-2 py-1 rounded-md text-[10px] flex items-center gap-1.5 transition whitespace-nowrap font-bold border border-transparent
                                    ${showAiInput ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20'}
                                `}
                            >
                                <Sparkles size={10} />
                                AI Assistant
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                             <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => insertCommand('FORWARD')}
                                    className="px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-bold text-green-400 flex items-center justify-center gap-1.5 transition"
                                >
                                    <ArrowUp size={14} />
                                    أمام
                                </button>
                                <button 
                                    onClick={() => insertCommand('BACKWARD')}
                                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 transition"
                                >
                                    <ArrowDown size={14} />
                                    خلف
                                </button>
                             </div>
                             <div className="grid grid-cols-3 gap-2">
                                <button 
                                    onClick={() => insertCommand('TURN_RIGHT')}
                                    className="px-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-bold text-blue-400 flex items-center justify-center gap-1 transition"
                                    title="يمين"
                                >
                                    <ArrowRight size={14} />
                                </button>
                                <button 
                                    onClick={() => insertCommand('TURN_LEFT')}
                                    className="px-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-bold text-blue-400 flex items-center justify-center gap-1 transition"
                                    title="يسار"
                                >
                                    <ArrowLeft size={14} />
                                </button>
                                <button 
                                    onClick={() => insertCommand('WAIT')}
                                    className="px-2 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-lg text-xs font-bold text-yellow-400 flex items-center justify-center gap-1 transition"
                                    title="انتظار"
                                >
                                    <Pause size={14} />
                                </button>
                             </div>
                        </div>
                     </div>

                     {/* AI Input */}
                     {showAiInput && (
                        <div className="p-4 bg-purple-900/10 border-b border-purple-500/20 animate-in slide-in-from-top duration-200">
                             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-300">
                                <Bot size={14} />
                                <span>
                                    {isRunning && !isPaused ? 'تحكم مباشر (Live Command Mode)' : 'المولد الذكي (Code Generator)'}
                                </span>
                                {isRunning && !isPaused && <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2"></span>}
                             </div>
                             <form onSubmit={(e) => handleGenerateCode(e)} className="relative">
                                 <input 
                                    type="text" 
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder={isRunning && !isPaused ? "أمر مباشر: تحرك للأمام..." : "مثال: وصلني للعلم وتجنب العقبات"}
                                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg py-3 pl-3 pr-24 text-sm text-white focus:border-purple-400 focus:outline-none shadow-inner"
                                    autoFocus
                                 />
                                 <button 
                                    type="submit" 
                                    disabled={isAiGenerating}
                                    className="absolute left-1 top-1.5 bottom-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3 rounded-md transition disabled:opacity-50 flex items-center gap-1 text-xs font-bold"
                                 >
                                    {isAiGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                    {isRunning && !isPaused ? 'تنفيذ' : 'توليد'}
                                 </button>
                             </form>
                             <div className="flex flex-wrap gap-2 mt-2">
                                 <button onClick={(e) => handleGenerateCode(e as any, "وصلني للعلم")} className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded hover:bg-purple-500/30 transition border border-purple-500/10">🎯 وصلني للعلم</button>
                                 <button onClick={(e) => handleGenerateCode(e as any, "ارسم مربع")} className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded hover:bg-purple-500/30 transition border border-purple-500/10">⏹ ارسم مربع</button>
                             </div>
                        </div>
                     )}

                     <div className="relative flex-1">
                        <textarea 
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-[#0d1117] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-accent/30"
                            spellCheck={false}
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/5 rounded text-[10px] text-gray-500 font-mono pointer-events-none">
                            JS/C-Like Syntax
                        </div>
                     </div>
                     
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
                            onClick={handleSaveState}
                            className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition hover:border-white/30"
                            title="حفظ الحالة"
                        >
                            <Save size={20} />
                        </button>
                        
                        <button 
                            onClick={handleLoadState}
                            className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition hover:border-white/30"
                            title="استعادة الحالة"
                        >
                            <Download size={20} />
                        </button>
                        
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
                                اسحب القطع من الأسفل إلى أماكنها المحددة.
                            </p>
                        </div>

                        {/* Interactive Blueprint Area */}
                        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-hidden relative bg-grid">
                            
                            <div className="relative animate-in zoom-in-95 duration-500">
                                {/* Chassis Lines / Wires */}
                                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                <div className="absolute left-1/2 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                                {/* Central Core */}
                                <div className="w-32 h-32 bg-[#1A1E24] rounded-2xl border-2 border-white/20 flex flex-col items-center justify-center z-10 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                    {getIssueForLocation('center') && renderIssueMarker(getIssueForLocation('center')!)}
                                    
                                    <Cpu size={40} className="text-white/80 mb-2" />
                                    <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Central Unit</span>
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                                    </div>
                                    {/* Wire Connectors */}
                                    <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-8 h-2 bg-white/20 rounded"></div>
                                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-2 bg-white/20 rounded"></div>
                                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 h-8 w-2 bg-white/20 rounded"></div>
                                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 h-8 w-2 bg-white/20 rounded"></div>
                                </div>

                                {/* Drop Zones */}
                                <div className="absolute -top-36 left-4">{renderDropZone('front', 'المقدمة', <ArrowUp size={24} />)}</div>
                                <div className="absolute -bottom-36 left-4">{renderDropZone('back', 'المؤخرة', <ArrowDown size={24} />)}</div>
                                <div className="absolute top-4 -left-36">{renderDropZone('left', 'محرك أيسر', <ArrowLeft size={24} />)}</div>
                                <div className="absolute top-4 -right-36">{renderDropZone('right', 'محرك أيمن', <ArrowRight size={24} />)}</div>
                            </div>
                        </div>

                        {/* Parts Box (Previously Inventory Drawer) */}
                        <div className="h-56 bg-[#15191E] border-t border-white/10 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
                             <div className="flex items-center justify-between p-3 border-b border-white/5 bg-secondary/80">
                                <div className="flex items-center gap-4">
                                    <h4 className="text-xs font-bold text-gray-300 uppercase flex items-center gap-2">
                                        <GripHorizontal size={14} className="text-gray-500" />
                                        صندوق القطع (Parts Box)
                                    </h4>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => setPartsFilter('all')}
                                            className={`px-3 py-1 text-[10px] rounded-full border transition-all ${partsFilter === 'all' ? 'bg-accent text-white border-accent' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-gray-300'}`}
                                        >الكل</button>
                                        <button 
                                            onClick={() => setPartsFilter('motor')}
                                            className={`px-3 py-1 text-[10px] rounded-full border transition-all ${partsFilter === 'motor' ? 'bg-accent text-white border-accent' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-gray-300'}`}
                                        >محركات</button>
                                        <button 
                                            onClick={() => setPartsFilter('sensor')}
                                            className={`px-3 py-1 text-[10px] rounded-full border transition-all ${partsFilter === 'sensor' ? 'bg-accent text-white border-accent' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-gray-300'}`}
                                        >حساسات</button>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                                    Total Power: <span className="text-white font-bold">{[robotConfig.slots.front, robotConfig.slots.back, robotConfig.slots.left, robotConfig.slots.right].reduce((acc, slot) => acc + (slot?.powerConsumption || 0), 0) + 0.5} W</span>
                                </span>
                             </div>
                             <div className="flex gap-4 overflow-x-auto p-4 custom-scrollbar flex-1 items-center bg-[#0F1216]">
                                {AVAILABLE_COMPONENTS
                                    .filter(c => {
                                        if (partsFilter === 'all') return true;
                                        if (partsFilter === 'motor') return c.type.includes('motor');
                                        if (partsFilter === 'sensor') return !c.type.includes('motor');
                                        return true;
                                    })
                                    .map(component => (
                                    <div 
                                        key={component.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, component)}
                                        onDragEnd={handleDragEnd}
                                        className="flex-shrink-0 w-32 h-32 bg-[#1A1E24] border border-white/10 rounded-xl p-3 cursor-grab hover:border-accent hover:shadow-[0_0_20px_rgba(45,137,229,0.2)] transition-all active:cursor-grabbing flex flex-col items-center justify-center text-center group hover:-translate-y-1 relative overflow-hidden active:scale-95"
                                    >
                                        <div className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-gray-500 text-[8px] font-bold border border-white/5">
                                           {component.type.includes('motor') ? 'M' : 'S'}
                                        </div>
                                        <div className="mb-3 text-gray-400 group-hover:text-white transition-colors bg-black/30 p-3 rounded-full group-hover:bg-accent/20 border border-white/5 group-hover:border-accent/30">
                                            {component.type.includes('motor') ? <Zap size={24} /> : 
                                             component.type.includes('camera') ? <Bot size={24} /> :
                                             <Activity size={24} />}
                                        </div>
                                        <span className="text-xs font-bold text-gray-200 leading-tight mb-2 group-hover:text-white">{component.name}</span>
                                        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded text-[9px] border border-white/5">
                                            <Zap size={10} className="text-yellow-500" />
                                            <span className="font-mono text-gray-400">{component.powerConsumption}W</span>
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
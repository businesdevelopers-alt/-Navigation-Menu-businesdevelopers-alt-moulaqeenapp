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
  }, [chatMessages, isStreaming, isChatLoading]);

  // Clear AI Feedback after a delay
  useEffect(() => {
    if (aiFeedback) {
      const timer = setTimeout(() => setAiFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [aiFeedback]);

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
    setCollisionCell(null);
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
    setCollisionCell(null);
    
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

        // Trigger visual flash if collision occurred
        if (result.collisionPoint) {
            setCollisionCell(result.collisionPoint);
            setTimeout(() => setCollisionCell(null), 400); // 400ms flash duration
        }

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
    setCollisionCell(null);
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
             setLogs(prev => [...prev, `> 🤖 AI Injected: ${commands.length} commands`]);
             setAiFeedback(`🤖 تم إضافة ${commands.length} أوامر للمحاكي!`);
             setAiPrompt('');
             // Keep input open for more commands
        } else {
             // EDITOR MODE: Append to code
             const codeBlock = commands.join('\n') + '\n';
             insertCommand(`\n// AI: ${promptToUse}\n` + codeBlock);
             setLogs(prev => [...prev, `> AI generated ${commands.length} commands successfully.`]);
             setAiFeedback(`✅ تم توليد الكود بنجاح`);
             setAiPrompt('');
             setShowAiInput(false);
        }
      } else {
        setLogs(prev => [...prev, '> AI could not interpret the request.']);
        setAiFeedback(`⚠️ لم أستطع فهم الأمر`);
      }
    } catch (err) { 
        setLogs(prev => [...prev, '> Error generating code.']); 
        setAiFeedback(`❌ حدث خطأ`);
    } finally { 
        setIsAiGenerating(false); 
    }
  };

  const handleChatSubmit = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = customInput || chatInput;
    if (!textToSend.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    if (!customInput) setChatInput(''); // Only clear input if typed by user, not if quick action
    setIsChatLoading(true);

    try {
        const contextState = {
            ...robotState,
            battery: batteryLevel,
            config: robotConfig
        };

        const stream = await streamAssistantHelp(textToSend, code, contextState);
        
        // Stop loading dots and start streaming indicator
        setIsChatLoading(false);
        setIsStreaming(true);

        setChatMessages(prev => [...prev, { role: 'model', text: '' }]);
        let fullResponse = "";
        
        for await (const chunk of stream) {
            if (chunk.text) {
                fullResponse += chunk.text;
                setChatMessages(prev => {
                    const newArr = [...prev];
                    const lastIdx = newArr.length - 1;
                    // Correctly mutate the copied object, not the state object directly
                    newArr[lastIdx] = { ...newArr[lastIdx], text: fullResponse };
                    return newArr;
                });
            }
        }
    } catch (error) { 
        setChatMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى." }]); 
    } finally { 
        setIsChatLoading(false); 
        setIsStreaming(false);
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
        const isHit = collisionCell && collisionCell.x === x && collisionCell.y === y;
        
        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={`
              w-full h-full border-[0.5px] border-white/5 flex items-center justify-center relative transition-colors duration-300
              ${isHit ? 'bg-red-500 animate-pulse z-30 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : ''}
              ${!isHit && isObstacle ? 'bg-red-500/10 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]' : ''}
              ${isTarget ? 'bg-green-500/10 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)]' : ''}
              ${isPath && !isHit ? 'bg-accent/5' : ''}
            `}
          >
            {isPath && !isHit && <div className="w-1.5 h-1.5 rounded-full bg-accent/30 animate-in zoom-in"></div>}
            
            {isObstacle && (
                <div className="w-full h-full flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all duration-300 ${isHit ? 'bg-red-600 border-white text-white scale-110' : 'bg-red-500/20 border-red-500/40'}`}>
                        <div className={`w-2 h-2 rounded-full ${isHit ? 'bg-white' : 'bg-red-500 animate-pulse'}`}></div>
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
                 {/* AI Feedback Toast */}
                 {aiFeedback && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-purple-500/30 text-white px-4 py-2 rounded-full shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-400" />
                        <span className="text-xs font-bold">{aiFeedback}</span>
                    </div>
                 )}

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
                                {showAiInput ? 'إغلاق AI' : 'AI Assistant'}
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
                            className="px-4 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-xl border border-white/10 transition hover:border-red-500/30"
                            title="إعادة ضبط"
                        >
                            <RotateCcw size={20} />
                        </button>
                     </div>
                   </>
                )}

                {/* CONFIG TAB */}
                {activeTab === 'config' && (
                   <div className="flex-1 flex flex-col bg-[#15191e] overflow-hidden">
                       <div className="flex-1 p-6 relative flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
                           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none"></div>
                           
                           <div className="relative w-[320px] h-[480px] bg-[#0F1216] border-2 border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col items-center justify-between z-10">
                               {/* Processor */}
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black border border-white/20 rounded-lg flex items-center justify-center z-10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                   <Cpu size={32} className="text-gray-500" />
                                   <div className="absolute -bottom-6 text-[10px] text-gray-500 font-mono">CORE</div>
                               </div>

                               {/* Top/Front Slot */}
                               {renderDropZone('front', 'Front Sensor', <ScanEye size={24} className="mb-2" />)}

                               <div className="flex justify-between w-full relative">
                                   {/* Left Slot */}
                                   {renderDropZone('left', 'Left Motor', <Cog size={24} className="mb-2" />)}
                                   
                                   {/* Right Slot */}
                                   {renderDropZone('right', 'Right Motor', <Cog size={24} className="mb-2" />)}
                               </div>

                               {/* Bottom/Back Slot */}
                               {renderDropZone('back', 'Rear Module', <Battery size={24} className="mb-2" />)}
                           </div>
                           
                           {/* Power Stats */}
                           <div className="mt-8 flex gap-6 text-xs text-gray-500 font-mono">
                               <div className="flex flex-col items-center">
                                   <span className="text-white font-bold text-lg">{(robotConfig.power.consumptionPerTick * 20).toFixed(1)}W</span>
                                   <span>Est. Power Draw</span>
                               </div>
                               <div className="w-px h-8 bg-white/10"></div>
                               <div className="flex flex-col items-center">
                                   <span className="text-green-400 font-bold text-lg">100%</span>
                                   <span>Battery Health</span>
                               </div>
                           </div>
                       </div>

                       {/* Inventory Panel */}
                       <div className="h-48 bg-black/40 border-t border-white/10 p-4 overflow-y-auto">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Package size={14} />
                                    المخزون المتوفر
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setPartsFilter('all')} className={`px-2 py-1 rounded text-[10px] ${partsFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>الكل</button>
                                    <button onClick={() => setPartsFilter('motor')} className={`px-2 py-1 rounded text-[10px] ${partsFilter === 'motor' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>محركات</button>
                                    <button onClick={() => setPartsFilter('sensor')} className={`px-2 py-1 rounded text-[10px] ${partsFilter === 'sensor' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>حساسات</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {AVAILABLE_COMPONENTS.filter(c => partsFilter === 'all' || (partsFilter === 'motor' ? c.type === 'motor' : c.type !== 'motor')).map(comp => (
                                    <div 
                                        key={comp.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, comp)}
                                        onDragEnd={handleDragEnd}
                                        className="bg-secondary p-2 rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/5 cursor-grab active:cursor-grabbing flex flex-col items-center gap-1 group transition-all"
                                    >
                                        <div className="p-2 bg-black/30 rounded-full group-hover:scale-110 transition-transform">
                                            {comp.type === 'motor' ? <Zap size={16} className="text-yellow-500" /> : 
                                             comp.type === 'camera' ? <Bot size={16} className="text-blue-500" /> :
                                             <Activity size={16} className="text-green-500" />}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-300 text-center leading-tight line-clamp-2">{comp.name}</span>
                                    </div>
                                ))}
                            </div>
                       </div>
                   </div>
                )}

                {/* CHAT TAB */}
                {activeTab === 'chat' && (
                    <div className="flex-1 flex flex-col bg-[#0d1117]">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                             {/* Intro Message */}
                             <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm text-gray-300 border border-white/5 max-w-[85%]">
                                    <p>مرحباً بك! أنا مساعدك الذكي في منصة مُلَقّن. 🤖</p>
                                    <p className="mt-2 text-xs text-gray-400">يمكنني مساعدتك في:</p>
                                    <ul className="list-disc list-inside mt-1 text-xs text-gray-400 space-y-1">
                                        <li>شرح الأكواد وتصحيحها</li>
                                        <li>اقتراح تصميمات للروبوت</li>
                                        <li>الإجابة عن مفاهيم الروبوتات</li>
                                    </ul>
                                </div>
                             </div>

                             {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-accent'}`}>
                                        {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm max-w-[85%] leading-relaxed border ${msg.role === 'user' ? 'bg-blue-600/20 border-blue-500/30 text-white rounded-tr-none' : 'bg-white/5 border-white/5 text-gray-300 rounded-tl-none'}`}>
                                        {msg.role === 'model' ? renderMessageText(msg.text) : msg.text}
                                    </div>
                                </div>
                             ))}
                             
                             {isChatLoading && (
                                <div className="flex gap-3 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                             )}
                             <div ref={chatEndRef}></div>
                        </div>

                        {/* Quick Actions */}
                        {chatMessages.length < 2 && (
                            <div className="px-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
                                <button onClick={() => handleQuickAction('analyze')} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white transition">🔍 حلل الكود</button>
                                <button onClick={() => handleQuickAction('design')} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white transition">🛠 نصائح تصميم</button>
                                <button onClick={() => handleQuickAction('explain')} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-gray-400 hover:text-white transition">📚 شرح الأوامر</button>
                            </div>
                        )}

                        {/* Chat Input */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <form 
                                onSubmit={(e) => handleChatSubmit(e)}
                                className="relative flex items-center gap-2"
                            >
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="اكتب سؤالك هنا..."
                                    className="flex-1 bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors pr-10"
                                    disabled={isStreaming || isChatLoading}
                                />
                                <button 
                                    type="submit"
                                    disabled={!chatInput.trim() || isStreaming || isChatLoading}
                                    className="absolute left-2 p-1.5 bg-accent hover:bg-accentHover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

             </div>
          </div>

       </div>

       {/* Helper Icons for Drag & Drop that were undefined */}
       <div className="hidden">
           {/* These are used in the renderDropZone function but imported inside the component */}
       </div>
    </div>
  );
};

// Simple Icon Wrappers for cleaner JSX in DropZone
const ScanEye = ({size, className}: {size:number, className?:string}) => <div className={className}><Activity size={size} /></div>;
const Cog = ({size, className}: {size:number, className?:string}) => <div className={className}><Settings size={size} /></div>;

export default Simulator;
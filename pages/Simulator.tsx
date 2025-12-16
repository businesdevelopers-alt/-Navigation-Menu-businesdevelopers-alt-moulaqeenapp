import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Send, Terminal, Battery, Thermometer, Activity, Cpu, Bot, MessageSquare, Sun, Moon, FileCode, LayoutTemplate, Settings, Wifi, Eye, Box, Check, ChevronRight, ChevronLeft, Maximize2, Minimize2, PanelRightClose, PanelRightOpen, HelpCircle, X, AlertTriangle, Command, Loader2, Bug, Wand2, Sparkles, Copy } from 'lucide-react';
import { SimulationEngine } from '../services/simulationEngine';
import { translateCommands, streamAssistantHelp } from '../services/geminiService';
import { RobotState, RobotSchema } from '../types';

const GRID_SIZE = 10;
const DEFAULT_CODE = `// SYSTEM INITIALIZATION
// COMMANDS: FORWARD, BACKWARD, TURN_LEFT, TURN_RIGHT, WAIT

FORWARD
FORWARD
TURN_RIGHT
FORWARD
`;

const COMMANDS_LIST = ['FORWARD', 'BACKWARD', 'TURN_LEFT', 'TURN_RIGHT', 'WAIT'];

// Mock initial robot config
const INITIAL_ROBOT_CONFIG: RobotSchema = {
  processor: { type: 'standard', position: 'center' },
  slots: {
    front: { id: 's1', type: 'sensor-dist', name: 'UltraSonic', powerConsumption: 1 },
    back: null,
    left: { id: 'm1', type: 'motor', name: 'Servo L', powerConsumption: 2 },
    right: { id: 'm2', type: 'motor', name: 'Servo R', powerConsumption: 2 },
  },
  power: { totalCapacity: 100, current: 100, consumptionPerTick: 0.5 }
};

const INITIAL_STATE: RobotState & { battery: number; temperature: number } = {
  x: 0,
  y: 0,
  direction: 90, // Facing Right
  battery: 100,
  temperature: 24
};

// Component Definitions
const AVAILABLE_COMPONENTS = [
  { id: 'cpu-1', type: 'cpu', name: 'Core Processor', power: 0.5, icon: Cpu, desc: 'Central Processing Unit' },
  { id: 'motor-1', type: 'motor', name: 'Servo Motor HV', power: 2.0, icon: Settings, desc: 'High torque movement' },
  { id: 'sensor-dist', type: 'sensor', name: 'Lidar Sensor', power: 0.8, icon: Wifi, desc: 'Distance detection (3m)' },
  { id: 'sensor-cam', type: 'camera', name: 'Optical Unit', power: 1.5, icon: Eye, desc: 'Object recognition' },
  { id: 'battery-x', type: 'battery', name: 'Li-Ion Pack', power: 0, icon: Battery, desc: 'Extended capacity' },
  { id: 'sensor-temp', type: 'sensor', name: 'Thermal Probe', power: 0.2, icon: Thermometer, desc: 'Heat monitoring' },
];

// Generate empty grid with some obstacles
const generateGrid = () => {
  const grid: ('empty' | 'obstacle')[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
  // Add some random obstacles
  grid[3][3] = 'obstacle';
  grid[3][4] = 'obstacle';
  grid[7][2] = 'obstacle';
  grid[5][7] = 'obstacle';
  return grid;
};

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const Simulator: React.FC = () => {
  const [grid] = useState(generateGrid());
  const [robotState, setRobotState] = useState(INITIAL_STATE);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [logs, setLogs] = useState<{time: string, msg: string, type: 'info'|'error'|'success'}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'designer' | 'editor' | 'assistant'>('designer');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('cpu-1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  // Assistant State
  const [assistantQuery, setAssistantQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'ai', text: 'مرحباً! أنا مساعدك الذكي 🤖. كيف يمكنني مساعدتك في تصميم الروبوت أو تصحيح الكود اليوم؟' }
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Editor State
  const [editorTheme, setEditorTheme] = useState<'dark' | 'light'>('dark');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Autocomplete State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });

  const engineRef = useRef<SimulationEngine | null>(null);
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);
  const wasAutoPausedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const commandQueueRef = useRef<string[]>([]);

  // Initialize Engine
  useEffect(() => {
    engineRef.current = new SimulationEngine(INITIAL_ROBOT_CONFIG, grid, INITIAL_STATE);
  }, [grid]);

  // Sync refs
  useEffect(() => {
    isRunningRef.current = isRunning;
    isPausedRef.current = isPaused;
  }, [isRunning, isPaused]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  const addLog = useCallback((msg: string, type: 'info'|'error'|'success' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    setLogs(prev => [...prev, { time, msg, type }]);
  }, []);

  // Trigger shake animation
  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  // Sync scrolling between textarea and highlighter/gutter
  const handleEditorScroll = () => {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      if (gutterRef.current) gutterRef.current.scrollTop = scrollTop;
      if (highlightRef.current) {
        highlightRef.current.scrollTop = scrollTop;
        highlightRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  // Syntax Highlighting Logic
  const getHighlightedCode = (codeText: string) => {
    // Basic HTML escaping
    let html = codeText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Process line by line to handle comments vs keywords correctly
    return html.split('\n').map(line => {
      // Check for comments
      const commentIndex = line.indexOf('//');
      if (commentIndex !== -1) {
        const codePart = line.substring(0, commentIndex);
        const commentPart = line.substring(commentIndex);
        
        // Highlight keywords in the code part
        const highlightedCode = codePart.replace(
          /\b(FORWARD|BACKWARD|TURN_LEFT|TURN_RIGHT|WAIT)\b/g, 
          '<span class="text-accent font-bold">$1</span>'
        );
        
        return `${highlightedCode}<span class="text-gray-500 italic font-normal">${commentPart}</span>`;
      } else {
        // No comment, just highlight keywords
        return line.replace(
          /\b(FORWARD|BACKWARD|TURN_LEFT|TURN_RIGHT|WAIT)\b/g, 
          '<span class="text-accent font-bold">$1</span>'
        );
      }
    }).join('\n');
  };

  // Autocomplete Logic
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);

    const cursor = e.target.selectionStart;
    const textUpToCursor = val.substring(0, cursor);
    const lines = textUpToCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    const words = currentLine.split(/\s+/);
    const currentWord = words[words.length - 1];

    if (currentWord && currentWord.length >= 1) {
      const matches = COMMANDS_LIST.filter(c => 
        c.startsWith(currentWord.toUpperCase()) && c !== currentWord.toUpperCase()
      );

      if (matches.length > 0) {
        setSuggestions(matches);
        setSuggestionIdx(0);
        
        // Approximate position for suggestion box
        // Line height ~24px, Char width ~8.5px (for mono font at text-sm)
        const lineIndex = lines.length - 1;
        const charIndex = currentLine.length - currentWord.length;
        
        // Get textarea scroll offset to adjust position
        const scrollTop = e.target.scrollTop;
        
        setSuggestionPos({
          top: (lineIndex + 1) * 24 - scrollTop + 12, // +12 for padding
          left: charIndex * 8.5 + 44 // +44 for gutter width and padding
        });
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const insertSuggestion = (suggestion: string) => {
    if (!textareaRef.current) return;
    
    const cursor = textareaRef.current.selectionStart;
    const textUpToCursor = code.substring(0, cursor);
    const textAfterCursor = code.substring(cursor);
    const lines = textUpToCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    const words = currentLine.split(/\s+/);
    const currentWord = words[words.length - 1];
    
    const newTextUpToCursor = textUpToCursor.substring(0, textUpToCursor.length - currentWord.length) + suggestion;
    const newCode = newTextUpToCursor + textAfterCursor;
    
    setCode(newCode);
    setSuggestions([]);
    
    // Restore focus
    textareaRef.current.focus();
    
    // Move cursor to end of inserted word (needs timeout for React render)
    setTimeout(() => {
        if(textareaRef.current) {
            textareaRef.current.selectionStart = newTextUpToCursor.length;
            textareaRef.current.selectionEnd = newTextUpToCursor.length;
        }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length > 0) {
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        insertSuggestion(suggestions[suggestionIdx]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIdx(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIdx(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Escape') {
        setSuggestions([]);
      }
    }
  };

  // Auto-pause on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isRunningRef.current && !isPausedRef.current) {
          setIsPaused(true);
          wasAutoPausedRef.current = true;
          addLog('SYSTEM: Auto-pause (Background)', 'info');
        }
      } else {
        if (wasAutoPausedRef.current) {
          setIsPaused(false);
          wasAutoPausedRef.current = false;
          addLog('SYSTEM: Resuming...', 'info');
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [addLog]);

  const parseCommands = (input: string): string[] => {
    return input.split('\n')
      .map(line => line.trim().split('//')[0].trim()) // Remove comments
      .filter(line => line.length > 0 && !line.startsWith('//'));
  };

  const handleRun = async () => {
    if (isRunning || isCompiling) return;

    // Reset state before run if not paused
    if (!isPaused) {
       setRobotState(INITIAL_STATE);
       engineRef.current = new SimulationEngine(INITIAL_ROBOT_CONFIG, grid, INITIAL_STATE);
       setLogs([]);
       
       if (isSidebarOpen && activeTab !== 'editor') {
           setActiveTab('editor');
       }
       
       let commands: string[] = [];
       // Check if code looks like natural language (contains arabic or doesn't match standard commands)
       const standardCommands = ['FORWARD', 'BACKWARD', 'TURN_LEFT', 'TURN_RIGHT', 'WAIT'];
       const lines = parseCommands(code);
       const isStandard = lines.every(l => standardCommands.includes(l.toUpperCase()));

       if (!isStandard && lines.length > 0) {
          setIsCompiling(true);
          addLog('PROCESSING: Translating natural language...', 'info');
          try {
             commands = await translateCommands(code);
             if (commands.length > 0) {
                addLog(`COMPILED: ${commands.length} instructions`, 'success');
             } else {
                addLog('ERROR: Could not translate instructions.', 'error');
                setIsCompiling(false);
                return;
             }
          } catch (e) {
             addLog('ERROR: Compilation failed', 'error');
             setIsCompiling(false);
             return;
          }
          setIsCompiling(false);
       } else {
          commands = lines.map(l => l.toUpperCase());
       }
       
       commandQueueRef.current = commands;
    }

    setIsRunning(true);
    setIsPaused(false);

    intervalRef.current = window.setInterval(() => {
      if (isPausedRef.current) return;

      if (commandQueueRef.current.length === 0) {
        handleStop();
        addLog('PROCESS: Execution Complete', 'success');
        return;
      }

      const cmd = commandQueueRef.current.shift();
      if (cmd && engineRef.current) {
        const result = engineRef.current.step(cmd);
        
        setRobotState({
           x: result.x,
           y: result.y,
           direction: result.direction,
           battery: result.battery,
           temperature: result.temperature
        });

        // Add engine logs
        result.logs.forEach(l => addLog(l, l.includes('ERROR') || l.includes('CRITICAL') ? 'error' : l.includes('WARNING') ? 'info' : 'info'));
        
        // Check for collision to trigger visual effect
        if (result.sensors.collision) {
          triggerShake();
        }

        if (result.battery <= 0) {
           handleStop();
           addLog('CRITICAL: Battery Depleted', 'error');
        }
      }
    }, 800); // 800ms per step
  };

  const handlePause = () => {
    setIsPaused(true);
    addLog('SYSTEM: Paused', 'info');
  };

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    commandQueueRef.current = [];
  };

  const handleReset = () => {
    handleStop();
    setRobotState(INITIAL_STATE);
    engineRef.current = new SimulationEngine(INITIAL_ROBOT_CONFIG, grid, INITIAL_STATE);
    setLogs([]);
    addLog('SYSTEM: Reset', 'info');
  };

  const handleChatSubmit = async (customQuery?: string) => {
    const queryToSend = customQuery || assistantQuery;
    if (!queryToSend.trim()) return;

    // Add user message
    setChatHistory(prev => [...prev, { role: 'user', text: queryToSend }]);
    setAssistantQuery('');
    setIsAssistantLoading(true);

    try {
        const streamResponse = await streamAssistantHelp(
            queryToSend, 
            code, 
            { 
                battery: robotState.battery, 
                components: INITIAL_ROBOT_CONFIG 
            }
        );

        // Add initial empty AI message
        setChatHistory(prev => [...prev, { role: 'ai', text: '' }]);
        
        let fullText = "";
        for await (const chunk of streamResponse) {
            const chunkText = chunk.text;
            if (chunkText) {
                fullText += chunkText;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    const lastMsg = newHistory[newHistory.length - 1];
                    if (lastMsg.role === 'ai') {
                        lastMsg.text = fullText;
                    }
                    return newHistory;
                });
            }
        }
    } catch (e) {
        setChatHistory(prev => [...prev, { role: 'ai', text: "عذراً، حدث خطأ في الاتصال بالخدمة. يرجى التحقق من مفتاح API." }]);
    } finally {
        setIsAssistantLoading(false);
    }
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        // Extract code
        const codeContent = part.replace(/```(\w+)?\n?/, '').replace(/```$/, '');
        return (
          <div key={i} className="my-3 bg-[#0d0d0d] rounded border border-white/10 overflow-hidden group/code">
             <div className="flex justify-between items-center px-3 py-1.5 bg-[#1a1a1a] border-b border-white/5">
                <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Terminal size={10} /> CODE BLOCK</span>
                <button 
                  onClick={() => { setCode(codeContent); setActiveTab('editor'); }} 
                  className="flex items-center gap-1 text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 hover:bg-accent hover:text-white transition"
                >
                   <Terminal size={10} /> INSERT
                </button>
             </div>
             <pre className="p-3 text-xs font-mono text-gray-300 overflow-x-auto selection:bg-accent/30">
                {codeContent}
             </pre>
          </div>
        )
      }
      // Simple bold parsing for industrial feel
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  }

  // Rendering Grid
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isRobot = x === robotState.x && y === robotState.y;
        const isObstacle = grid[y][x] === 'obstacle';
        
        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={`
              w-full pt-[100%] relative border-r border-b border-white/5 transition-all duration-300
              ${isObstacle ? 'bg-[#2A2E35] shadow-inner pattern-diagonal-lines' : ''}
              ${isRobot ? 'z-10' : ''}
            `}
          >
            {isRobot && (
               <div 
                 className="absolute inset-1 bg-accent rounded-sm flex items-center justify-center transition-transform duration-500 shadow-lg"
                 style={{ transform: `rotate(${robotState.direction}deg)` }}
               >
                 {/* Inner container handles shake animation to not conflict with rotation */}
                 <div className={`w-full h-full flex items-center justify-center ${isShaking ? 'animate-shake' : ''}`}>
                    <Bot size="60%" className="text-white" />
                    {/* Direction Indicator */}
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-highlight rounded-full animate-pulse"></div>
                 </div>
               </div>
            )}
            <div className="absolute top-0.5 left-0.5 text-[6px] text-gray-700 font-mono">{x},{y}</div>
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen bg-primary py-4 font-sans h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="w-full px-4 h-full flex flex-col gap-3">
        
        {/* Toolbar - Industrial Style */}
        <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 bg-secondary p-2 rounded-lg border border-white/10 shadow-md">
           <div className="flex items-center gap-4">
              <h1 className="text-base font-bold text-white flex items-center gap-2 pl-2 border-l border-white/10 ml-2">
                 <Terminal className="text-accent" size={18} />
                 SIMULATOR <span className="text-[10px] text-gray-500 font-mono mt-1">v2.0</span>
              </h1>
              
              <div className="flex items-center gap-1">
                 <button 
                   onClick={isRunning && !isPaused ? handlePause : handleRun}
                   disabled={isCompiling}
                   className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition border ${
                     isCompiling ? 'bg-primary/50 text-gray-400 border-white/10 cursor-not-allowed' :
                     isRunning && !isPaused 
                        ? 'bg-highlight/10 text-highlight border-highlight/30 hover:bg-highlight/20' 
                        : 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20'
                   }`}
                 >
                    {isCompiling ? (
                        <>
                           <Loader2 size={14} className="animate-spin" />
                           COMPILING...
                        </>
                    ) : (
                        <>
                           {isRunning && !isPaused ? <Pause size={14} /> : <Play size={14} />}
                           {isRunning && !isPaused ? 'PAUSE' : isRunning && isPaused ? 'RESUME' : 'RUN'}
                        </>
                    )}
                 </button>
                 <button 
                   onClick={handleReset}
                   disabled={isCompiling}
                   className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 bg-surface text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition disabled:opacity-50"
                 >
                    <RotateCcw size={14} />
                    RESET
                 </button>
              </div>
           </div>

           <div className="flex items-center gap-6 text-xs font-mono">
              {/* Battery Indicator with Visual Bar */}
              <div className="flex items-center gap-2" title="Battery Level">
                 <Battery 
                    size={14} 
                    className={`${
                       robotState.battery < 20 ? 'text-red-500' : 
                       robotState.battery <= 50 ? 'text-yellow-500' : 
                       'text-green-500'
                    }`} 
                 />
                 <div className="w-16 h-2 bg-gray-700/50 rounded-sm overflow-hidden border border-white/10">
                    <div 
                       className={`h-full transition-all duration-300 ease-out ${
                          robotState.battery < 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                          robotState.battery <= 50 ? 'bg-yellow-500' : 
                          'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                       }`}
                       style={{ width: `${Math.max(0, robotState.battery)}%` }}
                    ></div>
                 </div>
                 <span className={`w-8 text-right font-bold ${
                    robotState.battery < 20 ? 'text-red-500 animate-pulse' : 'text-white'
                 }`}>{Math.round(robotState.battery)}%</span>
              </div>

              <div className="flex items-center gap-2" title="Core Temp">
                 <Thermometer size={14} className="text-highlight" />
                 <span className="text-white">{Math.round(robotState.temperature)}°C</span>
              </div>
              <div className="flex items-center gap-2" title="Coordinates">
                 <Activity size={14} className="text-accent" />
                 <span className="text-white">POS: {robotState.x}, {robotState.y}</span>
              </div>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="flex gap-1">
                <button 
                    onClick={() => setShowHelpModal(true)} 
                    className="p-1.5 rounded border bg-surface border-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <HelpCircle size={16} />
                </button>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className={`p-1.5 rounded border transition-colors ${isSidebarOpen ? 'bg-accent text-white border-accent' : 'bg-surface border-white/10 text-gray-400'}`}
                >
                    {isSidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
                </button>
              </div>
           </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex gap-3 min-h-0 relative overflow-hidden">
            
            {/* Grid Area - Engineering Look */}
            <div className={`flex-1 bg-secondary rounded border border-white/10 p-4 flex items-center justify-center relative transition-all duration-300 ${!isSidebarOpen ? 'w-full' : ''}`}>
               <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
               
               {/* Grid Frame */}
               <div className="h-full w-full flex items-center justify-center overflow-hidden">
                   <div className="aspect-square h-full max-h-full w-auto max-w-full grid grid-cols-10 border border-white/20 bg-[#1A1D22] shadow-2xl">
                      {renderGrid()}
                   </div>
               </div>
            </div>

            {/* Sidebar - Collapsible */}
            <div 
              className={`flex-shrink-0 flex flex-col gap-3 min-h-0 transition-all duration-300 ease-in-out overflow-hidden
                ${isSidebarOpen ? 'w-[400px] opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10'}
              `}
            >
               
               {/* Tab Switcher - Segmented Control Style */}
               <div className="flex bg-secondary p-1 rounded border border-white/10 flex-shrink-0">
                  <button 
                     onClick={() => setActiveTab('designer')}
                     className={`flex-1 py-1.5 rounded text-[11px] font-bold tracking-wide transition flex items-center justify-center gap-2 ${activeTab === 'designer' ? 'bg-primary text-white border border-white/10 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                  >
                     <LayoutTemplate size={12} />
                     DESIGN
                  </button>
                  <button 
                     onClick={() => setActiveTab('editor')}
                     className={`flex-1 py-1.5 rounded text-[11px] font-bold tracking-wide transition flex items-center justify-center gap-2 ${activeTab === 'editor' ? 'bg-primary text-white border border-white/10 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                  >
                     <Cpu size={12} />
                     CODE
                  </button>
                  <button 
                     onClick={() => setActiveTab('assistant')}
                     className={`flex-1 py-1.5 rounded text-[11px] font-bold tracking-wide transition flex items-center justify-center gap-2 ${activeTab === 'assistant' ? 'bg-primary text-white border border-white/10 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                  >
                     <Bot size={12} />
                     AI HELP
                  </button>
               </div>

               {/* Panels Container */}
               <div className="flex-1 flex flex-col min-h-0">
                   
                   {/* Designer Panel */}
                   {activeTab === 'designer' && (
                      <div className="flex-1 bg-secondary rounded border border-white/10 p-0 flex flex-col min-h-0 overflow-hidden">
                         <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-surface/50">
                            <h3 className="text-white font-bold text-xs flex items-center gap-2 uppercase tracking-wider">
                                <Box size={14} className="text-accent" />
                                Components
                            </h3>
                            <span className="text-[10px] text-gray-500 font-mono">SYS.CONFIG</span>
                         </div>
                         <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {AVAILABLE_COMPONENTS.map((comp) => (
                               <div 
                                  key={comp.id}
                                  onClick={() => setSelectedComponentId(comp.id)}
                                  className={`p-3 rounded border transition-all duration-200 cursor-pointer group relative overflow-hidden
                                      ${selectedComponentId === comp.id 
                                          ? 'bg-accent/5 border-accent shadow-glow' 
                                          : 'bg-primary border-white/5 hover:border-white/20'
                                      }
                                  `}
                               >
                                  <div className="flex items-center gap-3 relative z-10">
                                      <div className={`p-2 rounded transition-colors ${selectedComponentId === comp.id ? 'bg-accent text-white' : 'bg-surface text-gray-500 group-hover:text-gray-300'}`}>
                                          <comp.icon size={16} />
                                      </div>
                                      <div className="flex-1">
                                          <div className="flex justify-between items-center mb-1">
                                              <h4 className={`text-xs font-bold transition-colors ${selectedComponentId === comp.id ? 'text-white' : 'text-gray-400'}`}>
                                                  {comp.name}
                                              </h4>
                                              {selectedComponentId === comp.id && (
                                                  <Check size={12} className="text-accent" />
                                              )}
                                          </div>
                                          <div className="flex justify-between items-center">
                                              <p className="text-[10px] text-gray-600 uppercase tracking-tight">{comp.desc}</p>
                                              <span className="text-[10px] font-mono text-highlight">
                                                  {comp.power}W
                                              </span>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  {selectedComponentId === comp.id && (
                                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"></div>
                                  )}
                               </div>
                            ))}
                         </div>
                      </div>
                   )}

                   {/* Editor Panel - JetBrains Mono with Syntax Highlighting */}
                   {activeTab === 'editor' && (
                      <div className={`flex-1 rounded border flex flex-col min-h-0 overflow-hidden relative ${editorTheme === 'dark' ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                          <div className={`h-8 flex-shrink-0 flex items-center justify-between px-3 border-b select-none ${editorTheme === 'dark' ? 'bg-[#252526] border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                              <div className="flex items-center gap-2 text-[10px] font-mono uppercase">
                                  <FileCode size={12} className="text-accent" />
                                  <span>main.robot</span>
                              </div>
                              <button 
                                  onClick={() => setEditorTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                                  className="p-1 hover:text-white transition"
                              >
                                  {editorTheme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
                              </button>
                          </div>

                          <div className="flex-1 relative flex min-h-0 group">
                              {/* Gutter (Line Numbers) */}
                              <div 
                                  ref={gutterRef}
                                  className={`w-10 flex-shrink-0 flex flex-col items-end pt-3 pb-3 pr-2 text-[11px] font-mono leading-6 select-none overflow-hidden ${editorTheme === 'dark' ? 'bg-[#1e1e1e] text-[#606060]' : 'bg-white text-gray-400 border-r'}`}
                              >
                                  {code.split('\n').map((_, i) => (
                                      <div key={i} className="h-6 leading-6">{i + 1}</div>
                                  ))}
                              </div>

                              {/* Editor Area */}
                              <div className="relative flex-1 h-full overflow-hidden">
                                  
                                  {/* Syntax Highlight Layer */}
                                  <pre 
                                      ref={highlightRef}
                                      aria-hidden="true"
                                      className={`absolute inset-0 p-3 pl-2 m-0 font-mono text-sm leading-6 pointer-events-none whitespace-pre overflow-hidden ${editorTheme === 'dark' ? 'bg-[#1e1e1e] text-[#d4d4d4]' : 'bg-white text-gray-800'}`}
                                      style={{fontFamily: "'JetBrains Mono', monospace"}}
                                  >
                                      <code dangerouslySetInnerHTML={{__html: getHighlightedCode(code)}}></code>
                                  </pre>

                                  {/* Input Layer */}
                                  <textarea 
                                      ref={textareaRef}
                                      value={code}
                                      onChange={handleCodeChange}
                                      onKeyDown={handleKeyDown}
                                      onScroll={handleEditorScroll}
                                      className={`absolute inset-0 w-full h-full p-3 pl-2 font-mono text-sm leading-6 resize-none focus:outline-none whitespace-pre bg-transparent text-transparent caret-accent z-10 selection:bg-accent/20`}
                                      spellCheck="false"
                                      autoCapitalize="off"
                                      autoComplete="off"
                                      style={{fontFamily: "'JetBrains Mono', monospace", color: 'transparent'}}
                                  />
                                  
                                  {/* Autocomplete Dropdown */}
                                  {suggestions.length > 0 && (
                                    <div 
                                      className="absolute z-20 bg-secondary border border-white/10 shadow-2xl rounded-md overflow-hidden min-w-[140px] animate-fade-in"
                                      style={{ top: suggestionPos.top, left: suggestionPos.left }}
                                    >
                                      <div className="px-2 py-1 bg-surface border-b border-white/5 text-[9px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                                         <Command size={10} /> Suggestions
                                      </div>
                                      <ul className="max-h-32 overflow-y-auto">
                                        {suggestions.map((s, i) => (
                                          <li 
                                            key={s}
                                            onClick={() => insertSuggestion(s)}
                                            className={`px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors flex justify-between items-center ${i === suggestionIdx ? 'bg-accent text-white' : 'text-gray-300 hover:bg-white/5'}`}
                                          >
                                            {s}
                                            {i === suggestionIdx && <span className="text-[9px] opacity-60">↵</span>}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                          </div>

                          <div className="h-6 flex-shrink-0 bg-accent text-white text-[10px] flex items-center px-3 font-mono justify-between z-10 relative">
                              <span>UTF-8</span>
                              <span>RobotLang v1.0</span>
                          </div>
                      </div>
                   )}

                   {/* AI Assistant Panel */}
                   {activeTab === 'assistant' && (
                      <div className="flex-1 bg-secondary rounded border border-white/10 p-0 flex flex-col min-h-0">
                         {/* Quick Actions Header */}
                         <div className="p-3 border-b border-white/5 bg-primary/30 flex gap-2 overflow-x-auto">
                            <button 
                                onClick={() => handleChatSubmit("هل يمكنك فحص الكود بحثاً عن أخطاء؟")}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] font-bold transition whitespace-nowrap"
                            >
                                <Bug size={12} />
                                فحص الأخطاء
                            </button>
                            <button 
                                onClick={() => handleChatSubmit("كيف يمكنني تحسين تصميم الروبوت؟")}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-[10px] font-bold transition whitespace-nowrap"
                            >
                                <Wand2 size={12} />
                                تحسين التصميم
                            </button>
                            <button 
                                onClick={() => handleChatSubmit("اشرح لي الرموز والأوامر المتاحة.")}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[10px] font-bold transition whitespace-nowrap"
                            >
                                <Sparkles size={12} />
                                شرح الرموز
                            </button>
                         </div>

                         {/* Chat Area */}
                         <div className="flex-1 bg-primary p-4 overflow-y-auto space-y-4">
                            {chatHistory.map((msg, idx) => (
                               <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 border ${
                                      msg.role === 'ai' 
                                          ? 'bg-accent/10 border-accent/20 text-accent' 
                                          : 'bg-surface border-white/10 text-white'
                                  }`}>
                                     {msg.role === 'ai' ? <Bot size={16} /> : <div className="text-xs font-bold">U</div>}
                                  </div>
                                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                      msg.role === 'ai' 
                                          ? 'bg-secondary border border-white/10 text-gray-200 rounded-tl-none' 
                                          : 'bg-white/10 border border-white/10 text-white rounded-tr-none'
                                  }`}>
                                     {renderMessageText(msg.text)}
                                  </div>
                               </div>
                            ))}
                            <div ref={chatEndRef} />
                         </div>
                         
                         {/* Input Area */}
                         <div className="p-3 bg-surface border-t border-white/10 relative">
                            <input 
                               type="text" 
                               value={assistantQuery}
                               onChange={(e) => setAssistantQuery(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                               placeholder="كيف يمكنني مساعدتك؟ (مثال: أضف مستشعر حرارة)"
                               className="w-full bg-primary border border-white/10 rounded-lg py-3 pl-4 pr-12 text-white focus:border-accent focus:outline-none text-sm placeholder-gray-600 transition-colors"
                               disabled={isAssistantLoading}
                            />
                            <button 
                               onClick={() => handleChatSubmit()}
                               disabled={isAssistantLoading}
                               className="absolute right-5 top-5 text-accent hover:text-white transition disabled:opacity-50"
                            >
                               {isAssistantLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            </button>
                         </div>
                      </div>
                   )}

               </div>

               {/* Console Logs - Terminal Style */}
               <div className="h-32 bg-[#0F1115] rounded border border-white/10 p-2 overflow-y-auto font-mono text-[11px] flex-shrink-0 shadow-inner">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/5 text-gray-500 font-bold uppercase tracking-wider text-[9px] px-1">
                     <span>System Output</span>
                     <span className="cursor-pointer hover:text-white" onClick={() => setLogs([])}>CLR</span>
                  </div>
                  <div className="space-y-1 px-1">
                     {logs.length === 0 && <span className="text-gray-700 italic">Waiting for command...</span>}
                     {logs.map((log, idx) => (
                        <div key={idx} className="flex gap-2">
                           <span className="text-gray-600 shrink-0">[{log.time}]</span>
                           <span className={`${
                              log.type === 'error' ? 'text-red-500' : 
                              log.type === 'success' ? 'text-green-500' : 
                              'text-accent'
                           }`}>
                              {log.msg}
                           </span>
                        </div>
                     ))}
                     <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })}></div>
                  </div>
               </div>

            </div>
        </div>

        {/* Help Modal - Industrial */}
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowHelpModal(false)}>
              <div 
                className="bg-secondary border border-white/10 rounded shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-5 border-b border-white/10 bg-secondary sticky top-0 z-10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <Activity className="text-accent" />
                    System Manual
                  </h2>
                  <button onClick={() => setShowHelpModal(false)} className="text-gray-500 hover:text-white transition">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                   <div className="bg-primary p-4 rounded border-l-4 border-highlight">
                      <p className="text-gray-300 text-sm leading-relaxed font-mono">
                         The MULAQQEN Simulation Environment (MSE) provides a high-fidelity physics playground for validating robotic logic before physical deployment.
                      </p>
                   </div>

                   <div className="grid gap-3">
                      {[
                        { title: '1. Physics Engine', desc: 'Real-time calculation of friction, torque, and battery consumption.' },
                        { title: '2. Interface', desc: 'Dual-mode input: Natural Language Processing (AI) or Raw Command Codes.' },
                        { title: '3. Sensor Array', desc: 'Simulated LIDAR, Thermal, and Optical inputs.' },
                        { title: '4. Debugging', desc: 'Step-by-step execution with detailed system logging.' },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-primary/50 p-3 rounded border border-white/5 flex gap-3">
                           <div className="text-accent font-bold font-mono">{`0${idx+1}`}</div>
                           <div>
                               <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                               <p className="text-xs text-gray-500">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Simulator;
import React, { useState } from 'react';
import { Book, FileText, Terminal, Code, Cpu, Server, Layers, ChevronLeft, Menu, Activity, Wrench } from 'lucide-react';

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
      { id: 'intro', label: 'مقدمة', icon: FileText },
      { id: 'setup', label: 'تثبيت البيئة', icon: Terminal },
      { id: 'commands', label: 'أوامر الروبوت', icon: Code },
      { id: 'components', label: 'دليل المكونات', icon: Wrench },
      { id: 'ai', label: 'الذكاء الاصطناعي (AI)', icon: Cpu },
      { id: 'troubleshooting', label: 'استكشاف الأخطاء', icon: Activity },
      { id: 'api', label: 'API Reference', icon: Server },
  ];

  return (
    <div className="min-h-screen bg-primary py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden mb-6">
            <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="w-full bg-secondary border border-white/10 p-4 rounded-xl flex items-center justify-between text-white font-bold"
            >
                <div className="flex items-center gap-2">
                    <Book size={20} className="text-accent" />
                    <span>تصفح التوثيق</span>
                </div>
                <Menu size={20} />
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar */}
            <aside 
                className={`
                    w-full md:w-72 bg-secondary p-4 rounded-xl h-fit border border-white/10 md:sticky md:top-24 transition-all duration-300 z-20
                    ${isSidebarOpen ? 'block' : 'hidden md:block'}
                `}
            >
            <div className="mb-6 px-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Book size={20} className="text-accent" />
                    التوثيق التقني
                </h3>
                <p className="text-xs text-gray-500 mt-1">Version 2.0.1</p>
            </div>
            
            <nav className="space-y-1">
                {navItems.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => {
                            setActiveSection(item.id);
                            setSidebarOpen(false);
                        }}
                        className={`w-full text-right px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 group border border-transparent
                            ${activeSection === item.id 
                                ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/5'
                            }
                        `}
                    >
                        <item.icon size={18} className={activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                        <span className="flex-1">{item.label}</span>
                        {activeSection === item.id && <ChevronLeft size={16} />}
                    </button>
                ))}
            </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 bg-secondary/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-white/5 min-h-[600px] shadow-2xl relative">
                
                {/* Intro Section */}
                {activeSection === 'intro' && (
                    <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="inline-flex p-3 bg-accent/10 rounded-xl text-accent mb-6"><FileText size={32} /></div>
                        <h1 className="text-4xl font-bold text-white mb-4">مرحباً بك في وثائق مُلَقّن</h1>
                        <p className="text-gray-300 leading-relaxed text-lg mb-8 max-w-2xl">
                            توفر منصة مُلَقّن بيئة متكاملة لتعلم برمجة الروبوتات. سواء كنت تستخدم المحاكي الافتراضي الخاص بنا أو تقوم ببرمجة قطع هاردوير حقيقية (Arduino/ESP32)، ستجد هنا كل المعلومات التقنية التي تحتاجها.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-primary p-6 rounded-xl border border-white/5 hover:border-accent/50 transition cursor-pointer group" onClick={() => setActiveSection('setup')}>
                                <Terminal className="text-green-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
                                <h3 className="text-white font-bold mb-2 text-lg">للمبتدئين</h3>
                                <p className="text-sm text-gray-400">ابدأ بتجهيز بيئة العمل وتشغيل أول كود لك في أقل من 5 دقائق.</p>
                            </div>
                            <div className="bg-primary p-6 rounded-xl border border-white/5 hover:border-accent/50 transition cursor-pointer group" onClick={() => setActiveSection('api')}>
                                <Server className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
                                <h3 className="text-white font-bold mb-2 text-lg">للمطورين</h3>
                                <p className="text-sm text-gray-400">تصفح الـ API الخاص بنا لربط المحاكي بتطبيقات خارجية.</p>
                            </div>
                        </div>
                    </article>
                )}

                {/* Setup Section */}
                {activeSection === 'setup' && (
                    <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><Terminal className="text-accent" /> تثبيت البيئة وتشغيل المحاكي</h1>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            لا يتطلب محاكي مُلَقّن أي تثبيت برامج على جهازك، فهو يعمل بالكامل عبر المتصفح (Web-based). ومع ذلك، للحصول على أفضل أداء، نوصي بالتالي:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-4 bg-primary p-5 rounded-xl border border-white/5">
                                <span className="bg-white/10 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                                <div>
                                    <strong className="text-white block mb-1">متصفح حديث</strong>
                                    <span className="text-gray-400 text-sm">نوصي باستخدام أحدث نسخة من Chrome أو Edge أو Firefox لدعم الرسوميات ثلاثية الأبعاد (WebGL).</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 bg-primary p-5 rounded-xl border border-white/5">
                                <span className="bg-white/10 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                                <div>
                                    <strong className="text-white block mb-1">اتصال إنترنت مستقر</strong>
                                    <span className="text-gray-400 text-sm">لضمان تحميل مكتبات المحاكاة والتواصل مع خادم الذكاء الاصطناعي دون تقطيع.</span>
                                </div>
                            </li>
                        </ul>
                    </article>
                )}

                {/* Commands Section */}
                {activeSection === 'commands' && (
                    <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><Code className="text-accent" /> مرجع أوامر الروبوت</h1>
                    <p className="text-gray-300 mb-8">
                        يستخدم الروبوت لغة مبسطة تعتمد على الأوامر المباشرة. يمكنك كتابة هذه الأوامر في المحرر النصي أو توليدها عبر الذكاء الاصطناعي.
                    </p>
                    
                    <div className="overflow-hidden rounded-xl border border-white/10 shadow-xl">
                        <table className="w-full text-left text-sm">
                        <thead className="bg-black/40 text-gray-400 font-bold uppercase">
                            <tr>
                            <th className="py-4 px-6">الأمر (Syntax)</th>
                            <th className="py-4 px-6">المعاملات</th>
                            <th className="py-4 px-6">الوصف</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-primary/50">
                            <tr className="hover:bg-white/5 transition">
                            <td className="py-4 px-6 font-mono text-accent font-bold">FORWARD</td>
                            <td className="py-4 px-6 text-gray-500">-</td>
                            <td className="py-4 px-6 text-gray-300">يحرك الروبوت خطوة واحدة (1 وحدة) للأمام.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition">
                            <td className="py-4 px-6 font-mono text-accent font-bold">BACKWARD</td>
                            <td className="py-4 px-6 text-gray-500">-</td>
                            <td className="py-4 px-6 text-gray-300">يحرك الروبوت خطوة واحدة للخلف.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition">
                            <td className="py-4 px-6 font-mono text-highlight font-bold">TURN_RIGHT</td>
                            <td className="py-4 px-6 text-gray-500">-</td>
                            <td className="py-4 px-6 text-gray-300">يدور الروبوت 90 درجة في اتجاه عقارب الساعة.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition">
                            <td className="py-4 px-6 font-mono text-highlight font-bold">TURN_LEFT</td>
                            <td className="py-4 px-6 text-gray-500">-</td>
                            <td className="py-4 px-6 text-gray-300">يدور الروبوت 90 درجة عكس اتجاه عقارب الساعة.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition">
                            <td className="py-4 px-6 font-mono text-purple-400 font-bold">WAIT</td>
                            <td className="py-4 px-6 text-gray-500">ms (اختياري)</td>
                            <td className="py-4 px-6 text-gray-300">يوقف الروبوت عن الحركة لدورة واحدة أو لمدة محددة.</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>

                    <div className="mt-8 bg-[#15191E] p-6 rounded-xl border border-white/10 font-mono text-sm shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 text-gray-600 opacity-20"><Code size={64} /></div>
                        <div className="flex items-center justify-between text-gray-500 mb-4 border-b border-white/5 pb-2 relative z-10">
                            <span>Example Code</span>
                        </div>
                        <div className="relative z-10 space-y-1">
                            <div className="text-gray-500 italic">// Move in a square pattern</div>
                            <div><span className="text-blue-400">FORWARD</span></div>
                            <div><span className="text-blue-400">FORWARD</span></div>
                            <div><span className="text-yellow-400">TURN_RIGHT</span></div>
                            <div><span className="text-blue-400">FORWARD</span></div>
                            <div><span className="text-blue-400">FORWARD</span></div>
                            <div><span className="text-yellow-400">TURN_RIGHT</span></div>
                        </div>
                    </div>
                    </article>
                )}

                {/* Components Section */}
                {activeSection === 'components' && (
                    <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><Wrench className="text-accent" /> دليل المكونات</h1>
                        <p className="text-gray-300 mb-8">
                            تعرف على وظائف المكونات المتاحة في المحاكي وكيفية تأثيرها على أداء الروبوت واستهلاك الطاقة.
                        </p>

                        <div className="grid gap-4">
                            {[
                                { name: 'محرك سيرفو (Servo Motor)', icon: Cpu, power: '2', color: 'text-yellow-500', bg: 'bg-yellow-500/20', desc: 'المحرك الأساسي للحركة. تركيبه في الجهة اليسرى أو اليمنى يسمح للروبوت بالدوران والتحرك.' },
                                { name: 'حساس مسافة (Ultrasonic)', icon: Activity, power: '1', color: 'text-blue-500', bg: 'bg-blue-500/20', desc: 'يقيس المسافة أمام الروبوت باستخدام الموجات الصوتية. مداه قصير نسبياً (حتى 5 مربعات) ولكنه يستهلك طاقة قليلة.' },
                                { name: 'ماسح ليزر (Lidar)', icon: Server, power: '3', color: 'text-red-500', bg: 'bg-red-500/20', desc: 'يوفر قراءات دقيقة جداً للمسافات البعيدة (حتى 10 مربعات). مفيد لرسم الخرائط ولكنه يستهلك طاقة أعلى.' }
                            ].map((comp, i) => (
                                <div key={i} className="bg-primary p-6 rounded-xl border border-white/5 hover:border-accent/30 transition shadow-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-white flex items-center gap-3">
                                            <span className={`p-2 rounded-lg ${comp.bg} ${comp.color}`}><comp.icon size={20} /></span>
                                            {comp.name}
                                        </h3>
                                        <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded">{comp.power}⚡ / tick</span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed pl-12">
                                        {comp.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </article>
                )}

                {/* AI Section */}
                {activeSection === 'ai' && (
                    <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><Cpu className="text-accent" /> تكامل الذكاء الاصطناعي</h1>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            تستخدم منصة مُلَقّن نماذج Gemini 2.5 Flash المتقدمة لتحويل اللغة الطبيعية إلى أوامر برمجية. هذا يسمح للمبتدئين بالتحكم في الروبوت بمجرد الوصف.
                        </p>
                        
                        <div className="grid gap-6">
                            <div className="bg-primary p-6 rounded-xl border border-white/5 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10">
                                    <Layers size={20} className="text-purple-400" />
                                    الترجمة الفورية (Translation)
                                </h3>
                                <p className="text-sm text-gray-400 mb-4 relative z-10">يحول الجمل مثل "تحرك للأمام ثم لف يمين" إلى:</p>
                                <code className="bg-black px-4 py-2 rounded-lg text-accent font-mono text-xs block w-fit relative z-10 shadow-inner border border-white/10">["FORWARD", "TURN_RIGHT"]</code>
                            </div>
                            
                            <div className="bg-primary p-6 rounded-xl border border-white/5 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10">
                                    <Activity size={20} className="text-blue-400" />
                                    تصحيح الأكواد (Debugging)
                                </h3>
                                <p className="text-sm text-gray-400 relative z-10">
                                    يمكنك لصق كود يحتوي على أخطاء في نافذة الدردشة، وسيقوم المساعد الذكي بتحديد الخطأ واقتراح التصحيح مع الشرح.
                                </p>
                            </div>
                        </div>
                    </article>
                )}

                {/* Troubleshooting Section */}
                {activeSection === 'troubleshooting' && (
                    <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><Activity className="text-accent" /> استكشاف الأخطاء</h1>
                        
                        <div className="space-y-6">
                            <div className="bg-red-900/10 border-r-4 border-red-500 p-6 rounded-r-xl">
                                <h3 className="text-white font-bold text-lg mb-2">الروبوت لا يتحرك رغم تشغيل الكود</h3>
                                <p className="text-gray-400 text-sm mb-2">الأسباب المحتملة:</p>
                                <ul className="list-disc list-inside text-gray-500 text-sm space-y-1">
                                    <li>لم تقم بتركيب محركات (Servos) في منافذ اليمين أو اليسار.</li>
                                    <li>البطارية نفدت (0%).</li>
                                    <li>هناك عائق (Obstacle) مباشرة أمام الروبوت.</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-900/10 border-r-4 border-yellow-500 p-6 rounded-r-xl">
                                <h3 className="text-white font-bold text-lg mb-2">ظهور رسالة "COLLISION DETECTED"</h3>
                                <p className="text-gray-400 text-sm">
                                    هذا يعني أن الروبوت اصطدم بجدار أو عائق. يؤدي الاصطدام إلى استنزاف سريع للبطارية (-5%). تأكد من استخدام حساس المسافة لتجنب العوائق برمجياً.
                                </p>
                            </div>

                            <div className="bg-blue-900/10 border-r-4 border-blue-500 p-6 rounded-r-xl">
                                <h3 className="text-white font-bold text-lg mb-2">المولد الذكي (AI) لا يعمل</h3>
                                <p className="text-gray-400 text-sm">
                                    تأكد من اتصالك بالإنترنت. يعتمد المولد على خوادم Google Cloud لمعالجة النصوص. إذا استمرت المشكلة، حاول صياغة الأمر بشكل أبسط.
                                </p>
                            </div>
                        </div>
                    </article>
                )}

                {/* API Section */}
                {activeSection === 'api' && (
                    <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><Server className="text-accent" /> API Reference</h1>
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 mb-8 text-sm flex items-center gap-2">
                            <Layers size={16} />
                            ملاحظة: هذه الـ API متاحة حالياً للمشتركين في الباقة الاحترافية (Pro) فقط.
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4">Endpoint: Execute Command</h3>
                        <div className="bg-[#15191E] rounded-xl overflow-hidden border border-white/10 font-mono text-sm mb-8 shadow-2xl">
                            <div className="bg-black/40 p-3 border-b border-white/5 flex items-center gap-3">
                                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold">POST</span>
                                <span className="text-gray-300">https://api.mulaqqen.com/v1/robot/execute</span>
                            </div>
                            <div className="p-6 text-gray-300">
                                <div className="text-gray-500 mb-2 italic">// Request Body</div>
                                <pre className="text-blue-300">{`{
  "robot_id": "bot_12345",
  "commands": ["FORWARD", "TURN_LEFT"],
  "sync": true
}`}</pre>
                                <div className="text-gray-500 mt-6 mb-2 italic">// Response (200 OK)</div>
                                <pre className="text-green-300">{`{
  "status": "success",
  "battery_remaining": 89,
  "position": { "x": 4, "y": 2 }
}`}</pre>
                            </div>
                        </div>
                    </article>
                )}

            </div>

        </div>
      </div>
    </div>
  );
};

export default Docs;
import React, { useState } from 'react';
import { Book, FileText, Terminal, Code, Cpu, Server, Layers, ChevronLeft } from 'lucide-react';

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('intro');

  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-secondary p-6 rounded-xl h-fit border border-white/10 sticky top-24">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <Book size={20} className="text-accent" />
            التوثيق التقني
          </h3>
          <nav className="space-y-1">
            <button 
                onClick={() => setActiveSection('intro')}
                className={`w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between group
                ${activeSection === 'intro' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}>
                مقدمة
                {activeSection === 'intro' && <ChevronLeft size={14} />}
            </button>
            <button 
                onClick={() => setActiveSection('setup')}
                className={`w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between group
                ${activeSection === 'setup' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}>
                تثبيت البيئة
                {activeSection === 'setup' && <ChevronLeft size={14} />}
            </button>
            <button 
                onClick={() => setActiveSection('commands')}
                className={`w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between group
                ${activeSection === 'commands' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}>
                أوامر الروبوت
                {activeSection === 'commands' && <ChevronLeft size={14} />}
            </button>
            <button 
                onClick={() => setActiveSection('ai')}
                className={`w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between group
                ${activeSection === 'ai' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}>
                الذكاء الاصطناعي (AI)
                {activeSection === 'ai' && <ChevronLeft size={14} />}
            </button>
            <button 
                onClick={() => setActiveSection('api')}
                className={`w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between group
                ${activeSection === 'api' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}>
                API Reference
                {activeSection === 'api' && <ChevronLeft size={14} />}
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-secondary p-8 md:p-10 rounded-xl border border-white/10 min-h-[600px]">
          
          {activeSection === 'intro' && (
              <article className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent"><FileText size={32} /></div>
                    <h1 className="text-3xl font-bold text-white">مرحباً بك في وثائق مُلَقّن</h1>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg mb-8">
                    توفر منصة مُلَقّن بيئة متكاملة لتعلم برمجة الروبوتات. سواء كنت تستخدم المحاكي الافتراضي الخاص بنا أو تقوم ببرمجة قطع هاردوير حقيقية (Arduino/ESP32)، ستجد هنا كل المعلومات التقنية التي تحتاجها.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-primary p-6 rounded-xl border border-white/5 hover:border-accent/50 transition cursor-pointer" onClick={() => setActiveSection('setup')}>
                        <Terminal className="text-green-400 mb-4" size={24} />
                        <h3 className="text-white font-bold mb-2">للمبتدئين</h3>
                        <p className="text-sm text-gray-400">ابدأ بتجهيز بيئة العمل وتشغيل أول كود لك في أقل من 5 دقائق.</p>
                    </div>
                    <div className="bg-primary p-6 rounded-xl border border-white/5 hover:border-accent/50 transition cursor-pointer" onClick={() => setActiveSection('api')}>
                        <Server className="text-purple-400 mb-4" size={24} />
                        <h3 className="text-white font-bold mb-2">للمطورين</h3>
                        <p className="text-sm text-gray-400">تصفح الـ API الخاص بنا لربط المحاكي بتطبيقات خارجية.</p>
                    </div>
                </div>
              </article>
          )}

          {activeSection === 'setup' && (
              <article className="animate-in fade-in duration-300">
                <h1 className="text-3xl font-bold text-white mb-6">تثبيت البيئة وتشغيل المحاكي</h1>
                <p className="text-gray-300 mb-6">
                    لا يتطلب محاكي مُلَقّن أي تثبيت برامج على جهازك، فهو يعمل بالكامل عبر المتصفح (Web-based). ومع ذلك، للحصول على أفضل أداء، نوصي بالتالي:
                </p>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 bg-primary p-4 rounded-lg border border-white/5">
                        <span className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                        <div>
                            <strong className="text-white block mb-1">متصفح حديث</strong>
                            <span className="text-gray-400 text-sm">نوصي باستخدام أحدث نسخة من Chrome أو Edge أو Firefox لدعم الرسوميات ثلاثية الأبعاد (WebGL).</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3 bg-primary p-4 rounded-lg border border-white/5">
                        <span className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                        <div>
                            <strong className="text-white block mb-1">اتصال إنترنت مستقر</strong>
                            <span className="text-gray-400 text-sm">لضمان تحميل مكتبات المحاكاة والتواصل مع خادم الذكاء الاصطناعي دون تقطيع.</span>
                        </div>
                    </li>
                </ul>
              </article>
          )}

          {activeSection === 'commands' && (
            <article className="animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-white mb-6">مرجع أوامر الروبوت</h1>
              <p className="text-gray-300 mb-8">
                  يستخدم الروبوت لغة مبسطة تعتمد على الأوامر المباشرة. يمكنك كتابة هذه الأوامر في المحرر النصي أو توليدها عبر الذكاء الاصطناعي.
              </p>
              
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-primary text-gray-400 font-bold uppercase">
                    <tr>
                      <th className="py-4 px-6">الأمر (Syntax)</th>
                      <th className="py-4 px-6">المعاملات (Params)</th>
                      <th className="py-4 px-6">الوصف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-secondary">
                    <tr className="hover:bg-white/5 transition">
                      <td className="py-4 px-6 font-mono text-accent">FORWARD</td>
                      <td className="py-4 px-6 text-gray-500">-</td>
                      <td className="py-4 px-6 text-gray-300">يحرك الروبوت خطوة واحدة (1 وحدة) للأمام.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition">
                      <td className="py-4 px-6 font-mono text-accent">BACKWARD</td>
                      <td className="py-4 px-6 text-gray-500">-</td>
                      <td className="py-4 px-6 text-gray-300">يحرك الروبوت خطوة واحدة للخلف.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition">
                      <td className="py-4 px-6 font-mono text-highlight">TURN_RIGHT</td>
                      <td className="py-4 px-6 text-gray-500">-</td>
                      <td className="py-4 px-6 text-gray-300">يدور الروبوت 90 درجة في اتجاه عقارب الساعة.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition">
                      <td className="py-4 px-6 font-mono text-highlight">TURN_LEFT</td>
                      <td className="py-4 px-6 text-gray-500">-</td>
                      <td className="py-4 px-6 text-gray-300">يدور الروبوت 90 درجة عكس اتجاه عقارب الساعة.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition">
                      <td className="py-4 px-6 font-mono text-purple-400">WAIT</td>
                      <td className="py-4 px-6 text-gray-500">ms (اختياري)</td>
                      <td className="py-4 px-6 text-gray-300">يوقف الروبوت عن الحركة لدورة واحدة أو لمدة محددة.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-[#1e1e1e] p-6 rounded-xl border border-white/10 font-mono text-sm">
                  <div className="flex items-center justify-between text-gray-500 mb-4 border-b border-white/5 pb-2">
                      <span>Example Code</span>
                      <Code size={16} />
                  </div>
                  <div className="text-green-400">// Move in a square pattern</div>
                  <div className="text-blue-300">FORWARD</div>
                  <div className="text-blue-300">FORWARD</div>
                  <div className="text-yellow-300">TURN_RIGHT</div>
                  <div className="text-blue-300">FORWARD</div>
                  <div className="text-blue-300">FORWARD</div>
                  <div className="text-yellow-300">TURN_RIGHT</div>
              </div>
            </article>
          )}

          {activeSection === 'ai' && (
              <article className="animate-in fade-in duration-300">
                  <h1 className="text-3xl font-bold text-white mb-6">تكامل الذكاء الاصطناعي</h1>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                      تستخدم منصة مُلَقّن نماذج Gemini 2.5 Flash المتقدمة لتحويل اللغة الطبيعية إلى أوامر برمجية. هذا يسمح للمبتدئين بالتحكم في الروبوت بمجرد الوصف.
                  </p>
                  
                  <div className="grid gap-6">
                      <div className="bg-primary p-6 rounded-xl border border-white/5">
                          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                              <Cpu size={20} className="text-purple-400" />
                              الترجمة الفورية (Translation)
                          </h3>
                          <p className="text-sm text-gray-400 mb-4">يحول الجمل مثل "تحرك للأمام ثم لف يمين" إلى:</p>
                          <code className="bg-black px-3 py-1 rounded text-accent font-mono text-xs">["FORWARD", "TURN_RIGHT"]</code>
                      </div>
                      
                      <div className="bg-primary p-6 rounded-xl border border-white/5">
                          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                              <Layers size={20} className="text-blue-400" />
                              تصحيح الأكواد (Debugging)
                          </h3>
                          <p className="text-sm text-gray-400">
                              يمكنك لصق كود يحتوي على أخطاء في نافذة الدردشة، وسيقوم المساعد الذكي بتحديد الخطأ واقتراح التصحيح مع الشرح.
                          </p>
                      </div>
                  </div>
              </article>
          )}

          {activeSection === 'api' && (
              <article className="animate-in fade-in duration-300">
                  <h1 className="text-3xl font-bold text-white mb-6">API Reference</h1>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 mb-8 text-sm">
                      ملاحظة: هذه الـ API متاحة حالياً للمشتركين في الباقة الاحترافية (Pro) فقط.
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">Endpoint: Execute Command</h3>
                  <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 font-mono text-sm mb-8">
                      <div className="bg-black/50 p-3 border-b border-white/5 flex items-center gap-3">
                          <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold">POST</span>
                          <span className="text-gray-300">https://api.mulaqqen.com/v1/robot/execute</span>
                      </div>
                      <div className="p-6 text-gray-300">
                          <div className="text-gray-500 mb-2">// Request Body</div>
                          <pre>{`{
  "robot_id": "bot_12345",
  "commands": ["FORWARD", "TURN_LEFT"],
  "sync": true
}`}</pre>
                          <div className="text-gray-500 mt-6 mb-2">// Response (200 OK)</div>
                          <pre>{`{
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
  );
};

export default Docs;
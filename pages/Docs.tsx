import React, { useState } from 'react';
import { Book, FileText, Terminal, Code, Cpu, Server, Layers, ChevronLeft, AlertOctagon, Wrench } from 'lucide-react';

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
                onClick={() => setActiveSection('components')}
                className={`w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between group
                ${activeSection === 'components' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}>
                دليل المكونات
                {activeSection === 'components' && <ChevronLeft size={14} />}
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
                onClick={() => setActiveSection('troubleshooting')}
                className={`w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between group
                ${activeSection === 'troubleshooting' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}>
                استكشاف الأخطاء
                {activeSection === 'troubleshooting' && <ChevronLeft size={14} />}
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

          {activeSection === 'components' && (
            <article className="animate-in fade-in duration-300">
                <h1 className="text-3xl font-bold text-white mb-6">دليل المكونات (Components Guide)</h1>
                <p className="text-gray-300 mb-6">
                    تعرف على وظائف المكونات المتاحة في المحاكي وكيفية تأثيرها على أداء الروبوت واستهلاك الطاقة.
                </p>

                <div className="grid gap-4">
                    <div className="bg-primary p-5 rounded-lg border border-white/5 hover:border-accent/30 transition">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <span className="p-1 bg-yellow-500/20 text-yellow-500 rounded"><Cpu size={16} /></span>
                                محرك سيرفو (Servo Motor)
                            </h3>
                            <span className="text-xs font-mono text-gray-400 border border-white/10 px-2 py-1 rounded">2⚡ / tick</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            المحرك الأساسي للحركة. تركيبه في الجهة اليسرى أو اليمنى يسمح للروبوت بالدوران والتحرك. 
                            <span className="text-red-400 block mt-1 text-xs">ملاحظة: بدون محركات، لن يستجيب الروبوت لأوامر الحركة.</span>
                        </p>
                    </div>

                    <div className="bg-primary p-5 rounded-lg border border-white/5 hover:border-accent/30 transition">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <span className="p-1 bg-blue-500/20 text-blue-500 rounded"><Activity size={16} /></span>
                                حساس مسافة (Ultrasonic)
                            </h3>
                            <span className="text-xs font-mono text-gray-400 border border-white/10 px-2 py-1 rounded">1⚡ / tick</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            يقيس المسافة أمام الروبوت باستخدام الموجات الصوتية. مداه قصير نسبياً (حتى 5 مربعات) ولكنه يستهلك طاقة قليلة.
                        </p>
                    </div>

                    <div className="bg-primary p-5 rounded-lg border border-white/5 hover:border-accent/30 transition">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <span className="p-1 bg-red-500/20 text-red-500 rounded"><Wrench size={16} /></span>
                                ماسح ليزر (Lidar)
                            </h3>
                            <span className="text-xs font-mono text-gray-400 border border-white/10 px-2 py-1 rounded">3⚡ / tick</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            يوفر قراءات دقيقة جداً للمسافات البعيدة (حتى 10 مربعات). مفيد لرسم الخرائط ولكنه يستهلك طاقة أعلى من حساس المسافة العادي.
                        </p>
                    </div>
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

          {activeSection === 'troubleshooting' && (
            <article className="animate-in fade-in duration-300">
                <h1 className="text-3xl font-bold text-white mb-6">استكشاف الأخطاء وإصلاحها</h1>
                
                <div className="space-y-6">
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                        <h3 className="text-white font-bold text-lg mb-2">الروبوت لا يتحرك رغم تشغيل الكود</h3>
                        <p className="text-gray-400 text-sm mb-2">الأسباب المحتملة:</p>
                        <ul className="list-disc list-inside text-gray-500 text-sm space-y-1">
                            <li>لم تقم بتركيب محركات (Servos) في منافذ اليمين أو اليسار.</li>
                            <li>البطارية نفدت (0%).</li>
                            <li>هناك عائق (Obstacle) مباشرة أمام الروبوت.</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4 py-1">
                        <h3 className="text-white font-bold text-lg mb-2">ظهور رسالة "COLLISION DETECTED"</h3>
                        <p className="text-gray-400 text-sm">
                            هذا يعني أن الروبوت اصطدم بجدار أو عائق. يؤدي الاصطدام إلى استنزاف سريع للبطارية (-5%). تأكد من استخدام حساس المسافة لتجنب العوائق برمجياً.
                        </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                        <h3 className="text-white font-bold text-lg mb-2">المولد الذكي (AI) لا يعمل</h3>
                        <p className="text-gray-400 text-sm">
                            تأكد من اتصالك بالإنترنت. يعتمد المولد على خوادم Google Cloud لمعالجة النصوص. إذا استمرت المشكلة، حاول صياغة الأمر بشكل أبسط (مثال: "تحرك للأمام" بدلاً من "انطلق يا بطل").
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
                          <span className
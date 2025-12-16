import React from 'react';
import { Shield, Lock, Eye, FileText, Server, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-6 border border-white/10">
             <Lock size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">سياسة الخصوصية</h1>
          <p className="text-gray-400">نحن ملتزمون بحماية بياناتك الشخصية بشفافية كاملة.</p>
        </div>

        <div className="bg-secondary rounded-3xl border border-white/10 p-8 md:p-12 space-y-12 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Bg */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <section className="relative">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-accent/10 rounded-lg text-accent"><Shield size={24} /></div>
               <h2 className="text-xl font-bold text-white">1. مقدمة</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              نحن في "مُلَقّن" نأخذ خصوصيتك على محمل الجد. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدامك لمنصتنا التعليمية، ومتجرنا الإلكتروني، وأدوات المحاكاة الخاصة بنا. باستخدامك للموقع، فإنك توافق على الممارسات الموضحة في هذه السياسة.
            </p>
          </section>

          <section className="relative border-t border-white/5 pt-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Eye size={24} /></div>
               <h2 className="text-xl font-bold text-white">2. المعلومات التي نجمعها</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-primary/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-400" /> معلومات الحساب</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">الاسم، البريد الإلكتروني، وكلمة المرور (المشفرة) التي تقدمها عند التسجيل.</p>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><CardIcon className="w-4 h-4 text-gray-400" /> معلومات الدفع</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">تتم معالجة المدفوعات عبر بوابات آمنة (مثل Stripe)؛ لا نخزن أرقام البطاقات.</p>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><ActivityIcon className="w-4 h-4 text-gray-400" /> بيانات الاستخدام</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">تقدمك في الدورات، الأكواد في المحاكي، وتفاعلاتك لتحسين التجربة.</p>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><DeviceIcon className="w-4 h-4 text-gray-400" /> بيانات الجهاز</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">نوع المتصفح، عنوان IP، ونظام التشغيل لأغراض الأمان.</p>
                </div>
            </div>
          </section>

          <section className="relative border-t border-white/5 pt-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><FileText size={24} /></div>
               <h2 className="text-xl font-bold text-white">3. كيف نستخدم معلوماتك</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4">
              نستخدم البيانات التي نجمعها للأغراض التالية:
            </p>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span className="text-gray-300 text-sm"><strong>توفير الخدمة:</strong> إدارة حسابك، وتتبع تقدمك التعليمي، وإصدار الشهادات.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span className="text-gray-300 text-sm"><strong>التحسين:</strong> تحليل سلوك المستخدمين لتحسين المحاكي والمناهج.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span className="text-gray-300 text-sm"><strong>التواصل:</strong> إرسال الفواتير، تحديثات الدورات، والرد على الدعم.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span className="text-gray-300 text-sm"><strong>الأمان:</strong> كشف ومنع الأنشطة الاحتيالية.</span>
                </li>
            </ul>
          </section>

          <section className="relative border-t border-white/5 pt-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Server size={24} /></div>
               <h2 className="text-xl font-bold text-white">4. حماية البيانات</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base bg-green-900/10 border border-green-500/10 p-4 rounded-xl">
              نطبق تدابير أمنية تقنية وإدارية صارمة لحماية بياناتك من الوصول غير المصرح به. نستخدم تشفير SSL لجميع الاتصالات، ونقوم بتخزين البيانات في خوادم سحابية مؤمنة (AWS/Google Cloud) مع نسخ احتياطي دوري.
            </p>
          </section>

          <section className="relative border-t border-white/5 pt-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><Globe size={24} /></div>
               <h2 className="text-xl font-bold text-white">5. ملفات تعريف الارتباط (Cookies)</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك، مثل تذكر حالة تسجيل الدخول وتفضيلات اللغة. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
            </p>
          </section>

          <section className="pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm text-center">
              لأي استفسارات بخصوص سياسة الخصوصية، يرجى التواصل معنا عبر: <a href="mailto:privacy@mulaqqen.com" className="text-accent hover:underline">privacy@mulaqqen.com</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

// Helper Icons
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const CardIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);
const ActivityIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const DeviceIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
);

export default Privacy;
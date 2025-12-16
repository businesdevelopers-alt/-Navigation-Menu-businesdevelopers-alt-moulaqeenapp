import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">سياسة الخصوصية</h1>
          <p className="text-gray-400">آخر تحديث: 20 مارس 2024</p>
        </div>

        <div className="bg-secondary rounded-2xl border border-white/10 p-8 md:p-12 space-y-10">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-accent/10 rounded-lg text-accent"><Shield size={24} /></div>
               <h2 className="text-xl font-bold text-white">1. مقدمة</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              نحن في "مُلَقّن" نأخذ خصوصيتك على محمل الجد. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدامك لمنصتنا التعليمية، ومتجرنا الإلكتروني، وأدوات المحاكاة الخاصة بنا. باستخدامك للموقع، فإنك توافق على الممارسات الموضحة في هذه السياسة.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Eye size={24} /></div>
               <h2 className="text-xl font-bold text-white">2. المعلومات التي نجمعها</h2>
            </div>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong className="text-white">معلومات الحساب:</strong> الاسم، البريد الإلكتروني، وكلمة المرور المشفرة عند التسجيل.</li>
              <li><strong className="text-white">معلومات الدفع:</strong> تتم معالجة المدفوعات عبر بوابات دفع خارجية آمنة؛ لا نقوم بتخزين تفاصيل بطاقتك الائتمانية على خوادمنا.</li>
              <li><strong className="text-white">بيانات الاستخدام:</strong> تقدمك في الدورات، الأكواد التي تكتبها في المحاكي، وتفاعلاتك مع النظام لتحسين تجربة التعلم.</li>
              <li><strong className="text-white">بيانات الجهاز:</strong> نوع المتصفح، عنوان IP، ونظام التشغيل لأغراض الأمان والتحليل.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><FileText size={24} /></div>
               <h2 className="text-xl font-bold text-white">3. كيف نستخدم معلوماتك</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4">
              نستخدم البيانات التي نجمعها للأغراض التالية:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-primary p-4 rounded-lg border border-white/5">
                  <h4 className="text-white font-bold mb-2 text-sm">توفير الخدمة</h4>
                  <p className="text-gray-400 text-xs">لإدارة حسابك، وتتبع تقدمك التعليمي، وإصدار الشهادات.</p>
               </div>
               <div className="bg-primary p-4 rounded-lg border border-white/5">
                  <h4 className="text-white font-bold mb-2 text-sm">التحسين والتطوير</h4>
                  <p className="text-gray-400 text-xs">لتحليل كيفية استخدام الطلاب للمحاكي وتحسين الخوارزميات التعليمية.</p>
               </div>
               <div className="bg-primary p-4 rounded-lg border border-white/5">
                  <h4 className="text-white font-bold mb-2 text-sm">التواصل</h4>
                  <p className="text-gray-400 text-xs">لإرسال تحديثات الدورات، الفواتير، والرد على استفسارات الدعم.</p>
               </div>
               <div className="bg-primary p-4 rounded-lg border border-white/5">
                  <h4 className="text-white font-bold mb-2 text-sm">الأمان</h4>
                  <p className="text-gray-400 text-xs">لكشف ومنع الأنشطة الاحتيالية أو غير المصرح بها.</p>
               </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Lock size={24} /></div>
               <h2 className="text-xl font-bold text-white">4. حماية البيانات</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              نطبق تدابير أمنية تقنية وإدارية صارمة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف. نستخدم تشفير SSL لجميع الاتصالات ونقوم بنسخ احتياطي دوري للبيانات.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك، مثل تذكر حالة تسجيل الدخول وتفضيلات اللغة. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
            </p>
          </section>

          <section className="pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              لأي استفسارات بخصوص سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني: <span className="text-accent">privacy@mulaqqen.com</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;
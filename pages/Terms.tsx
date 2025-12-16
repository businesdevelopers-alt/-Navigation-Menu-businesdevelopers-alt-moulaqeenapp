import React from 'react';
import { FileCheck, AlertTriangle, Scale, CreditCard, Ban, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-6 border border-white/10">
             <FileCheck size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">شروط الاستخدام</h1>
          <p className="text-gray-400">آخر تحديث: 20 مارس 2024</p>
        </div>

        <div className="bg-secondary rounded-3xl border border-white/10 p-8 md:p-12 space-y-12 shadow-2xl">
          
          <section className="relative">
            <div className="flex items-start gap-4">
               <div className="p-3 bg-accent/10 rounded-xl text-accent flex-shrink-0"><ShieldCheck size={24} /></div>
               <div>
                  <h2 className="text-xl font-bold text-white mb-3">1. الموافقة على الشروط</h2>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    أهلاً بك في منصة "مُلَقّن". بمجرد الوصول إلى هذا الموقع أو استخدامه، أو شراء أي من منتجاتنا أو دوراتنا، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام المنصة.
                  </p>
               </div>
            </div>
          </section>

          <section className="relative border-t border-white/5 pt-10">
            <div className="flex items-start gap-4">
               <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 flex-shrink-0"><Scale size={24} /></div>
               <div>
                   <h2 className="text-xl font-bold text-white mb-3">2. حقوق الملكية الفكرية</h2>
                   <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4">
                     جميع المحتويات الموجودة على المنصة، بما في ذلك النصوص، الرسومات، الشعارات، الصور، المقاطع الصوتية، التنزيلات الرقمية، والبرمجيات (بما في ذلك كود المحاكي)، هي ملك لـ "مُلَقّن" أو موردي المحتوى التابعين لها ومحمية بموجب قوانين حقوق النشر الدولية والمحلية.
                   </p>
                   <div className="bg-primary/50 border-r-4 border-yellow-500 p-4 rounded-lg">
                       <p className="text-sm text-gray-300">
                           <strong>تنبيه هام:</strong> يُمنع منعاً باتاً نسخ أو إعادة توزيع أو بيع أو تأجير أي جزء من المحتوى التعليمي أو البرمجي دون إذن كتابي صريح منا.
                       </p>
                   </div>
               </div>
            </div>
          </section>

          <section className="relative border-t border-white/5 pt-10">
            <div className="flex items-start gap-4">
               <div className="p-3 bg-green-500/10 rounded-xl text-green-400 flex-shrink-0"><CreditCard size={24} /></div>
               <div>
                   <h2 className="text-xl font-bold text-white mb-3">3. المشتريات والاسترجاع</h2>
                   <ul className="space-y-3">
                     <li className="flex items-start gap-2 text-gray-300 text-sm md:text-base">
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5"></span>
                         <span><strong>الدفع:</strong> يجب دفع جميع الرسوم المرتبطة بالدورات أو المنتجات المادية بالكامل قبل الوصول إليها أو شحنها.</span>
                     </li>
                     <li className="flex items-start gap-2 text-gray-300 text-sm md:text-base">
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5"></span>
                         <span><strong>سياسة الاسترجاع للدورات:</strong> نقدم ضمان استرجاع الأموال لمدة 14 يوماً للدورات الرقمية، بشرط ألا تكون قد أكملت أكثر من 30% من محتوى الدورة.</span>
                     </li>
                     <li className="flex items-start gap-2 text-gray-300 text-sm md:text-base">
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5"></span>
                         <span><strong>سياسة الاسترجاع للمتجر:</strong> يمكن إرجاع المنتجات المادية غير المستخدمة في غلافها الأصلي خلال 14 يوماً من الاستلام. يتحمل العميل تكاليف الشحن للإرجاع ما لم يكن المنتج معيباً.</span>
                     </li>
                   </ul>
               </div>
            </div>
          </section>

          <section className="relative border-t border-white/5 pt-10">
            <div className="flex items-start gap-4">
               <div className="p-3 bg-red-500/10 rounded-xl text-red-400 flex-shrink-0"><Ban size={24} /></div>
               <div>
                   <h2 className="text-xl font-bold text-white mb-3">4. الاستخدام المحظور</h2>
                   <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-3">
                     أنت توافق على عدم استخدام المنصة لأي من الأغراض التالية:
                   </p>
                   <ul className="grid md:grid-cols-2 gap-3">
                       <li className="bg-primary/50 p-3 rounded-lg text-sm text-gray-300 border border-white/5">استخدام المحاكي لأغراض تخريبية أو محاولة اختراق خوادم الموقع.</li>
                       <li className="bg-primary/50 p-3 rounded-lg text-sm text-gray-300 border border-white/5">مشاركة بيانات حسابك مع أشخاص آخرين.</li>
                       <li className="bg-primary/50 p-3 rounded-lg text-sm text-gray-300 border border-white/5">نشر محتوى مسيء أو غير قانوني في المنتديات.</li>
                       <li className="bg-primary/50 p-3 rounded-lg text-sm text-gray-300 border border-white/5">استخدام أدوات آلية (Bots) لجمع البيانات من الموقع.</li>
                   </ul>
               </div>
            </div>
          </section>

          <section className="relative border-t border-white/5 pt-10">
            <div className="flex items-start gap-4">
               <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 flex-shrink-0"><AlertTriangle size={24} /></div>
               <div>
                   <h2 className="text-xl font-bold text-white mb-3">5. إخلاء المسؤولية</h2>
                   <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                     يتم توفير خدماتنا "كما هي". لا تضمن "مُلَقّن" أن الخدمة ستكون خالية من الأخطاء أو غير منقطعة. نحن غير مسؤولين عن أي أضرار مباشرة أو غير مباشرة قد تنشأ عن استخدامك للمنصة أو عدم قدرتك على استخدامها، بما في ذلك فقدان البيانات أو تعطل الأجهزة.
                   </p>
               </div>
            </div>
          </section>

          <section className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              لدينا الحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بالتغييرات الجوهرية.
            </p>
            <Link to="/support" className="flex items-center gap-2 text-accent text-sm font-bold hover:underline">
               <HelpCircle size={16} />
               لديك استفسار؟
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
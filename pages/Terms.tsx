import React from 'react';
import { FileCheck, AlertTriangle, Scale, CreditCard, Ban } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">شروط الاستخدام</h1>
          <p className="text-gray-400">آخر تحديث: 20 مارس 2024</p>
        </div>

        <div className="bg-secondary rounded-2xl border border-white/10 p-8 md:p-12 space-y-10">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-accent/10 rounded-lg text-accent"><FileCheck size={24} /></div>
               <h2 className="text-xl font-bold text-white">1. الموافقة على الشروط</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              أهلاً بك في منصة "مُلَقّن". بمجرد الوصول إلى هذا الموقع أو استخدامه، أو شراء أي من منتجاتنا أو دوراتنا، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام المنصة.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><Scale size={24} /></div>
               <h2 className="text-xl font-bold text-white">2. حقوق الملكية الفكرية</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-3">
              جميع المحتويات الموجودة على المنصة، بما في ذلك النصوص، الرسومات، الشعارات، الصور، المقاطع الصوتية، التنزيلات الرقمية، والبرمجيات (بما في ذلك كود المحاكي)، هي ملك لـ "مُلَقّن" أو موردي المحتوى التابعين لها ومحمية بموجب قوانين حقوق النشر الدولية والمحلية.
            </p>
            <div className="bg-primary/50 border-r-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-gray-300">
                    <strong>يُمنع منعاً باتاً:</strong> نسخ أو إعادة توزيع أو بيع أو تأجير أي جزء من المحتوى التعليمي أو البرمجي دون إذن كتابي صريح منا.
                </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><CreditCard size={24} /></div>
               <h2 className="text-xl font-bold text-white">3. المشتريات والاسترجاع</h2>
            </div>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>الدفع:</strong> يجب دفع جميع الرسوم المرتبطة بالدورات أو المنتجات المادية بالكامل قبل الوصول إليها أو شحنها.</li>
              <li><strong>سياسة الاسترجاع للدورات:</strong> نقدم ضمان استرجاع الأموال لمدة 14 يوماً للدورات الرقمية، بشرط ألا تكون قد أكملت أكثر من 30% من محتوى الدورة.</li>
              <li><strong>سياسة الاسترجاع للمتجر:</strong> يمكن إرجاع المنتجات المادية غير المستخدمة في غلافها الأصلي خلال 14 يوماً من الاستلام. يتحمل العميل تكاليف الشحن للإرجاع ما لم يكن المنتج معيباً.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><Ban size={24} /></div>
               <h2 className="text-xl font-bold text-white">4. الاستخدام المحظور</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-2">
              أنت توافق على عدم استخدام المنصة لأي من الأغراض التالية:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>استخدام المحاكي لأغراض تخريبية أو محاولة اختراق خوادم الموقع.</li>
                <li>مشاركة حسابك مع أشخاص آخرين (الحساب شخصي).</li>
                <li>نشر محتوى مسيء أو غير قانوني في المنتديات أو تعليقات الدروس.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><AlertTriangle size={24} /></div>
               <h2 className="text-xl font-bold text-white">5. إخلاء المسؤولية</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              يتم توفير خدماتنا "كما هي". لا تضمن "مُلَقّن" أن الخدمة ستكون خالية من الأخطاء أو غير منقطعة. نحن غير مسؤولين عن أي أضرار مباشرة أو غير مباشرة قد تنشأ عن استخدامك للمنصة أو عدم قدرتك على استخدامها، بما في ذلك فقدان البيانات أو تعطل الأجهزة.
            </p>
          </section>

          <section className="pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز على الموقع.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
import React, { useState } from 'react';
import { Mail, MessageCircle, Search, ChevronDown, ChevronUp, Book, CreditCard, User, Cpu, HelpCircle } from 'lucide-react';

const FAQ_CATEGORIES = [
  { id: 'general', name: 'عام', icon: HelpCircle },
  { id: 'account', name: 'الحساب', icon: User },
  { id: 'payment', name: 'المدفوعات', icon: CreditCard },
  { id: 'technical', name: 'تقني', icon: Cpu },
  { id: 'courses', name: 'الدورات', icon: Book },
];

const FAQS = [
  { category: 'technical', q: 'كيف يمكنني البدء في المحاكي؟', a: 'فقط اذهب إلى صفحة المحاكي، واكتب أوامرك في المحرر أو استخدم المساعد الذكي.' },
  { category: 'general', q: 'هل المتجر يشحن لجميع الدول؟', a: 'حالياً نشحن داخل المملكة العربية السعودية ودول الخليج.' },
  { category: 'account', q: 'كيف أستعيد كلمة المرور؟', a: 'من صفحة تسجيل الدخول، اضغط على "نسيت كلمة المرور" واتبع التعليمات.' },
  { category: 'courses', q: 'هل الشهادات معتمدة؟', a: 'نعم، جميع الشهادات التي تحصل عليها بعد إتمام الدورات معتمدة من منصة مُلَقّن ويمكن إضافتها إلى ملفك المهني أو LinkedIn.' },
  { category: 'payment', q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل جميع البطاقات الائتمانية (Visa, MasterCard)، مدى، وApple Pay لضمان سهولة الدفع.' },
  { category: 'courses', q: 'هل أحتاج لخبرة سابقة في البرمجة؟', a: 'لدينا مسارات مخصصة للمبتدئين تبدأ من الصفر، فلا تقلق إذا لم تكن لديك خبرة سابقة. نوفر شروحات مبسطة تناسب الجميع.' },
  { category: 'technical', q: 'هل يعمل المحاكي على الجوال؟', a: 'نعم، المحاكي مصمم ليكون متجاوباً مع جميع الأجهزة اللوحية والهواتف، ولكن نوصي باستخدام الكمبيوتر للحصول على أفضل تجربة برمجية.' },
  { category: 'payment', q: 'كيف يمكنني استرجاع مبلغ الدورة؟', a: 'نقدم ضمان استرجاع الأموال خلال 14 يوماً من الشراء إذا لم تكن راضياً عن المحتوى، بشرط عدم إكمال أكثر من 30% من الدورة.' },
];

const Support: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-primary py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">مركز المساعدة</h1>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            ابحث في قاعدة المعرفة الخاصة بنا أو تواصل معنا مباشرة للحصول على المساعدة.
          </p>
          <div className="relative max-w-xl mx-auto group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سؤال أو مشكلة..." 
              className="w-full bg-secondary border border-white/10 rounded-xl py-4 px-12 text-gray-200 focus:border-accent focus:outline-none shadow-lg transition-all group-hover:border-white/20"
            />
            <Search className="absolute right-4 top-4 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <button 
                onClick={() => setSelectedCategory('all')}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2
                    ${selectedCategory === 'all' 
                        ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                        : 'bg-secondary text-gray-400 border-white/5 hover:bg-white/5 hover:text-white'
                    }
                `}
            >
                <HelpCircle size={24} />
                <span className="text-sm font-bold">الكل</span>
            </button>
            {FAQ_CATEGORIES.map(cat => (
                <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2
                        ${selectedCategory === cat.id 
                            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                            : 'bg-secondary text-gray-400 border-white/5 hover:bg-white/5 hover:text-white'
                        }
                    `}
                >
                    <cat.icon size={24} />
                    <span className="text-sm font-bold">{cat.name}</span>
                </button>
            ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-accent pr-4">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
              <div key={idx} className="bg-secondary rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-right"
                >
                  <span className="font-bold text-gray-200">{faq.q}</span>
                  <div className={`transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} className="text-gray-500" />
                  </div>
                </button>
                <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mt-2">
                        {faq.a}
                    </div>
                </div>
              </div>
            )) : (
                <div className="text-center py-10 text-gray-500">
                    لا توجد نتائج مطابقة لبحثك.
                </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-secondary rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-blue-400 to-accent"></div>
          <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">لم تجد إجابة؟</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                    فريق الدعم لدينا جاهز لمساعدتك في أي وقت. املأ النموذج وسنقوم بالرد عليك خلال 24 ساعة.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent">
                            <Mail size={18} />
                        </div>
                        <span className="font-mono text-sm">support@mulaqqen.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent">
                            <MessageCircle size={18} />
                        </div>
                        <span className="font-mono text-sm">Live Chat (Available 9-5)</span>
                    </div>
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">الاسم</label>
                    <input type="text" className="w-full bg-primary border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">البريد الإلكتروني</label>
                    <input type="email" className="w-full bg-primary border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">الرسالة</label>
                  <textarea rows={4} className="w-full bg-primary border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors"></textarea>
                </div>
                <button type="button" className="w-full bg-accent hover:bg-accentHover text-white px-6 py-3.5 rounded-lg font-bold transition shadow-lg shadow-accent/20">
                  إرسال الاستفسار
                </button>
              </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
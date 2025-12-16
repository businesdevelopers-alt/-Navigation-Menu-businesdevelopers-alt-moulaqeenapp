import React from 'react';
import { Cpu, Battery, Weight, Move, ArrowRight, Zap, Target, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RobotProject {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  specs: {
    weight: string;
    battery: string;
    speed: string;
    processor: string;
  };
  features: string[];
}

const PROJECTS: RobotProject[] = [
  {
    id: '1',
    name: 'X-Rover Explorer',
    category: 'استكشاف',
    description: 'روبوت استكشافي متعدد التضاريس مصمم للبيئات الوعرة. يعتمد على نظام تعليق مستقل لكل عجلة.',
    image: 'https://images.unsplash.com/photo-1534723328310-e82dad3af43f?auto=format&fit=crop&q=80&w=800',
    specs: {
      weight: '4.5 kg',
      battery: '5000 mAh',
      speed: '2 m/s',
      processor: 'Raspberry Pi 4'
    },
    features: ['نظام تجنب العقبات', 'بث فيديو مباشر 4K', 'ذراع التقاط عينات']
  },
  {
    id: '2',
    name: 'Titan Arm V3',
    category: 'صناعي',
    description: 'ذراع روبوتية دقيقة بـ 6 محاور حرية، مثالية لخطوط التجميع والمهام الدقيقة.',
    image: 'https://images.unsplash.com/photo-1561144257-e1555cb6d518?auto=format&fit=crop&q=80&w=800',
    specs: {
      weight: '8.2 kg',
      battery: 'AC Power',
      speed: '1.5 rad/s',
      processor: 'STM32'
    },
    features: ['دقة تصل إلى 0.1 ملم', 'قابلة للبرمجة بـ Python', 'مقبض قابل للتغيير']
  },
  {
    id: '3',
    name: 'AeroGuard Drone',
    category: 'مراقبة',
    description: 'طائرة بدون طيار ذاتية القيادة للمراقبة الجوية ورسم الخرائط ثلاثية الأبعاد.',
    image: 'https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=800',
    specs: {
      weight: '1.2 kg',
      battery: '30 mins',
      speed: '15 m/s',
      processor: 'Nvidia Jetson'
    },
    features: ['تحديد المواقع GPS/RTK', 'مقاومة للرياح', 'تصوير حراري']
  },
  {
    id: '4',
    name: 'Hexa-Spider',
    category: 'تعليمي',
    description: 'روبوت سداسي الأرجل يحاكي حركة الحشرات، ممتاز لدراسة الكينماتيكا العكسية.',
    image: 'https://images.unsplash.com/photo-1535378437327-10f76365c4df?auto=format&fit=crop&q=80&w=800',
    specs: {
      weight: '2.1 kg',
      battery: '2200 mAh',
      speed: '0.5 m/s',
      processor: 'Arduino Mega'
    },
    features: ['18 محرك سيرفو', 'توازن ديناميكي', 'تحكم عبر البلوتوث']
  },
  {
    id: '5',
    name: 'MediBot Assistant',
    category: 'خدمي',
    description: 'روبوت مساعد للمستشفيات لنقل الأدوية والتعامل مع المرضى عن بعد.',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800',
    specs: {
      weight: '15 kg',
      battery: '8 Hours',
      speed: '1 m/s',
      processor: 'Intel NUC'
    },
    features: ['ملاحة داخلية (SLAM)', 'شاشة تفاعلية', 'تعقيم ذاتي']
  },
  {
    id: '6',
    name: 'AquaDive Pro',
    category: 'بحري',
    description: 'روبوت غواص (ROV) لاستكشاف الأعماق وفحص هياكل السفن.',
    image: 'https://images.unsplash.com/photo-1627845348873-10e3039f60f6?auto=format&fit=crop&q=80&w=800',
    specs: {
      weight: '6.0 kg',
      battery: '4 Hours',
      speed: '3 knots',
      processor: 'Raspberry Pi'
    },
    features: ['عمق حتى 100 متر', 'كشافات LED قوية', 'مخلب التقاط']
  }
];

const RobotsGallery: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary font-sans text-gray-200 selection:bg-accent/30">
      
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10 pointer-events-none"></div>
        <div className="absolute -top-[20%] right-[10%] w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-accent mb-6 animate-fade-in">
             <PenTool size={12} />
             <span>ENGINEERING SHOWCASE</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight animate-in slide-in-from-right duration-500">
             ابتكاراتنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">الهندسية</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed mb-10 animate-in slide-in-from-right duration-700 delay-100">
            نستعرض هنا مجموعة من الروبوتات التي قمنا بتصميمها وتطويرها في مختبرات مُلَقّن. كل نموذج يمثل تحدياً هندسياً فريداً وحلاً مبتكراً.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((robot, idx) => (
            <div 
              key={robot.id} 
              className="group relative bg-[#15191E] rounded-3xl border border-white/5 overflow-hidden hover:border-accent/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(45,137,229,0.15)] animate-in zoom-in-95"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] to-transparent opacity-80 z-10"></div>
                
                {/* Badge */}
                <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/10 shadow-lg uppercase tracking-wider">
                        {robot.category}
                    </span>
                </div>

                <img 
                  src={robot.image} 
                  alt={robot.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 relative z-20 -mt-12">
                 <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{robot.name}</h3>
                 <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2">
                    {robot.description}
                 </p>

                 {/* Tech Specs Grid */}
                 <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-primary/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                        <Weight size={16} className="text-gray-500" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">الوزن</div>
                            <div className="text-xs font-bold text-white font-mono">{robot.specs.weight}</div>
                        </div>
                    </div>
                    <div className="bg-primary/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                        <Battery size={16} className="text-green-500" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">البطارية</div>
                            <div className="text-xs font-bold text-white font-mono">{robot.specs.battery}</div>
                        </div>
                    </div>
                    <div className="bg-primary/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                        <Move size={16} className="text-blue-500" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">السرعة</div>
                            <div className="text-xs font-bold text-white font-mono">{robot.specs.speed}</div>
                        </div>
                    </div>
                    <div className="bg-primary/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                        <Cpu size={16} className="text-purple-500" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">المعالج</div>
                            <div className="text-xs font-bold text-white font-mono">{robot.specs.processor}</div>
                        </div>
                    </div>
                 </div>

                 {/* Features List */}
                 <div className="space-y-2 mb-6">
                    {robot.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                            <Zap size={12} className="text-accent" />
                            {feature}
                        </div>
                    ))}
                 </div>

                 <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition flex items-center justify-center gap-2 text-sm font-bold group/btn">
                    عرض التفاصيل التقنية
                    <ArrowRight size={16} className="group-hover/btn:-translate-x-1 transition-transform" />
                 </button>
              </div>

            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-accent/20 to-transparent rounded-3xl p-1 border border-white/10">
            <div className="bg-[#15191E] rounded-[22px] p-10 md:p-16 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <Target className="mx-auto text-accent mb-6 relative z-10" size={48} />
                <h2 className="text-3xl font-bold text-white mb-4 relative z-10">لديك فكرة روبوت؟</h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8 relative z-10">
                    يمكننا مساعدتك في تحويل فكرتك إلى نموذج أولي يعمل بكفاءة. فريقنا الهندسي جاهز لتقديم الاستشارات والتصاميم.
                </p>
                <Link to="/support" className="relative z-10 inline-flex items-center px-8 py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition shadow-lg hover:scale-105">
                    اطلب استشارة هندسية
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RobotsGallery;
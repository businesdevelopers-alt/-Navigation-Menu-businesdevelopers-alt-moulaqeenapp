import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Battery, Weight, Move, ArrowRight, Zap, Target, PenTool, Layers, Filter, X, Maximize2, Share2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RobotProject {
  id: string;
  name: string;
  category: string;
  description: string;
  fullDescription?: string;
  image: string;
  gallery?: string[];
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
    description: 'روبوت استكشافي متعدد التضاريس مصمم للبيئات الوعرة. يعتمد على نظام تعليق مستقل.',
    fullDescription: 'تم تصميم X-Rover ليكون الحل الأمثل لمهام الاستكشاف في البيئات الخطرة أو التي يصعب الوصول إليها. يتميز بنظام دفع سداسي العجلات مع تعليق مستقل لكل عجلة، مما يسمح له بتسلق العقبات بزاوية تصل إلى 45 درجة. مزود بكاميرات حرارية ومستشعرات غاز.',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop',
    gallery: [
        'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop'
    ],
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
    fullDescription: 'ذراع Titan V3 تمثل قمة الدقة في الروبوتات الصناعية الخفيفة. بفضل محركاتها المؤازرة (Servos) عالية العزم وخوارزميات التحكم المتقدمة، يمكنها أداء مهام التجميع واللحام بدقة تصل إلى 0.1 ملم. تدعم البرمجة المباشرة عبر التحريك اليدوي (Lead-through programming).',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
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
    fullDescription: 'طائرة AeroGuard مصممة للمهام الأمنية والمسح الجوي. تعتمد على نظام ملاحة مزدوج (GPS + Vision) للعمل حتى في البيئات التي تفتقر لإشارة الأقمار الصناعية. هيكلها المصنوع من ألياف الكربون يمنحها خفة وقوة استثنائية.',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop',
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
    fullDescription: 'مشروع تعليمي مفتوح المصدر يهدف لتعليم طلاب الهندسة مفاهيم الحركة المعقدة (Locomotion). يحتوي الروبوت على 18 محرك سيرفو، مما يمنحه حرية حركة تحاكي العناكب الحقيقية. يمكن التحكم به عبر تطبيق هاتف أو ذراع تحكم.',
    image: 'https://images.unsplash.com/photo-1563770095125-e6a07a6809f5?q=80&w=800&auto=format&fit=crop',
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
    fullDescription: 'روبوت مستقل الحركة قادر على التنقل في ممرات المستشفيات المزدحمة وتفادي البشر. مزود بشاشة تفاعلية للتواصل بين الطبيب والمريض، وصندوق معقم لنقل العينات الطبية والأدوية.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
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
    fullDescription: 'روبوت تحت مائي صغير الحجم وقوي الأداء. يستخدم لفحص بدن السفن، استكشاف الشعاب المرجانية، والبحث والإنقاذ. مزود بكشافات LED قوية وكاميرا عالية الدقة تعمل في ظروف الإضاءة المنخفضة.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    specs: {
      weight: '6.0 kg',
      battery: '4 Hours',
      speed: '3 knots',
      processor: 'Raspberry Pi'
    },
    features: ['عمق حتى 100 متر', 'كشافات LED قوية', 'مخلب التقاط']
  }
];

const CATEGORIES = ['الكل', 'صناعي', 'تعليمي', 'استكشاف', 'مراقبة', 'خدمي', 'بحري'];

interface ProjectCardProps {
  robot: RobotProject;
  index: number;
  onClick: (r: RobotProject) => void;
}

// Individual Project Card Component with Scroll Animation
// Fix: Added React.FC type to handle 'key' prop correctly in JSX
const ProjectCard: React.FC<ProjectCardProps> = ({ robot, index, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`group relative bg-[#15191E] rounded-3xl border border-white/5 overflow-hidden hover:border-accent/40 transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col h-full
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
      `}
      style={{ transitionDelay: `${(index % 3) * 150}ms` }}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-black/50">
        <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] via-transparent to-transparent opacity-90 z-10"></div>
        
        {/* Floating Badge */}
        <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/10 shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                <Target size={12} className="text-accent" />
                {robot.category}
            </span>
        </div>

        <img 
          src={robot.image} 
          alt={robot.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Overlay Action */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
            <button 
                onClick={() => onClick(robot)}
                className="px-6 py-3 bg-accent text-white rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
            >
                <Maximize2 size={16} />
                عرض التفاصيل
            </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 pt-2 flex flex-col flex-1 relative z-20">
         <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors">{robot.name}</h3>
         </div>
         
         <p className="text-gray-400 text-xs mb-6 leading-relaxed line-clamp-2">
            {robot.description}
         </p>

         {/* Mini Specs Row */}
         <div className="flex items-center gap-4 mb-6 text-xs text-gray-500 bg-black/20 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5" title="الوزن">
                <Weight size={14} className="text-gray-400" />
                <span className="font-mono">{robot.specs.weight}</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-1.5" title="البطارية">
                <Battery size={14} className="text-green-500" />
                <span className="font-mono">{robot.specs.battery}</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-1.5" title="السرعة">
                <Move size={14} className="text-blue-500" />
                <span className="font-mono">{robot.specs.speed}</span>
            </div>
         </div>

         <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                {[1,2,3].map(i => (
                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-[#15191E] bg-white/10 flex items-center justify-center text-[8px] font-bold text-gray-500">
                        <Cpu size={10} />
                    </div>
                ))}
            </div>
            <button 
                onClick={() => onClick(robot)}
                className="text-xs font-bold text-white hover:text-accent transition flex items-center gap-1 group/link"
            >
                المزيد
                <ArrowRight size={14} className="group-hover/link:-translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
};

const RobotsGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedProject, setSelectedProject] = useState<RobotProject | null>(null);

  const filteredProjects = PROJECTS.filter(project => 
    selectedCategory === 'الكل' || project.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-primary font-sans text-gray-200 selection:bg-accent/30">
      
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden border-b border-white/5 bg-[#0a0c0f]">
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-accent mb-6 animate-fade-in shadow-lg shadow-accent/10">
             <PenTool size={12} />
             <span className="tracking-widest uppercase">Engineering Showcase</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none animate-in slide-in-from-bottom-2 duration-500">
             معرض <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-400 to-accent">الابتكارات</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-in slide-in-from-bottom-3 duration-700 delay-100">
            نماذج حقيقية تم تصميمها وتطويرها بأيدي مهندسينا وطلابنا. كل مشروع هنا يمثل حلاً هندسياً لتحدي واقعي.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 animate-in slide-in-from-bottom-4 duration-700 delay-200">
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2
                        ${selectedCategory === cat 
                            ? 'bg-accent text-white border-accent shadow-[0_0_20px_rgba(45,137,229,0.3)] scale-105' 
                            : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20'
                        }
                    `}
                >
                    {selectedCategory === cat && <Layers size={14} className="animate-in zoom-in duration-300" />}
                    {cat}
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((robot, idx) => (
            <ProjectCard key={robot.id} robot={robot} index={idx} onClick={setSelectedProject} />
          ))}
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProject(null)}>
                <div 
                    className="bg-[#15191E] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 p-2 rounded-full transition-all border border-white/10"
                    >
                        <X size={20} />
                    </button>

                    {/* Image Side */}
                    <div className="w-full md:w-5/12 bg-black relative min-h-[300px] md:min-h-full">
                        <img 
                            src={selectedProject.image} 
                            alt={selectedProject.name} 
                            className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 right-6 left-6">
                            <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-lg mb-3 shadow-lg">
                                {selectedProject.category}
                            </span>
                            <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-lg">{selectedProject.name}</h2>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-7/12 p-8 md:p-10">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">المعالج</h3>
                                <div className="text-white font-mono flex items-center gap-2">
                                    <Cpu size={16} className="text-purple-500" />
                                    {selectedProject.specs.processor}
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">الوزن الكلي</h3>
                                <div className="text-white font-mono flex items-center gap-2">
                                    <Weight size={16} className="text-gray-400" />
                                    {selectedProject.specs.weight}
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">مصدر الطاقة</h3>
                                <div className="text-white font-mono flex items-center gap-2">
                                    <Battery size={16} className="text-green-500" />
                                    {selectedProject.specs.battery}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <Share2 size={18} className="text-accent" />
                                    نبذة عن المشروع
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {selectedProject.fullDescription || selectedProject.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <Zap size={18} className="text-yellow-400" />
                                    أبرز المميزات
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedProject.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                            <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-white/10 flex gap-4">
                            <Link to="/support" className="flex-1 bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold text-center transition shadow-lg flex items-center justify-center gap-2">
                                طلب استشارة مماثلة
                            </Link>
                            <Link to="/simulator" className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white rounded-xl font-bold transition flex items-center gap-2">
                                <Layers size={18} />
                                محاكاة
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-accent/20 to-transparent rounded-3xl p-1 border border-white/10">
            <div className="bg-[#15191E] rounded-[22px] p-10 md:p-16 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent animate-pulse">
                        <Target size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">لديك فكرة روبوت؟</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
                        يمكننا مساعدتك في تحويل فكرتك إلى نموذج أولي يعمل بكفاءة. فريقنا الهندسي جاهز لتقديم الاستشارات والتصاميم، من المخططات الأولية وحتى التصنيع.
                    </p>
                    <Link to="/support" className="inline-flex items-center px-8 py-4 bg-accent hover:bg-accentHover text-white font-bold rounded-xl transition shadow-lg shadow-accent/20 hover:scale-105">
                        اطلب استشارة هندسية مجانية
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RobotsGallery;
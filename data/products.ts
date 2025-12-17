import { Product } from '../types';

export const PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'طقم روبوت تعليمي (Arduino Kit)', 
    category: 'kit', 
    price: 299, 
    description: 'طقم متكامل للمبتدئين يحتوي على لوحة تحكم، عجلات، هيكل أكريليك، ومجموعة حساسات لبناء سيارة ذكية.', 
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '2', 
    name: 'مستشعر مسافة (Ultrasonic)', 
    category: 'sensor', 
    price: 45, 
    description: 'وحدة قياس المسافة بالموجات فوق الصوتية HC-SR04، دقة عالية تصل إلى 3 ملم، مثالي لمشاريع تجنب العقبات.', 
    image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '3', 
    name: 'محرك سيرفو (Micro Servo)', 
    category: 'part', 
    price: 89, 
    description: 'محرك سيرفو SG90 عالي الجودة، دوران 180 درجة، تروس معدنية لتحمل الضغط، مناسب للأذرع الروبوتية.', 
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '4', 
    name: 'ذراع روبوت صناعي (4-Axis)', 
    category: 'kit', 
    price: 550, 
    description: 'نموذج تعليمي لذراع روبوت صناعي بـ 4 محاور حرية، قابل للبرمجة عبر بايثون، مصنوع من الألمنيوم المقوى.', 
    image: 'https://images.unsplash.com/photo-1561144257-e1555cb6d518?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '5', 
    name: 'وحدة كاميرا ذكية (AI Cam)', 
    category: 'sensor', 
    price: 199, 
    description: 'كاميرا متوافقة مع ESP32 تدعم التعرف على الوجوه والألوان، دقة 5 ميجابكسل مع عدسة واسعة الزاوية.', 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '6', 
    name: 'هيكل روبوت سداسي (Hexapod)', 
    category: 'part', 
    price: 320, 
    description: 'هيكل ميكانيكي لروبوت عنكبوتي، مقطوع بالليزر بدقة عالية، يشمل البراغي والمفاصل اللازمة للتجميع.', 
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800' 
  },
  {
    id: '7',
    name: 'وحدة تحكم مخصصة (Custom PCB)',
    category: 'part',
    price: 150,
    description: 'لوحة تحكم إلكترونية مطبوعة مخصصة للمشاريع المتقدمة، تدعم واي-فاي وبلوتوث مدمج.',
    image: 'https://images.unsplash.com/photo-1592659762303-90081d34b277?auto=format&fit=crop&q=80&w=800' 
  },
];
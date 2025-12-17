import { Product } from '../types';

export const PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'طقم روبوت تعليمي (Arduino Kit)', 
    category: 'kit', 
    price: 299, 
    description: 'طقم متكامل للمبتدئين يحتوي على لوحة تحكم، عجلات، هيكل أكريليك، ومجموعة حساسات لبناء سيارة ذكية.', 
    image: 'https://images.unsplash.com/photo-1555447016-173f4e195707?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '2', 
    name: 'مستشعر مسافة (Ultrasonic)', 
    category: 'sensor', 
    price: 45, 
    description: 'وحدة قياس المسافة بالموجات فوق الصوتية HC-SR04، دقة عالية تصل إلى 3 ملم، مثالي لمشاريع تجنب العقبات.', 
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '3', 
    name: 'محرك سيرفو (Micro Servo)', 
    category: 'part', 
    price: 89, 
    description: 'محرك سيرفو SG90 عالي الجودة، دوران 180 درجة، تروس معدنية لتحمل الضغط، مناسب للأذرع الروبوتية.', 
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '4', 
    name: 'ذراع روبوت صناعي (4-Axis)', 
    category: 'kit', 
    price: 550, 
    description: 'نموذج تعليمي لذراع روبوت صناعي بـ 4 محاور حرية، قابل للبرمجة عبر بايثون، مصنوع من الألمنيوم المقوى.', 
    image: 'https://images.unsplash.com/photo-1616161560417-66d4db5892ec?auto=format&fit=crop&q=80&w=800' 
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
    image: 'https://images.unsplash.com/photo-1535378437327-10f76365c4df?auto=format&fit=crop&q=80&w=800' 
  },
  {
    id: '7',
    name: 'وحدة تحكم مخصصة (Custom PCB)',
    category: 'part',
    price: 150,
    description: 'لوحة تحكم إلكترونية مطبوعة مخصصة للمشاريع المتقدمة، تدعم واي-فاي وبلوتوث مدمج.',
    image: '' 
  },
];
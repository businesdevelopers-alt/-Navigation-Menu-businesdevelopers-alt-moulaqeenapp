
import { Product } from '../types';

export const PRODUCTS: Product[] = [
  { 
    id: 'rob-01', 
    name: 'X-Rover Explorer Pro', 
    category: 'complete', 
    price: 4500, 
    status: 'in_stock',
    description: 'روبوت استكشافي متقدم للدراسات الجيولوجية والبيئية، مزود بنظام تعليق ذكي ودفع سداسي.', 
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800',
    specs: {
        weight: '12kg',
        battery: '20,000mAh',
        speed: '1.5m/s',
        processor: 'Nvidia Jetson Orin',
        payload: '5kg'
    }
  },
  { 
    id: 'rob-02', 
    name: 'Titan Arm V4', 
    category: 'complete', 
    price: 8900, 
    status: 'pre_order',
    description: 'ذراع روبوتية صناعية بـ 6 درجات حرية، مصممة للمهام المخبرية الدقيقة والفرز المؤتمت.', 
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
    specs: {
        weight: '15kg',
        battery: 'External AC',
        speed: '2 rad/s',
        processor: 'PLC / STM32',
        payload: '2kg'
    }
  },
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
    image: 'https://images.unsplash.com/photo-1557850197-c7b85044af11?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '3', 
    name: 'محرك سيرفو (Micro Servo)', 
    category: 'part', 
    price: 89, 
    description: 'محرك سيرفو SG90 عالي الجودة، دوران 180 درجة، تروس معدنية لتحمل الضغط، مناسب للأذرع الروبوتية.', 
    image: 'https://images.unsplash.com/photo-159742324403d-112507ee233b?auto=format&fit=crop&q=80&w=800' 
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
    id: 'rob-03',
    name: 'Advanced Thermal Scanner V2',
    category: 'sensor',
    price: 1250,
    status: 'in_stock',
    description: 'حساس حراري عالي الدقة للكشف عن البؤر الحرارية ورسم الخرائط الحرارية في البيئات الصناعية المعقدة.',
    // Missing image to test AI generation fallback
    specs: {
        weight: '150g',
        battery: '3.3V / 5V',
        processor: 'MLX90640 Core'
    }
  }
];
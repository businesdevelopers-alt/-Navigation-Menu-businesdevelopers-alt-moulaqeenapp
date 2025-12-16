import React, { useState } from 'react';
import { 
  User, Settings, BookOpen, LogOut, Cpu, Clock, Rocket, 
  ShoppingBag, LayoutDashboard, Code, Package, ChevronLeft, 
  PlayCircle, FileCode, Search, AlertCircle, CheckCircle, ExternalLink
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- MOCK DATA ---
const MY_COURSES = [
  {
    id: '1',
    title: 'أساسيات حركة الروبوت',
    progress: 75,
    lastAccessed: 'منذ ساعتين',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=300',
    totalLessons: 5,
    completedLessons: 3
  },
  {
    id: '2',
    title: 'الرؤية الحاسوبية للروبوتات',
    progress: 10,
    lastAccessed: 'منذ يومين',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=300',
    totalLessons: 12,
    completedLessons: 1
  }
];

const MY_PROJECTS = [
  {
    id: 'p1',
    name: 'تتبع المسار (Line Follower)',
    updatedAt: '20 مارس 2024',
    status: 'completed',
    codeSnippet: 'FORWARD\nWAIT 100\nTURN_RIGHT',
    components: ['Sensors', 'Motors']
  },
  {
    id: 'p2',
    name: 'حل المتاهة v1',
    updatedAt: '18 مارس 2024',
    status: 'draft',
    codeSnippet: 'IF DISTANCE < 10 THEN\nTURN_LEFT\nEND',
    components: ['Lidar', 'AI Cam']
  }
];

const MY_ORDERS = [
  {
    id: '#ORD-7782',
    date: '15 مارس 2024',
    status: 'shipped',
    total: '450 ر.س',
    items: ['Arduino Kit', 'Ultrasonic Sensor']
  },
  {
    id: '#ORD-7750',
    date: '01 مارس 2024',
    status: 'delivered',
    total: '120 ر.س',
    items: ['Servo Motor x2']
  }
];

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'projects' | 'orders' | 'settings'>('overview');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-accent/20 to-secondary rounded-2xl p-8 border border-accent/20 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2">مرحباً، {user.name}! 👋</h2>
                <p className="text-gray-300 max-w-xl">
                  هذه لوحة التحكم الخاصة بك. تابع تقدمك في الدورات، أدر مشاريعك الهندسية، وراقب طلباتك من المتجر في مكان واحد.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/simulator" className="px-5 py-2.5 bg-accent hover:bg-accentHover text-white rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-accent/20">
                    <Code size={18} />
                    مشروع جديد
                  </Link>
                  <Link to="/store" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-bold transition flex items-center gap-2">
                    <ShoppingBag size={18} />
                    تصفح المتجر
                  </Link>
                </div>
              </div>
              <Cpu size={200} className="absolute -bottom-10 -left-10 text-accent/5 rotate-12" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary p-5 rounded-xl border border-white/10 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><BookOpen size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-white">{MY_COURSES.length}</div>
                  <div className="text-xs text-gray-400">دورات نشطة</div>
                </div>
              </div>
              <div className="bg-secondary p-5 rounded-xl border border-white/10 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400"><LayoutDashboard size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-white">{MY_PROJECTS.length}</div>
                  <div className="text-xs text-gray-400">مشاريع في المحاكي</div>
                </div>
              </div>
              <div className="bg-secondary p-5 rounded-xl border border-white/10 flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400"><Package size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-white">{MY_ORDERS.length}</div>
                  <div className="text-xs text-gray-400">طلبات شراء</div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section (Combined) */}
            <div className="grid lg:grid-cols-2 gap-6">
               {/* Quick Course Continue */}
               <div className="bg-secondary rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-white flex items-center gap-2"><Clock size={18} className="text-accent" /> تابع التعلم</h3>
                     <button onClick={() => setActiveTab('courses')} className="text-xs text-accent hover:underline">عرض الكل</button>
                  </div>
                  {MY_COURSES.length > 0 ? (
                    <div className="flex gap-4 items-center bg-primary/50 p-4 rounded-lg border border-white/5">
                       <img src={MY_COURSES[0].image} alt="" className="w-16 h-16 rounded-md object-cover" />
                       <div className="flex-1">
                          <h4 className="text-sm font-bold text-white mb-1">{MY_COURSES[0].title}</h4>
                          <div className="w-full h-1.5 bg-black rounded-full overflow-hidden mb-1">
                             <div className="h-full bg-accent" style={{ width: `${MY_COURSES[0].progress}%` }}></div>
                          </div>
                          <span className="text-[10px] text-gray-500">{MY_COURSES[0].progress}% مكتمل</span>
                       </div>
                       <Link to={`/courses/${MY_COURSES[0].id}`} className="p-2 bg-white/10 rounded-full text-white hover:bg-accent hover:scale-110 transition">
                          <PlayCircle size={20} />
                       </Link>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">لا توجد دورات حالياً.</p>
                  )}
               </div>

               {/* Recent Orders Status */}
               <div className="bg-secondary rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-white flex items-center gap-2"><Package size={18} className="text-green-400" /> آخر الطلبات</h3>
                     <button onClick={() => setActiveTab('orders')} className="text-xs text-accent hover:underline">عرض الكل</button>
                  </div>
                  {MY_ORDERS.length > 0 ? (
                    <div className="space-y-3">
                       {MY_ORDERS.slice(0, 2).map(order => (
                         <div key={order.id} className="flex items-center justify-between text-sm p-3 bg-primary/50 rounded-lg border border-white/5">
                            <div className="flex flex-col">
                               <span className="text-white font-mono font-bold">{order.id}</span>
                               <span className="text-[10px] text-gray-500">{order.date}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                ${order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}
                            `}>
                               {order.status === 'shipped' ? 'تم الشحن' : 'تم التوصيل'}
                            </span>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">لا توجد طلبات سابقة.</p>
                  )}
               </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">دوراتي التعليمية</h2>
                <Link to="/courses" className="text-sm text-accent hover:text-white transition">تصفح المزيد من الدورات</Link>
             </div>
             <div className="grid gap-4">
                {MY_COURSES.map(course => (
                   <div key={course.id} className="bg-secondary rounded-xl border border-white/10 p-4 flex flex-col md:flex-row gap-6 items-center hover:border-accent/30 transition">
                      <img src={course.image} alt={course.title} className="w-full md:w-48 h-32 object-cover rounded-lg" />
                      <div className="flex-1 w-full">
                         <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-white">{course.title}</h3>
                            <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400">{course.completedLessons}/{course.totalLessons} دروس</span>
                         </div>
                         <div className="w-full h-2 bg-black rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                               <Clock size={12} /> آخر نشاط: {course.lastAccessed}
                            </span>
                            <Link to={`/courses/${course.id}`} className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-sm font-bold rounded-lg transition flex items-center gap-2">
                               <PlayCircle size={16} /> متابعة
                            </Link>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">مشاريع المحاكي</h2>
                <Link to="/simulator" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition flex items-center gap-2 border border-white/5">
                   <Code size={16} /> مشروع جديد
                </Link>
             </div>
             
             {/* Projects Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MY_PROJECTS.map(project => (
                   <div key={project.id} className="bg-secondary rounded-xl border border-white/10 p-5 group hover:border-accent/40 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-primary rounded-lg text-accent border border-white/5 group-hover:bg-accent group-hover:text-white transition-colors">
                            <FileCode size={24} />
                         </div>
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                            ${project.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}
                         `}>
                            {project.status === 'completed' ? 'مكتمل' : 'مسودة'}
                         </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                      <p className="text-xs text-gray-500 mb-4">آخر تعديل: {project.updatedAt}</p>
                      
                      <div className="bg-black/50 p-3 rounded-lg font-mono text-[10px] text-gray-400 mb-4 overflow-hidden h-16 relative">
                         {project.codeSnippet}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>

                      <div className="flex gap-2 mt-auto">
                         <Link to="/simulator" className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg text-center border border-white/5 transition">
                            فتح في المحاكي
                         </Link>
                      </div>
                   </div>
                ))}
                
                {/* Empty State / Add New */}
                <Link to="/simulator" className="bg-secondary/50 rounded-xl border border-dashed border-white/10 p-5 flex flex-col items-center justify-center text-gray-500 hover:text-accent hover:border-accent/50 transition cursor-pointer min-h-[250px]">
                   <Rocket size={32} className="mb-4 opacity-50" />
                   <span className="font-bold text-sm">بدء مشروع جديد</span>
                </Link>
             </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h2 className="text-2xl font-bold text-white">سجل الطلبات</h2>
             <div className="bg-secondary rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-right">
                      <thead className="bg-black/20 text-gray-400 uppercase font-bold text-xs">
                         <tr>
                            <th className="px-6 py-4">رقم الطلب</th>
                            <th className="px-6 py-4">التاريخ</th>
                            <th className="px-6 py-4">المنتجات</th>
                            <th className="px-6 py-4">الإجمالي</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                         {MY_ORDERS.map(order => (
                            <tr key={order.id} className="hover:bg-white/5 transition">
                               <td className="px-6 py-4 font-mono font-bold">{order.id}</td>
                               <td className="px-6 py-4">{order.date}</td>
                               <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                     {order.items.map((item, i) => (
                                        <span key={i} className="text-xs text-gray-400">• {item}</span>
                                     ))}
                                  </div>
                               </td>
                               <td className="px-6 py-4 font-bold text-white">{order.total}</td>
                               <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1
                                      ${order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}
                                  `}>
                                     {order.status === 'shipped' ? <Rocket size={10} /> : <CheckCircle size={10} />}
                                     {order.status === 'shipped' ? 'تم الشحن' : 'تم التوصيل'}
                                  </span>
                               </td>
                               <td className="px-6 py-4">
                                  <button className="text-accent hover:text-white text-xs font-bold flex items-center gap-1">
                                     تتبع <ChevronLeft size={12} />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        );

      case 'settings':
         return (
             <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <h2 className="text-2xl font-bold text-white">إعدادات الحساب</h2>
                 <div className="bg-secondary p-6 rounded-xl border border-white/10 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">الاسم الكامل</label>
                             <input type="text" defaultValue={user.name} className="w-full bg-primary border border-white/10 rounded-lg p-3 text-white text-sm" />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">البريد الإلكتروني</label>
                             <input type="email" defaultValue={user.email} disabled className="w-full bg-primary/50 border border-white/5 rounded-lg p-3 text-gray-400 text-sm cursor-not-allowed" />
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 mb-1">كلمة المرور الحالية</label>
                         <input type="password" placeholder="********" className="w-full bg-primary border border-white/10 rounded-lg p-3 text-white text-sm" />
                     </div>
                     <div className="pt-4 flex justify-end">
                         <button className="px-6 py-2 bg-accent hover:bg-accentHover text-white font-bold rounded-lg transition">
                             حفظ التغييرات
                         </button>
                     </div>
                 </div>
             </div>
         );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-secondary rounded-2xl p-4 border border-white/10 sticky top-24">
              {/* User Profile Summary */}
              <div className="text-center mb-6 pb-6 border-b border-white/5">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-blue-600 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-accent/20 text-white font-bold text-3xl">
                   {user.name[0]}
                </div>
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <p className="text-xs text-gray-400">{user.email}</p>
                <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                   <Rocket size={10} />
                   عضوية مهندس
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                 {[
                   { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
                   { id: 'courses', label: 'دوراتي', icon: BookOpen },
                   { id: 'projects', label: 'مشاريع المحاكي', icon: Cpu },
                   { id: 'orders', label: 'طلبات المتجر', icon: ShoppingBag },
                   { id: 'settings', label: 'الإعدادات', icon: Settings },
                 ].map(item => (
                   <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id as any)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200
                        ${activeTab === item.id 
                            ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                     `}
                   >
                      <item.icon size={18} />
                      {item.label}
                   </button>
                 ))}
                 
                 <div className="pt-4 mt-4 border-t border-white/5">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition">
                       <LogOut size={18} /> تسجيل الخروج
                    </button>
                 </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
             {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
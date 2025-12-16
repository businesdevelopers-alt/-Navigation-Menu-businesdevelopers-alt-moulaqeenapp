import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 font-sans">
        {/* Announcement Bar */}
        <div className="hidden md:block border-b border-white/10 bg-black/70 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-xs font-medium">النظام يعمل — V2.0 جاهز</span>
              </span>
            </div>
            <Link to="/courses" className="text-xs text-white/90 hover:text-white underline underline-offset-4 transition-colors">
              اطّلع على الجديد
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="border-b border-white/10 bg-black/70 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4">
            <div className="h-16 flex items-center justify-between">

              {/* Brand */}
              <Link to="/" className="flex items-center gap-3 shrink-0 group">
                <Logo size="sm" className="transition-transform group-hover:scale-105" />
              </Link>

              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-1">
                <NavLink to="/" label="الرئيسية" active={location.pathname === '/'} />
                <NavLink to="/simulator" label="المحاكي" active={location.pathname === '/simulator'} />
                <NavLink to="/courses" label="الدورات" active={location.pathname.startsWith('/courses')} />
                <NavLink to="/store" label="المتجر" active={location.pathname.startsWith('/store')} />
                <NavLink to="/support" label="الدعم" active={location.pathname === '/support'} />

                {/* More Dropdown */}
                <div className="relative group">
                  <button className="px-3.5 py-2.5 text-white/85 hover:text-white rounded-xl inline-flex items-center gap-1 text-sm font-bold tracking-wide transition-colors border border-transparent hover:bg-white/5 hover:border-white/10">
                    المزيد <span className="text-white/60">▾</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-black/90 backdrop-blur shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link to="/about" className="block px-4 py-2.5 text-sm font-semibold tracking-wide text-white/80 hover:text-white hover:bg-white/5 transition-colors">من نحن</Link>
                      <Link to="/docs" className="block px-4 py-2.5 text-sm font-semibold tracking-wide text-white/80 hover:text-white hover:bg-white/5 transition-colors">التوثيق</Link>
                      <Link to="/support" className="block px-4 py-2.5 text-sm font-semibold tracking-wide text-white/80 hover:text-white hover:bg-white/5 transition-colors">المدونة</Link>
                      <Link to="/support" className="block px-4 py-2.5 text-sm font-semibold tracking-wide text-white/80 hover:text-white hover:bg-white/5 transition-colors">الشروط والخصوصية</Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="hidden lg:flex items-center gap-3">
                {user ? (
                   <div className="flex items-center gap-3">
                     <Link to="/store" className="relative text-white/70 hover:text-white transition-colors p-1">
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white border border-black">
                            {cartCount}
                          </span>
                        )}
                     </Link>
                     <div className="h-5 w-px bg-white/10 mx-1"></div>
                     <Link to="/profile" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-accent font-bold text-sm">
                           {user.name[0]}
                        </div>
                     </Link>
                   </div>
                ) : (
                   <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">تسجيل الدخول</Link>
                )}
                
                {!user && (
                   <Link to="/register" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
                    ابدأ الآن
                   </Link>
                )}
              </div>

              {/* Mobile Toggle */}
              <div className="lg:hidden flex items-center gap-2">
                <Link to="/store" className="relative text-white/80 p-1">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white border border-black">
                        {cartCount}
                      </span>
                    )}
                </Link>
                {!user && (
                  <Link to="/register" className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
                    ابدأ الآن
                  </Link>
                )}
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="px-3 py-2 rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Menu size={20} />
                </button>
              </div>

            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            <div className="absolute top-0 right-0 h-full w-[86%] max-w-sm bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                   <Logo size="sm" />
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl border border-white/15 text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                <MobileLink to="/" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</MobileLink>
                <MobileLink to="/simulator" onClick={() => setIsMobileMenuOpen(false)}>المحاكي</MobileLink>
                <MobileLink to="/courses" onClick={() => setIsMobileMenuOpen(false)}>الدورات</MobileLink>
                <MobileLink to="/store" onClick={() => setIsMobileMenuOpen(false)}>المتجر</MobileLink>
                <MobileLink to="/support" onClick={() => setIsMobileMenuOpen(false)}>الدعم</MobileLink>

                <div className="pt-2 border-t border-white/10 my-2"></div>

                <MobileLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>من نحن</MobileLink>
                <MobileLink to="/docs" onClick={() => setIsMobileMenuOpen(false)}>التوثيق</MobileLink>
                <MobileLink to="/support" onClick={() => setIsMobileMenuOpen(false)}>المدونة</MobileLink>

                <div className="pt-3 border-t border-white/10 my-3"></div>

                {user ? (
                   <>
                      <div className="flex items-center gap-3 px-4 py-2">
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                            {user.name[0]}
                         </div>
                         <div className="text-white font-medium">{user.name}</div>
                      </div>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">
                         الملف الشخصي
                      </Link>
                      <button onClick={() => {logout(); setIsMobileMenuOpen(false)}} className="block w-full text-center py-3 rounded-xl text-red-400 font-semibold hover:bg-white/5 transition-colors">
                         تسجيل الخروج
                      </button>
                   </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-white/80 hover:text-white transition-colors text-center font-medium">
                       تسجيل الدخول
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-center shadow-lg">
                      ابدأ الآن
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content overlap with fixed header */}
      <div className="h-16 md:h-[calc(4rem+2.25rem)]"></div>
    </>
  );
};

const NavLink: React.FC<{ to: string; label: string; active?: boolean }> = ({ to, label, active }) => (
  <Link
    to={to}
    className={`px-3.5 py-2.5 rounded-xl text-sm transition-all border ${
      active 
        ? 'text-white font-extrabold bg-white/10 border-white/10' 
        : 'text-white/85 font-bold border-transparent hover:bg-white/5 hover:border-white/10'
    } tracking-wide`}
  >
    {label}
  </Link>
);

const MobileLink: React.FC<{ to: string; onClick: () => void; children: React.ReactNode }> = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3.5 rounded-2xl text-white/90 font-bold border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] hover:text-white transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
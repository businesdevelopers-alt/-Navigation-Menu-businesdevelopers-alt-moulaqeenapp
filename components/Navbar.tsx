import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, LogOut, ChevronRight, Terminal } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المحاكي', path: '/simulator' },
    { name: 'الدورات', path: '/courses' },
    { name: 'المتجر', path: '/store' },
    { name: 'الدعم', path: '/support' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary/90 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 transition hover:opacity-90">
              <Logo size="md" />
            </Link>

            {/* Desktop Links - Text Only, High Contrast */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Cart */}
            <Link to="/store" className="relative text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium group">
               <ShoppingBag size={20} />
               <span className="hidden xl:inline group-hover:text-white">السلة</span>
               {cartCount > 0 && (
                  <span className="bg-highlight text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
                    {cartCount}
                  </span>
               )}
            </Link>

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-3 group">
                  <div className="text-right hidden xl:block">
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">{user.name}</div>
                  </div>
                  <div className="w-9 h-9 bg-surface rounded-lg flex items-center justify-center text-white font-bold border border-white/10 group-hover:border-accent transition">
                    {user.name[0]}
                  </div>
                </Link>
                <button onClick={logout} className="text-gray-500 hover:text-red-400 transition p-2 hover:bg-white/5 rounded-md" title="تسجيل الخروج">
                   <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-400 hover:text-white text-sm font-bold transition px-2">
                  تسجيل الدخول
                </Link>
                <Link 
                  to="/register" 
                  className="bg-accent hover:bg-accentHover text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-lg shadow-accent/10 flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                >
                  ابدأ الآن
                  <ChevronRight size={16} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Header Actions */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Exposed CTA on Mobile */}
            {!user && (
              <Link 
                to="/register" 
                className="bg-accent hover:bg-accentHover text-white px-3 py-2 rounded-md text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                ابدأ الآن
              </Link>
            )}
            
            <Link to="/store" className="text-gray-400 hover:text-white relative p-1">
               <ShoppingBag size={20} />
               {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-highlight text-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
               )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none border border-white/10 ml-1"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden bg-secondary border-b border-white/5 absolute w-full z-50 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-bold transition ${
                  isActive(link.path)
                    ? 'text-white bg-white/5 border border-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
                {isActive(link.path) && <Terminal size={14} className="text-accent" />}
              </Link>
            ))}
            
            <div className="pt-6 border-t border-white/10 mt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface border border-white/5">
                     <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-white font-bold">{user.name[0]}</div>
                     <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">{user.name}</span>
                        <span className="text-gray-500 text-xs">{user.email}</span>
                     </div>
                  </Link>
                  <button onClick={() => {logout(); setIsOpen(false);}} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10">
                     <LogOut size={16} />
                     تسجيل الخروج
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-center px-4 py-3 rounded-lg font-bold text-gray-300 border border-white/10 hover:bg-white/5 text-sm">
                    تسجيل الدخول
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
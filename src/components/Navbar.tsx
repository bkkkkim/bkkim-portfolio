import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  
  const { data: config } = useApi<any>('/api/contents', {});

  const navItems = [
    { name: 'Home', to: 'home' },
    { name: 'About', to: 'about' },
    { name: 'Works', to: 'works' },
    { name: 'Contact', to: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (to: string) => {
    setIsOpen(false);
    if (!isHome) {
      navigate('/', { state: { scrollTo: to } });
    }
  };

  // Handle scroll after navigation from another page
  useEffect(() => {
    if (isHome && location.state && (location.state as any).scrollTo) {
      const target = (location.state as any).scrollTo;
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [isHome, location.state]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen || !isHome ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-0' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="text-2xl font-extrabold tracking-tighter cursor-pointer uppercase"
          onClick={() => isHome ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}
        >
          {config?.logo_url ? (
            <img src={config.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            config?.logo_text || "Basics."
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10">
          {navItems.map((item) => (
            isHome ? (
              <Link
                key={item.name}
                to={item.to}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-sm font-bold uppercase tracking-tight text-gray-500 hover:text-black cursor-pointer transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.to)}
                className="text-sm font-bold uppercase tracking-tight text-gray-500 hover:text-black cursor-pointer transition-colors"
              >
                {item.name}
              </button>
            )
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navItems.map((item) => (
                isHome ? (
                  <Link
                    key={item.name}
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-64}
                    duration={500}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-gray-800"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.to)}
                    className="text-lg font-medium text-gray-800 text-left"
                  >
                    {item.name}
                  </button>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

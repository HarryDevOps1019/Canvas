import { useState, useEffect } from 'react';
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiSearch
} from 'react-icons/fi';
import logo from '../assets/canvas-logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [cartCount] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  // Detect active section on scroll
  useEffect(() => {
    const sections = ['home', 'categories', 'products', 'features'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const navItemClass = (id) =>
    `cursor-pointer transition font-medium ${
      activeSection === id
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

        {/* Logo */}
        <div
          onClick={() => scrollToSection('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src={logo} alt="Canvas Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gray-800 hidden sm:inline">
            Canvas
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('home')} className={navItemClass('home')}>
            Home
          </button>
          <button onClick={() => scrollToSection('categories')} className={navItemClass('categories')}>
            Categories
          </button>
          <button onClick={() => scrollToSection('products')} className={navItemClass('products')}>
            Products
          </button>
          <button onClick={() => scrollToSection('features')} className={navItemClass('features')}>
            Features
          </button>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden sm:flex items-center border rounded px-2 py-1">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none text-sm px-2 w-32"
            />
          </div>

          {/* Profile (NO hardcoded user) */}
          <button
            className="text-gray-700 hover:text-blue-600 transition"
            title="Profile"
          >
            <FiUser className="w-6 h-6" />
          </button>

          {/* Cart */}
          <button className="relative text-gray-700 hover:text-blue-600 transition">
            <FiShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu */}
          <button onClick={toggleMenu} className="md:hidden text-gray-700">
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          {['home', 'categories', 'products', 'features'].map((id) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`block w-full text-left ${navItemClass(id)}`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

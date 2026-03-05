import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, History, Info, Menu, X, MapPin } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
        { name: 'History', path: '/history', icon: <History size={20} /> },
        { name: 'Events', path: '/events', icon: <MapPin size={20} /> },
        { name: 'About', path: '/about', icon: <Info size={20} /> },
    ];

    return (
        <nav className="glass-card" style={{ marginBottom: '2rem', borderRadius: '0 0 16px 16px', position: 'sticky', top: 0, zIndex: 1000, borderTop: 'none' }}>
            <div className="container" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#e10600', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>F1</div>
                    <span className="f1-title" style={{ fontSize: '1.2rem', margin: 0 }}>Race Tracker</span>
                </div>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2rem' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                color: isActive ? '#e10600' : 'white',
                                fontWeight: isActive ? '700' : '400',
                                transition: 'color 0.3s ease'
                            })}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none', cursor: 'pointer' }}>
                    {isOpen ? <X /> : <Menu />}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;

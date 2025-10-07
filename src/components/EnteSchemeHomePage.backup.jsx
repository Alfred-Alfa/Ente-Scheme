import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Menu, Home, FileText, Users, Bell, Settings, LogOut, Shield } from 'lucide-react';
import AdminNav from './AdminNav';
import './AdminNav.css';
import './EnteSchemeHomePage.css';

const EnteSchemeHomePage = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // High-quality carousel images related to Kerala welfare schemes
  const carouselItems = [
    {
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Kerala Welfare Schemes",
      description: "Empowering citizens through digital access to government welfare programs"
    },
    {
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2022&q=80",
      title: "Educational Schemes",
      description: "Supporting education and skill development across Kerala"
    },
    {
      image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
      title: "Healthcare Benefits",
      description: "Ensuring healthcare access for all eligible citizens"
    },
    {
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Senior Citizen Welfare",
      description: "Comprehensive support systems for elderly citizens"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Auto-slide functionality - slides to the left (next slide) every 3 seconds
  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 3000); // 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(autoSlideInterval);
  }, [carouselItems.length]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // Handle menu item click
  const handleMenuItemClick = (action) => {
    if (typeof action === 'function') {
      action();
    }
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  // Toggle sidebar
  const toggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  };

  // Close sidebar when clicking outside
  // Navigation items
  const getNavItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: 'Dashboard',
        path: '/dashboard',
        match: (path) => path === '/dashboard'
      }
    ];

    // Admin specific items
    const adminItems = user?.role === 'admin' ? [
      {
        icon: FileText,
        label: 'Manage Schemes',
        path: '/schemes',
        match: (path) => path.startsWith('/schemes'),
        subItems: [
          { label: 'View All Schemes', path: '/schemes' },
          { label: 'Add New Scheme', path: '/schemes/new' },
          { label: 'Manage Categories', path: '/schemes/categories' }
        ],
        isExpanded: false
      },
      {
        icon: Bell,
        label: 'News & Updates',
        path: '/news',
        match: (path) => path.startsWith('/news'),
        subItems: [
          { label: 'View All News', path: '/news' },
          { label: 'Add News', path: '/news/add' },
          { label: 'Manage Categories', path: '/news/categories' }
        ],
        isExpanded: false
      },
      {
        icon: Settings,
        label: 'Admin Settings',
        path: '/admin/settings',
        match: (path) => path.startsWith('/admin')
      }
    ] : [];
    
    // Regular user items
    const regularItems = [
      {
        icon: Users,
        label: 'Profile',
        path: '/profile',
        match: (path) => path.startsWith('/profile')
      },
      {
        icon: Settings,
        label: 'Settings',
        path: '/settings',
        match: (path) => path.startsWith('/settings')
      }
    ];
    
    // Combine all items
    return [...baseItems, ...adminItems, ...regularItems];
  };
  const toggleSubMenu = (index) => {
    if (navItems[index]?.subItems) {
      const updatedNavItems = [...navItems];
      updatedNavItems[index].isExpanded = !updatedNavItems[index].isExpanded;
      // Close other expanded menus
      updatedNavItems.forEach((item, i) => {
        if (i !== index) item.isExpanded = false;
      });
      // Update state or perform any other action
      setNavItems(updatedNavItems);
    }
  };

  // Get navigation items
  const navItems = getNavItems();
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems;

  useEffect(() => {
    try {
      const name = localStorage.getItem('welcome_user_name');
      if (name) {
        setWelcomeName(name);
        setShowWelcome(true);
        // Filter navigation items based on user role
        setNavItems(filteredNavItems);
      }
    } catch (_) {
      // no-op
    }
  }, []);

  return (
    <div className="app-container">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="welcome-banner" role="status" aria-live="polite">
          <div className="welcome-content">
            <div className="welcome-badge">🎉</div>
            <div className="welcome-text">
              <div className="welcome-title">Welcome, {welcomeName}!</div>
            </div>
          </div>
          <button
            className="welcome-dismiss"
            aria-label="Dismiss welcome"
            onClick={() => setShowWelcome(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="navbar-container">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-left">
              <button
                onClick={() => toggleSidebar(!sidebarOpen)}
                className="menu-toggle"
                aria-label="Toggle menu"
                aria-expanded={sidebarOpen}
                aria-controls="sidebar"
              >
                <Menu size={20} />
              </button>
              <div className="brand-section">
                <div className="brand-logo">
                  <span>ES</span>
                </div>
                <div className="brand-text">
                  <h1>Ente Scheme</h1>
                  <p>Kerala Welfare Portal</p>
                </div>
              </div>
            </div>

            <div className="navbar-right">
              {user ? (
                <>
                  <Bell className="notification-icon" />
                  <div className="profile-icon">
                    <User />
                  </div>
                </>
              ) : (
                <div className="auth-buttons">
                  <Link
                    to="/login"
                    className={`login-btn ${location.pathname === '/login' ? 'active' : ''}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`register-btn ${location.pathname === '/register' ? 'active' : ''}`}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay open"
          onClick={() => toggleSidebar(false)}
          role="presentation"
        />
      )}

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className={`side-menu ${sidebarOpen ? 'open' : ''}`}
          aria-hidden={!sidebarOpen}
          aria-label="Main navigation"
        >
          <div className="menu-header">
            <span className="title">Menu</span>
          </div>
          <ul className="menu-links">
            {user?.role === 'admin' && (
              <li className="admin-section">
                <div className="admin-header">
                  <Shield size={16} />
                  <span>Admin Panel</span>
                </div>
                <AdminNav user={user} onLogout={onLogout} />
              </li>
            )}
            {sidebarItems.map((item, index) => {
              if (item.isAction) {
                return (
                  <li key={index}>
                    <button
                      className="menu-link action"
                      onClick={item.onClick}
                    >
                      <span className="icon">
                        <item.icon size={20} />
                      </span>
                      {item.label}
                    </button>
                  </li>
                );
              }

              const isActive = item.match ? item.match(location.pathname) : false;

              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`menu-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      if (item.onClick) item.onClick(e);
                      if (window.innerWidth <= 768) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <span className="icon">
                      <item.icon size={20} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content */}
        <div className={`main-content ${sidebarOpen ? 'hidden' : ''}`}>
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-content">
              <h2>Welcome to Ente Scheme Portal</h2>
              <p>Your gateway to Kerala Government welfare schemes and services</p>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="content-container">
            <div className="carousel-container">
              <div className="sidebar-content">
                {user?.role === 'admin' && (
                  <div className="admin-nav-section">
                    <div className="admin-nav-header">
                      <Shield size={16} />
                      <span>Admin Panel</span>
                    </div>
                    <AdminNav user={user} onLogout={onLogout} />
                  </div>
                )}

                {/* Navigation Arrows */}
                <button onClick={prevSlide} className="carousel-arrow prev">
                  <ChevronLeft />
                </button>
                <button onClick={nextSlide} className="carousel-arrow next">
                  <ChevronRight />
                </button>

                {/* Dots Indicator */}
                <div className="carousel-dots">
                  {carouselItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Latest News Section */}
            <div className="news-section">
              <div className="section-header">
                <h3>Middle Class Welfare Scheme Updates</h3>
                <p>Stay updated with the latest government initiatives and benefits for middle-income families in Kerala</p>
              </div>

              <div className="news-content">
                <div className="news-grid">
                  {/* News Items */}
                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag breaking">BREAKING</span>
                      <span className="news-time">2 hours ago</span>
                    </div>
                    <h4>Enhanced LIFE Mission Housing Scheme for Middle Class</h4>
                    <p>Kerala Government extends LIFE housing benefits to middle-income families with monthly income up to ₹50,000. Subsidized loans and grants available for first-time home buyers.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag update">UPDATE</span>
                      <span className="news-time">1 day ago</span>
                    </div>
                    <h4>Middle Class Education Support Program Enhanced</h4>
                    <p>State government increases education assistance for middle-class families. School fee reimbursement extended to cover private school education up to ₹25,000 per child annually.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag new">NEW</span>
                      <span className="news-time">2 days ago</span>
                    </div>
                    <h4>Healthcare Coverage Expansion</h4>
                    <p>Free healthcare coverage expanded to include 25 additional districts. Online registration now available through the portal.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag announcement">ANNOUNCEMENT</span>
                      <span className="news-time">3 days ago</span>
                    </div>
                    <h4>Subhadra Middle Class Employment Scheme Launch</h4>
                    <p>New employment initiative provides skill development training and job placement assistance for middle-class youth. Partnering with 200+ companies across Kerala.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag reminder">REMINDER</span>
                      <span className="news-time">4 days ago</span>
                    </div>
                    <h4>Tax Relief for Middle Income Homeowners</h4>
                    <p>Property tax exemptions extended to middle-class homeowners earning up to ₹8 lakhs annually. Application deadline extended to March 31st.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag policy">POLICY</span>
                      <span className="news-time">5 days ago</span>
                    </div>
                    <h4>Enhanced Maternity Benefits for Working Women</h4>
                    <p>Maternity leave benefits increased to 6 months with full salary coverage for middle-class working mothers in private sector across Kerala.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>
                </div>

                {/* View All News Button */}
                <div className="news-footer">
                  <button className="view-all-btn">
                    View All News & Updates
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="stats-section">
              <div className="stats-grid">
                <div className="stats-card">
                  <div className="stats-content">
                    <div className="stats-info">
                      <p className="stats-label">Total Schemes</p>
                      <p className="stats-value">245</p>
                    </div>
                    <FileText className="stats-icon green" />
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-content">
                    <div className="stats-info">
                      <p className="stats-label">Active Users</p>
                      <p className="stats-value">12,384</p>
                    </div>
                    <Users className="stats-icon blue" />
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-content">
                    <div className="stats-info">
                      <p className="stats-label">Applications</p>
                      <p className="stats-value">8,924</p>
                    </div>
                    <Bell className="stats-icon orange" />
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-content">
                    <div className="stats-info">
                      <p className="stats-label">Success Rate</p>
                      <p className="stats-value">94%</p>
                    </div>
                    <Settings className="stats-icon purple" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnteSchemeHomePage;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Menu, Home, FileText, Users, Bell, Settings, LogOut, Shield, Tag, Star, Sparkles, Heart, GraduationCap, Briefcase, CheckCircle } from 'lucide-react';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import AdminNav from './AdminNav';
import NewsModal from './NewsModal';
import './AdminNav.css';
import './NewsModal.css';
import './EnteSchemeHomePage.css';

const EnteSchemeHomePage = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [navItems, setNavItems] = useState([]);
  const [newsItems, setNewsItems] = useState([]);

  const dummyNews = [
    {
      _id: '1',
      title: 'VidyaJyothi Scholarship Deadline Extended to Nov 30th',
      content: 'The application deadline for the VidyaJyothi scholarship for students in professional courses has been extended to November 30, 2025. Apply now through the portal.',
      category: 'Education',
      isImportant: true,
      endDate: '2025-11-30',
    },
    {
      _id: '2',
      title: 'New Health Camps for Senior Citizens in All Districts',
      content: 'Free health check-up camps for senior citizens will be organized in all districts from December 1st. Check the schedule and locations on the portal.',
      category: 'Healthcare',
      isImportant: false,
      endDate: '2025-12-31',
    },
    {
      _id: '3',
      title: 'Subsidized Seed Distribution for Farmers This Rabi Season',
      content: 'The Department of Agriculture will distribute subsidized high-quality seeds for the Rabi season. Farmers can register at their local Krishi Bhavan.',
      category: 'Agriculture',
      isImportant: true,
      endDate: '2025-10-31',
    },
    {
      _id: '4',
      title: 'Entrepreneurship Grants for Women-Led Startups',
      content: 'Applications are now open for special grants to support women-led startups. This scheme provides financial assistance and mentorship.',
      category: 'Welfare',
      isImportant: false,
      endDate: '2026-01-15',
    },
    {
      _id: '5',
      title: 'Skill Training for Differently-Abled Persons',
      content: 'A new batch for free residential skill training and placement assistance for differently-abled individuals will commence in January. Limited seats available.',
      category: 'Employment',
      isImportant: true,
      endDate: '2025-12-20',
    },
    {
      _id: '6',
      title: 'LIFE Mission: Final Call for Housing Applications',
      content: 'The LIFE Mission housing scheme has announced its final call for applications for the year. Eligible homeless families can apply before December 31st.',
      category: 'Housing',
      isImportant: false,
      endDate: '2025-12-31',
    },
  ];
  const [selectedNews, setSelectedNews] = useState(null);
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

  // Refs for carousel and slides
  const carouselRef = useRef(null);
  const slideRefs = useRef([]);

  // Scroll to active slide
  useEffect(() => {
    if (slideRefs.current[currentSlide]) {
      slideRefs.current[currentSlide].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  }, [currentSlide]);

  // Auto-slide functionality - slides to the next slide every 5 seconds
  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000); // 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(autoSlideInterval);
  }, [carouselItems.length]);

  // Handle touch events for swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevSlide();
    }
  };

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
        path: '/',
        match: (path) => path === '/'
      }
    ];

    const allItems = [
      ...baseItems,
      {
        icon: FileText,
        label: 'Manage Schemes',
        path: '/admin/schemes',
        match: (path) => path.startsWith('/admin/schemes'),
        role: 'admin'
      },
      {
        icon: Bell,
        label: 'News & Updates',
        path: '/news',
        match: (path) => path.startsWith('/news'),
        role: 'admin'
      },
      {
        icon: Settings,
        label: 'Admin Settings',
        path: '/admin/settings',
        match: (path) => path.startsWith('/admin'),
        role: 'admin'
      },
      {
        icon: Users,
        label: 'Profile',
        path: '/profile',
        match: (path) => path.startsWith('/profile'),
        role: 'user'
      },
      {
        icon: CheckCircle,
        label: 'Check Eligibility',
        path: '/check-eligibility',
        match: (path) => path.startsWith('/check-eligibility'),
        role: 'user'
      },
      {
        icon: Settings,
        label: 'Settings',
        path: '/settings',
        match: (path) => path.startsWith('/settings'),
        role: 'user'
      }
    ];

    if (user?.role === 'admin') {
      return allItems.filter(item => item.role !== 'user');
    }
    return allItems.filter(item => item.role !== 'admin');
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
  const filteredNavItems = [
    ...getNavItems(),
    // Add logout button at the bottom
    {
      icon: LogOut,
      label: 'Logout',
      isAction: true,
      onClick: handleLogout,
      className: 'logout-button'
    }
  ];
  
  // Update the menu links container to push logout to bottom
  const menuLinksStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingBottom: '1rem'
  };

  useEffect(() => {
    // Fetch news items
    const fetchNews = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.GET_NEWS);
        setNewsItems(dummyNews);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();

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
      {selectedNews && <NewsModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />}
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
                  <div className="user-display">
                    <span className={user.role === 'admin' ? 'admin-username' : ''}>{user.username}</span>
                  </div>
                </>
              ) : (
                <div className="auth-buttons">
                  <button
                    onClick={() => navigate('/login')}
                    className={`login-btn ${location.pathname === '/login' ? 'active' : ''}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className={`register-btn ${location.pathname === '/register' ? 'active' : ''}`}
                  >
                    Register
                  </button>
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
          {user && (
            <div className="sidebar-profile-section">
              <div className="sidebar-avatar">{user.username.charAt(0).toUpperCase()}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-username">{user.username}</div>
                <div className="sidebar-email">{user.email}</div>
              </div>
            </div>
          )}
          <ul className="menu-links">
            {filteredNavItems.map((item, index) => {
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
          {/* New Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Discover Your Entitlements.</h1>
              <p className="hero-subtitle">Your single gateway to Kerala's welfare schemes. Create a profile, get matched, and apply with ease.</p>
              <button className="hero-cta-button" onClick={() => navigate('/register')}>Create Your Profile</button>
            </div>
          </div>

          <div className="content-container">
            <div className="carousel-container">
              <div 
                className="carousel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                ref={carouselRef}
              >
                {carouselItems.map((item, index) => (
                  <div 
                    key={index}
                    ref={el => slideRefs.current[index] = el}
                    className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="carousel-image" 
                    />
                    <div className="carousel-overlay">
                      <div className="carousel-text">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

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
          {/* How It Works Section */}
          <div className="how-it-works-section">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-container">
              <div className="step-card">
                <div className="step-icon-container"><User size={24} /></div>
                <h3 className="step-title">1. Create Your Profile</h3>
                <p className="step-description">Build a detailed personal and household profile in minutes.</p>
              </div>
              <div className="step-card">
                <div className="step-icon-container"><Sparkles size={24} /></div>
                <h3 className="step-title">2. Get Matched</h3>
                <p className="step-description">Our smart engine matches you with schemes you are eligible for.</p>
              </div>
              <div className="step-card">
                <div className="step-icon-container"><FileText size={24} /></div>
                <h3 className="step-title">3. Apply with Ease</h3>
                <p className="step-description">Get guidance on documents and application procedures.</p>
              </div>
            </div>
          </div>

            {/* Latest News Section */} 
            <div className="news-section">
              <div className="section-header">
                <h3>Latest Welfare Scheme Updates</h3>
                <p>Stay updated with the latest government initiatives and benefits for all citizens in Kerala</p>
              </div>

              <div className="news-content">
                <div className="news-grid">
                  {/* News Items */}
                  {newsItems.slice(0, 6).map(item => (
                    <div key={item._id} className="news-card">
                      <div className="news-card-header">
                        <div className={`news-card-icon ${item.category.toLowerCase()}`}>
                          {item.category === 'Education' && <GraduationCap size={20} />}
                          {item.category === 'Agriculture' && <Users size={20} />}
                          {item.category === 'Healthcare' && <Heart size={20} />}
                          {item.category === 'Housing' && <Home size={20} />}
                          {item.category === 'Employment' && <Briefcase size={20} />}
                          {item.category === 'Welfare' && <Shield size={20} />}
                        </div>
                        <span className={`news-card-category ${item.category.toLowerCase()}`}>{item.category}</span>
                        {item.isImportant && <Star size={16} className="important-star" />}
                      </div>
                      <h4 className="news-card-title">{item.title}</h4>
                      <p className="news-card-content">{item.content}</p>
                      <div className="news-card-footer">
                        <span className="news-card-deadline">Deadline: {new Date(item.endDate).toLocaleDateString()}</span>
                        <button onClick={() => setSelectedNews(item)} className="news-card-link">Read More</button>
                      </div>
                    </div>
                  ))}
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Menu, Home, FileText, Users, Bell, Settings, LogOut } from 'lucide-react';
import './EnteSchemeHomePage.css';

const EnteSchemeHomePage = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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

  const handleDashboardClick = () => {
    setSidebarOpen(false);
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/", onClick: handleDashboardClick },
    { icon: FileText, label: "My Schemes", path: "/schemes" },
    { icon: Users, label: "Eligibility Check", path: "/eligibility" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", onClick: handleLogout }
  ];

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-toggle"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
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
          
          <div className="navbar-nav">
            <nav className="nav-links">
              <Link to="/" className="nav-link active">Home</Link>
              <Link to="/schemes" className="nav-link">Schemes</Link>
              <Link to="/eligibility" className="nav-link">Eligibility</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </nav>
          </div>

          <div className="navbar-right">
            <Bell className="notification-icon" />
            {user ? (
              <div className="profile-icon">
                <User />
              </div>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="main-layout">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-content">
            {/* Profile Section */}
            <div className="profile-section">
              <div className="profile-info">
                <div className="profile-avatar">
                  <User />
                </div>
                <div className="profile-details">
                  <h3>Alfred Francis</h3>
                  <p>Student</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="sidebar-nav">
              {sidebarItems.map((item, index) => (
                item.path ? (
                  <Link
                    key={index}
                    to={item.path}
                    className={`sidebar-item ${item.active ? 'active' : ''}`}
                    onClick={item.onClick}
                  >
                    <item.icon className="sidebar-icon" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={index}
                    className={`sidebar-item ${item.active ? 'active' : ''}`}
                    onClick={item.onClick}
                  >
                    <item.icon className="sidebar-icon" />
                    <span>{item.label}</span>
                  </button>
                )
              ))}
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="main-content">
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
              <div className="carousel">
                {carouselItems.map((item, index) => (
                  <div
                    key={index}
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

            {/* Latest News Section */}
            <div className="news-section">
              <div className="section-header">
                <h3>Latest News & Updates</h3>
                <p>Stay updated with the latest welfare scheme announcements and government initiatives</p>
              </div>
              
              <div className="news-content">
                <div className="news-grid">
                  {/* News Item 1 */}
                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag breaking">BREAKING</span>
                      <span className="news-time">2 hours ago</span>
                    </div>
                    <h4>New Pension Scheme Announced for Senior Citizens</h4>
                    <p>Kerala Government announces enhanced pension benefits for senior citizens above 65 years with monthly assistance up to ₹2,500.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  {/* News Item 2 */}
                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag update">UPDATE</span>
                      <span className="news-time">1 day ago</span>
                    </div>
                    <h4>Student Scholarship Program Extended</h4>
                    <p>Application deadline for merit-based scholarships extended to November 30th. Over 50,000 students to benefit from this initiative.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  {/* News Item 3 */}
                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag new">NEW</span>
                      <span className="news-time">2 days ago</span>
                    </div>
                    <h4>Healthcare Coverage Expansion</h4>
                    <p>Free healthcare coverage expanded to include 25 additional districts. Online registration now available through the portal.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  {/* News Item 4 */}
                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag announcement">ANNOUNCEMENT</span>
                      <span className="news-time">3 days ago</span>
                    </div>
                    <h4>Digital Kerala Initiative Launch</h4>
                    <p>New digital platform launched to streamline welfare scheme applications. Citizens can now apply for multiple schemes through single portal.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  {/* News Item 5 */}
                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag reminder">REMINDER</span>
                      <span className="news-time">4 days ago</span>
                    </div>
                    <h4>Monthly Benefit Distribution Schedule</h4>
                    <p>Monthly welfare benefits will be distributed on the 15th of each month. Ensure your bank details are updated in the system.</p>
                    <Link to="#" className="news-link">Read More →</Link>
                  </div>

                  {/* News Item 6 */}
                  <div className="news-item">
                    <div className="news-meta">
                      <span className="news-tag policy">POLICY</span>
                      <span className="news-time">1 week ago</span>
                    </div>
                    <h4>Women Empowerment Schemes Revised</h4>
                    <p>Revised guidelines for women empowerment schemes with increased financial assistance and simplified application process.</p>
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

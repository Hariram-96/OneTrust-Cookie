import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
// Import mock OneTrust for development (remove when using real OneTrust)
import '../utils/mockOneTrust'
import DataCollectionDemo from '../components/DataCollectionDemo'

declare global {
  interface Window {
    Optanon?: {
      ToggleInfoDisplay: () => void;
      SetAlertBoxClosed: (callback: () => void) => void;
      InsertHtml: (html: string) => void;
      GetDomainData: () => any;
    };
    OptanonWrapper?: () => void;
    OneTrust?: any;
  }
}

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isRequired: boolean;
}

export default function Home() {
  const [cookieCategories, setCookieCategories] = useState<CookieCategory[]>([
    {
      id: 'necessary',
      name: 'Strictly Necessary Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      isActive: true,
      isRequired: true
    },
    {
      id: 'performance',
      name: 'Performance Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      isActive: false,
      isRequired: false
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      isActive: false,
      isRequired: false
    },
    {
      id: 'targeting',
      name: 'Targeting Cookies',
      description: 'These cookies are used to deliver advertisements more relevant to you.',
      isActive: false,
      isRequired: false
    }
  ]);

  const [showBanner, setShowBanner] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Initialize OneTrust if available
    if (window.OneTrust) {
      console.log('OneTrust is available');
    }

    // Listen for mock OneTrust events
    const handleShowPreferenceCenter = () => {
      setShowPreferences(true);
    };

    const handleConsentChanged = (event: any) => {
      console.log('Consent changed:', event.detail);
    };

    window.addEventListener('showPreferenceCenter', handleShowPreferenceCenter);
    window.addEventListener('OneTrustConsentChanged', handleConsentChanged);

    return () => {
      window.removeEventListener('showPreferenceCenter', handleShowPreferenceCenter);
      window.removeEventListener('OneTrustConsentChanged', handleConsentChanged);
    };
  }, []);

  const handleAcceptAll = () => {
    // Use OneTrust API if available
    if (window.OneTrust?.AcceptAll) {
      window.OneTrust.AcceptAll();
    }
    
    setCookieCategories(prev => 
      prev.map(cat => ({ ...cat, isActive: true }))
    );
    setShowBanner(false);
    console.log('All cookies accepted');
  };

  const handleRejectAll = () => {
    // Use OneTrust API if available
    if (window.OneTrust?.RejectAll) {
      window.OneTrust.RejectAll();
    }
    
    setCookieCategories(prev => 
      prev.map(cat => ({ ...cat, isActive: cat.isRequired }))
    );
    setShowBanner(false);
    console.log('Non-essential cookies rejected');
  };

  const handleShowPreferences = () => {
    setShowPreferences(true);
  };

  const handleSavePreferences = () => {
    // Update OneTrust categories if available
    if (window.OneTrust) {
      cookieCategories.forEach(category => {
        if (category.isActive && window.OneTrust.AllowCategory) {
          window.OneTrust.AllowCategory(category.id);
        } else if (!category.isActive && !category.isRequired && window.OneTrust.DenyCategory) {
          window.OneTrust.DenyCategory(category.id);
        }
      });
    }
    
    setShowBanner(false);
    setShowPreferences(false);
    console.log('Cookie preferences saved:', cookieCategories);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setCookieCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const openOneTrustPanel = () => {
    if (window.Optanon?.ToggleInfoDisplay) {
      window.Optanon.ToggleInfoDisplay();
    } else {
      setShowPreferences(true);
    }
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>OneTrust Demo</h2>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <button className="cookie-settings-btn" onClick={openOneTrustPanel}>
              Cookie Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1>OneTrust Cookie Management Demo</h1>
          <p className="hero-subtitle">
            Experience comprehensive cookie consent management with OneTrust's 
            industry-leading privacy compliance solution.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={openOneTrustPanel}>
              Manage Cookies
            </button>
            <button className="btn btn-secondary" onClick={() => setShowBanner(true)}>
              Show Cookie Banner
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2>Privacy & Cookie Management Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍪</div>
              <h3>Cookie Categorization</h3>
              <p>Automatically categorize cookies based on their purpose and functionality.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Granular Controls</h3>
              <p>Give users fine-grained control over their cookie preferences.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Compliance Reporting</h3>
              <p>Generate comprehensive reports for regulatory compliance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Privacy Laws</h3>
              <p>Support for GDPR, CCPA, and other international privacy regulations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About OneTrust Cookie Consent</h2>
              <p>
                OneTrust is the leading privacy management platform that helps organizations 
                comply with data privacy regulations while building trust with their customers.
              </p>
              <ul>
                <li>✅ GDPR & CCPA Compliant</li>
                <li>✅ Automated Cookie Scanning</li>
                <li>✅ Customizable Consent Banners</li>
                <li>✅ Real-time Consent Management</li>
              </ul>
            </div>
            <div className="about-stats">
              <div className="stat">
                <h3>10,000+</h3>
                <p>Organizations Trust OneTrust</p>
              </div>
              <div className="stat">
                <h3>150+</h3>
                <p>Countries Supported</p>
              </div>
              <div className="stat">
                <h3>99.9%</h3>
                <p>Uptime Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Collection Demo Section */}
      <section className="demo-section">
        <div className="container">
          <DataCollectionDemo />
        </div>
      </section>

      {/* Cookie Banner */}
      {showBanner && (
        <div className="cookie-banner">
          <div className="cookie-banner-content">
            <div className="cookie-banner-text">
              <h3>🍪 We use cookies</h3>
              <p>
                We use cookies and similar technologies to enhance your browsing experience, 
                analyze site traffic, and provide personalized content. You can manage your 
                cookie preferences at any time. See our{' '}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </p>
            </div>
            <div className="cookie-banner-buttons">
              <button className="btn btn-outline" onClick={handleRejectAll}>
                Reject All
              </button>
              <button className="btn btn-outline" onClick={handleShowPreferences}>
                Customize
              </button>
              <button className="btn btn-primary" onClick={handleAcceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="modal-overlay">
          <div className="cookie-preferences-modal">
            <div className="modal-header">
              <h2>Cookie Preferences</h2>
              <button 
                className="modal-close"
                onClick={() => setShowPreferences(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Manage your cookie preferences below. You can enable or disable different 
                types of cookies and change your preferences at any time.
              </p>
              
              {cookieCategories.map(category => (
                <div key={category.id} className="cookie-category">
                  <div className="category-header">
                    <div className="category-info">
                      <h4>{category.name}</h4>
                      <p>{category.description}</p>
                    </div>
                    <div className="category-toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={category.isActive}
                          disabled={category.isRequired}
                          onChange={() => handleCategoryToggle(category.id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={handleRejectAll}>
                Reject All
              </button>
              <button className="btn btn-primary" onClick={handleSavePreferences}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Data Collection Demo Component
// This demonstrates how to collect and use data based on cookie consent

import { useState, useEffect } from 'react';

interface AnalyticsData {
  pageViews: number;
  sessionDuration: number;
  userInteractions: string[];
  lastVisit: string;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

export const DataCollectionDemo: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    sessionDuration: 0,
    userInteractions: [],
    lastVisit: ''
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'en',
    notifications: false
  });

  const [consentStatus, setConsentStatus] = useState({
    performance: false,
    functional: false,
    targeting: false
  });

  useEffect(() => {
    // Check consent status and collect data accordingly
    checkConsentAndCollectData();
    
    // Listen for consent changes
    const handleConsentChange = () => {
      checkConsentAndCollectData();
    };

    window.addEventListener('OneTrustConsentChanged', handleConsentChange);
    return () => {
      window.removeEventListener('OneTrustConsentChanged', handleConsentChange);
    };
  }, []);

  const checkConsentAndCollectData = () => {
    // Get consent status from OneTrust or mock
    const activeCategories = getActiveCategories();
    
    const newConsentStatus = {
      performance: activeCategories.includes('C0002'),
      functional: activeCategories.includes('C0003'), 
      targeting: activeCategories.includes('C0004')
    };

    setConsentStatus(newConsentStatus);

    // Collect data based on consent
    if (newConsentStatus.performance) {
      collectAnalyticsData();
    }

    if (newConsentStatus.functional) {
      loadUserPreferences();
    }

    if (newConsentStatus.targeting) {
      trackForAdvertising();
    }
  };

  const getActiveCategories = (): string[] => {
    if (window.OneTrust?.GetDomainData) {
      try {
        const domainData = window.OneTrust.GetDomainData();
        return domainData.Groups
          .filter((group: any) => group.Status === 'active' || group.Status === 'always')
          .map((group: any) => group.CustomGroupId);
      } catch (error) {
        console.error('Error getting active categories:', error);
      }
    }
    return ['C0001']; // Default to necessary cookies only
  };

  const collectAnalyticsData = () => {
    console.log('📊 Collecting analytics data (Performance cookies enabled)');
    
    // Simulate analytics collection
    setAnalyticsData(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1,
      sessionDuration: Date.now(),
      userInteractions: [...prev.userInteractions, `Click at ${new Date().toLocaleTimeString()}`],
      lastVisit: new Date().toISOString()
    }));

    // Set analytics cookies (with consent)
    setCookieWithConsent('_analytics_session', 'session123', 1, 'C0002');
    setCookieWithConsent('_page_views', String(analyticsData.pageViews + 1), 30, 'C0002');
  };

  const loadUserPreferences = () => {
    console.log('⚙️ Loading user preferences (Functional cookies enabled)');
    
    // Load preferences from cookies
    const savedTheme = getCookie('user_theme') as 'light' | 'dark' || 'light';
    const savedLanguage = getCookie('user_language') || 'en';
    const savedNotifications = getCookie('user_notifications') === 'true';

    setUserPreferences({
      theme: savedTheme,
      language: savedLanguage,
      notifications: savedNotifications
    });
  };

  const trackForAdvertising = () => {
    console.log('🎯 Tracking for advertising (Targeting cookies enabled)');
    
    // Set advertising/targeting cookies
    setCookieWithConsent('_ad_user_id', 'user_' + Math.random().toString(36), 90, 'C0004');
    setCookieWithConsent('_campaign_source', 'direct', 30, 'C0004');
  };

  const setCookieWithConsent = (name: string, value: string, days: number, categoryId: string) => {
    if (consentStatus.performance && categoryId === 'C0002' ||
        consentStatus.functional && categoryId === 'C0003' ||
        consentStatus.targeting && categoryId === 'C0004') {
      
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
      console.log(`🍪 Cookie set: ${name}=${value} (${categoryId})`);
    } else {
      console.log(`❌ Cookie not set: ${name} (no consent for ${categoryId})`);
    }
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    if (consentStatus.functional) {
      const newPreferences = { ...userPreferences, [key]: value };
      setUserPreferences(newPreferences);
      
      // Save to cookies if functional cookies are enabled
      setCookieWithConsent(`user_${key}`, String(value), 365, 'C0003');
    } else {
      alert('Functional cookies must be enabled to save preferences');
    }
  };

  return (
    <div className="data-collection-demo">
      <h3>🔍 Data Collection Status</h3>
      
      <div className="consent-status">
        <h4>Current Consent Status:</h4>
        <div className="status-grid">
          <div className={`status-item ${consentStatus.performance ? 'active' : 'inactive'}`}>
            📊 Analytics: {consentStatus.performance ? 'Enabled' : 'Disabled'}
          </div>
          <div className={`status-item ${consentStatus.functional ? 'active' : 'inactive'}`}>
            ⚙️ Preferences: {consentStatus.functional ? 'Enabled' : 'Disabled'}
          </div>
          <div className={`status-item ${consentStatus.targeting ? 'active' : 'inactive'}`}>
            🎯 Advertising: {consentStatus.targeting ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>

      {consentStatus.performance && (
        <div className="analytics-section">
          <h4>📊 Analytics Data</h4>
          <div className="data-display">
            <p><strong>Page Views:</strong> {analyticsData.pageViews}</p>
            <p><strong>Session Start:</strong> {new Date(analyticsData.sessionDuration).toLocaleTimeString()}</p>
            <p><strong>Last Visit:</strong> {analyticsData.lastVisit ? new Date(analyticsData.lastVisit).toLocaleString() : 'Never'}</p>
            <p><strong>Interactions:</strong> {analyticsData.userInteractions.length}</p>
          </div>
        </div>
      )}

      {consentStatus.functional && (
        <div className="preferences-section">
          <h4>⚙️ User Preferences</h4>
          <div className="preference-controls">
            <label>
              Theme: 
              <select 
                value={userPreferences.theme} 
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            
            <label>
              Language:
              <select 
                value={userPreferences.language} 
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={userPreferences.notifications}
                onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              />
              Enable Notifications
            </label>
          </div>
        </div>
      )}

      {consentStatus.targeting && (
        <div className="advertising-section">
          <h4>🎯 Advertising Data</h4>
          <div className="data-display">
            <p>✅ User ID tracking enabled</p>
            <p>✅ Campaign attribution enabled</p>
            <p>✅ Behavioral targeting active</p>
            <p>✅ Cross-site tracking enabled</p>
          </div>
        </div>
      )}

      <div className="demo-actions">
        <button onClick={collectAnalyticsData} disabled={!consentStatus.performance}>
          📊 Trigger Analytics Event
        </button>
        <button onClick={loadUserPreferences} disabled={!consentStatus.functional}>
          ⚙️ Reload Preferences
        </button>
        <button onClick={trackForAdvertising} disabled={!consentStatus.targeting}>
          🎯 Track Ad Event
        </button>
      </div>
    </div>
  );
};

export default DataCollectionDemo;
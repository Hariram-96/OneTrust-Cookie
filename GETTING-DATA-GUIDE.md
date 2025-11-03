# 🎯 Complete Guide: Getting Real Data with OneTrust

## Overview
This guide shows you how to transition from the demo to collecting **real data** with proper consent management using OneTrust.

---

## 🚀 **Phase 1: Setup Real OneTrust Account**

### Step 1: Create OneTrust Account
1. **Visit**: [https://www.onetrust.com/free-trial/](https://www.onetrust.com/free-trial/)
2. **Sign up** for a free trial account
3. **Complete** the onboarding questionnaire
4. **Choose** your region (affects data center location)

### Step 2: Configure Your Website
1. **Log into** OneTrust Console: [https://app.onetrust.com/](https://app.onetrust.com/)
2. **Navigate to**: Cookie Consent → Getting Started
3. **Add your website URL** and scan for cookies
4. **Copy your Domain Script ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 3: Update Your Code
Replace the placeholder in `index.html`:

```html
<!-- BEFORE (Demo) -->
<script data-domain-script="your-domain-script-id-here"></script>

<!-- AFTER (Real) -->
<script data-domain-script="01234567-89ab-cdef-0123-456789abcdef"></script>
```

---

## 📊 **Phase 2: Collect Analytics Data**

### Google Analytics 4 Integration

#### 1. Setup GA4 with Consent Mode
```javascript
// Initialize GA4 with consent mode
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied'
});

// Listen for OneTrust consent changes
window.addEventListener('OneTrustConsentChanged', function() {
  const activeGroups = OneTrust.GetDomainData().Groups
    .filter(group => group.Status === 'active')
    .map(group => group.CustomGroupId);
  
  // Update GA4 consent based on OneTrust categories
  gtag('consent', 'update', {
    'analytics_storage': activeGroups.includes('C0002') ? 'granted' : 'denied',
    'ad_storage': activeGroups.includes('C0004') ? 'granted' : 'denied'
  });
});
```

#### 2. Track Events with Consent
```javascript
function trackEvent(eventName, parameters) {
  // Only track if performance cookies are enabled
  if (OneTrust.IsConsentValid(['C0002'])) {
    gtag('event', eventName, parameters);
  } else {
    console.log('Analytics tracking blocked - no consent');
  }
}

// Example usage
trackEvent('page_view', {
  page_title: document.title,
  page_location: window.location.href
});
```

### Custom Analytics Implementation
```javascript
class ConsentAwareAnalytics {
  constructor() {
    this.endpoint = 'https://your-analytics-api.com/events';
    this.sessionId = this.generateSessionId();
  }

  trackPageView() {
    if (this.hasAnalyticsConsent()) {
      this.sendEvent('page_view', {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      });
    }
  }

  trackUserInteraction(element, action) {
    if (this.hasAnalyticsConsent()) {
      this.sendEvent('user_interaction', {
        element: element,
        action: action,
        timestamp: new Date().toISOString()
      });
    }
  }

  hasAnalyticsConsent() {
    return window.OneTrust && 
           window.OneTrust.IsConsentValid && 
           window.OneTrust.IsConsentValid(['C0002']);
  }

  async sendEvent(eventType, data) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, data })
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
}
```

---

## ⚙️ **Phase 3: Collect User Preferences**

### 1. Preference Storage System
```javascript
class UserPreferenceManager {
  constructor() {
    this.storageKey = 'user_preferences';
  }

  savePreference(key, value) {
    if (this.hasFunctionalConsent()) {
      const preferences = this.getPreferences();
      preferences[key] = value;
      
      // Save to localStorage (functional cookie alternative)
      localStorage.setItem(this.storageKey, JSON.stringify(preferences));
      
      // Or save to cookie
      this.setCookie(`pref_${key}`, JSON.stringify(value), 365);
    } else {
      console.log('Cannot save preferences - no functional consent');
    }
  }

  getPreference(key, defaultValue = null) {
    if (this.hasFunctionalConsent()) {
      const preferences = this.getPreferences();
      return preferences[key] || defaultValue;
    }
    return defaultValue;
  }

  getPreferences() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  hasFunctionalConsent() {
    return window.OneTrust && 
           window.OneTrust.IsConsentValid && 
           window.OneTrust.IsConsentValid(['C0003']);
  }

  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
}
```

### 2. React Hook for Preferences
```javascript
import { useState, useEffect } from 'react';

export function useUserPreference(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    checkConsentAndLoad();
    
    // Listen for consent changes
    window.addEventListener('OneTrustConsentChanged', checkConsentAndLoad);
    return () => {
      window.removeEventListener('OneTrustConsentChanged', checkConsentAndLoad);
    };
  }, [key]);

  const checkConsentAndLoad = () => {
    const functionalConsent = window.OneTrust?.IsConsentValid?.(['C0003']) || false;
    setHasConsent(functionalConsent);
    
    if (functionalConsent) {
      const stored = localStorage.getItem(`pref_${key}`);
      if (stored) {
        try {
          setValue(JSON.parse(stored));
        } catch {
          setValue(defaultValue);
        }
      }
    }
  };

  const updateValue = (newValue) => {
    if (hasConsent) {
      setValue(newValue);
      localStorage.setItem(`pref_${key}`, JSON.stringify(newValue));
    }
  };

  return [value, updateValue, hasConsent];
}

// Usage example
function MyComponent() {
  const [theme, setTheme, canSaveTheme] = useUserPreference('theme', 'light');
  const [language, setLanguage, canSaveLanguage] = useUserPreference('language', 'en');
  
  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)} disabled={!canSaveTheme}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      {!canSaveTheme && <p>Enable functional cookies to save preferences</p>}
    </div>
  );
}
```

---

## 🎯 **Phase 4: Advertising & Marketing Data**

### 1. Facebook Pixel Integration
```javascript
class ConsentAwareFacebookPixel {
  constructor(pixelId) {
    this.pixelId = pixelId;
    this.initialized = false;
  }

  init() {
    if (this.hasTargetingConsent() && !this.initialized) {
      // Load Facebook Pixel
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', this.pixelId);
      fbq('track', 'PageView');
      this.initialized = true;
    }
  }

  trackEvent(eventName, parameters = {}) {
    if (this.hasTargetingConsent() && this.initialized) {
      fbq('track', eventName, parameters);
    }
  }

  hasTargetingConsent() {
    return window.OneTrust && 
           window.OneTrust.IsConsentValid && 
           window.OneTrust.IsConsentValid(['C0004']);
  }
}
```

### 2. Custom Marketing Tracking
```javascript
class MarketingTracker {
  constructor() {
    this.apiEndpoint = 'https://your-marketing-api.com/track';
    this.userId = this.getUserId();
  }

  trackConversion(conversionType, value = null) {
    if (this.hasTargetingConsent()) {
      this.sendTrackingData('conversion', {
        type: conversionType,
        value: value,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        source: document.referrer,
        campaign: this.getCampaignInfo()
      });
    }
  }

  trackProductView(productId, productName) {
    if (this.hasTargetingConsent()) {
      this.sendTrackingData('product_view', {
        productId,
        productName,
        userId: this.userId,
        timestamp: new Date().toISOString()
      });
    }
  }

  getUserId() {
    // Generate or retrieve user ID (only if consent given)
    if (this.hasTargetingConsent()) {
      let userId = this.getCookie('marketing_user_id');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.setCookie('marketing_user_id', userId, 90);
      }
      return userId;
    }
    return null;
  }

  hasTargetingConsent() {
    return window.OneTrust && 
           window.OneTrust.IsConsentValid && 
           window.OneTrust.IsConsentValid(['C0004']);
  }

  async sendTrackingData(eventType, data) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, data })
      });
    } catch (error) {
      console.error('Marketing tracking error:', error);
    }
  }
}
```

---

## 🔒 **Phase 5: Data Protection & Compliance**

### 1. Data Retention Management
```javascript
class DataRetentionManager {
  constructor() {
    this.retentionPolicies = {
      'C0002': 24 * 30, // Performance data: 30 days
      'C0003': 24 * 365, // Functional data: 1 year
      'C0004': 24 * 90   // Targeting data: 90 days
    };
  }

  cleanupExpiredData() {
    Object.entries(this.retentionPolicies).forEach(([category, hoursRetention]) => {
      const cutoffDate = new Date(Date.now() - (hoursRetention * 60 * 60 * 1000));
      this.removeDataOlderThan(category, cutoffDate);
    });
  }

  removeDataOlderThan(category, cutoffDate) {
    // Remove cookies for category
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      if (name.trim().startsWith(category)) {
        this.deleteCookie(name.trim());
      }
    });

    // Remove localStorage data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(category)) {
        const stored = localStorage.getItem(key);
        try {
          const data = JSON.parse(stored);
          if (data.timestamp && new Date(data.timestamp) < cutoffDate) {
            localStorage.removeItem(key);
          }
        } catch {
          // Remove invalid data
          localStorage.removeItem(key);
        }
      }
    });
  }
}
```

### 2. User Rights Implementation (GDPR)
```javascript
class UserRightsManager {
  // Right to Access
  exportUserData() {
    const userData = {
      cookies: this.getAllCookies(),
      localStorage: this.getAllLocalStorage(),
      preferences: this.getUserPreferences(),
      analytics: this.getAnalyticsData(),
      consent: this.getConsentHistory()
    };
    
    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(userData, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  // Right to Rectification
  updateUserData(category, newData) {
    if (this.hasConsentFor(category)) {
      // Update the data
      localStorage.setItem(`${category}_data`, JSON.stringify(newData));
      console.log(`Updated data for category: ${category}`);
    }
  }

  // Right to Erasure (Right to be Forgotten)
  deleteAllUserData() {
    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      this.deleteCookie(name.trim());
    });
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reset OneTrust consent
    if (window.OneTrust) {
      window.OneTrust.ResetConsent();
    }
    
    console.log('All user data deleted');
  }

  // Right to Portability
  generateDataPortabilityFile() {
    const portableData = {
      format: 'JSON-LD',
      generatedAt: new Date().toISOString(),
      userData: this.exportUserData()
    };
    
    return portableData;
  }
}
```

---

## 🧪 **Phase 6: Testing & Validation**

### 1. Consent Testing Checklist
- [ ] **Banner Display**: Cookie banner shows on first visit
- [ ] **Accept All**: All categories become active
- [ ] **Reject All**: Only necessary cookies remain active
- [ ] **Custom Preferences**: Individual categories can be toggled
- [ ] **Data Collection**: Data only collected with proper consent
- [ ] **Consent Persistence**: Preferences saved across sessions
- [ ] **Consent Updates**: Changes reflected immediately

### 2. Automated Testing
```javascript
// Cypress test example
describe('Cookie Consent Flow', () => {
  it('should respect user consent preferences', () => {
    cy.visit('/');
    
    // Initial state - no tracking
    cy.window().then(win => {
      expect(win.dataLayer).to.be.undefined;
    });
    
    // Accept performance cookies
    cy.get('[data-testid="customize-cookies"]').click();
    cy.get('[data-testid="performance-toggle"]').click();
    cy.get('[data-testid="save-preferences"]').click();
    
    // Verify tracking is now active
    cy.window().then(win => {
      expect(win.dataLayer).to.not.be.undefined;
    });
  });
});
```

---

## 📈 **Phase 7: Monitoring & Analytics**

### 1. Consent Rate Monitoring
```javascript
class ConsentAnalytics {
  trackConsentRates() {
    const consentData = {
      timestamp: new Date().toISOString(),
      totalVisitors: this.getTotalVisitors(),
      consentRates: {
        acceptAll: this.getAcceptAllRate(),
        rejectAll: this.getRejectAllRate(),
        customize: this.getCustomizeRate(),
        performance: this.getCategoryRate('C0002'),
        functional: this.getCategoryRate('C0003'),
        targeting: this.getCategoryRate('C0004')
      }
    };
    
    // Send to your analytics platform
    this.sendConsentAnalytics(consentData);
  }
}
```

---

## 🚀 **Production Deployment Checklist**

- [ ] **Real OneTrust Domain Script ID** configured
- [ ] **Cookie categories** match OneTrust console setup
- [ ] **Data collection** respects consent choices
- [ ] **GDPR compliance** features implemented
- [ ] **Performance monitoring** in place
- [ ] **Error handling** for OneTrust failures
- [ ] **Testing** completed across all browsers
- [ ] **Legal review** completed (if required)

---

## 🆘 **Troubleshooting Common Issues**

### Issue: OneTrust not loading
**Solution**: Check network connectivity, verify domain script ID, ensure HTTPS

### Issue: Consent not persisting
**Solution**: Check cookie domain settings, verify localStorage access, check browser privacy settings

### Issue: Data collection not working
**Solution**: Verify consent checking logic, check API endpoints, review browser console errors

---

**🎉 Congratulations!** You now have a complete guide to collect real data with proper consent management using OneTrust.
// OneTrust Configuration
// Replace 'your-domain-script-id-here' with your actual OneTrust domain script ID

export const oneTrustConfig = {
  // Your OneTrust domain script ID (get this from your OneTrust console)
  domainScript: 'your-domain-script-id-here',
  
  // CDN URL for OneTrust script
  scriptUrl: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
  
  // Auto-show banner on page load
  autoShowBanner: true,
  
  // Default language (can be overridden by geolocation)
  language: 'en',
  
  // Enable geolocation-based settings
  geolocationEnabled: true,
  
  // Consent model ('notice' or 'opt-in')
  consentModel: 'opt-in',
  
  // Cookie categories configuration
  categories: {
    necessary: {
      id: 'C0001',
      name: 'Strictly Necessary',
      required: true
    },
    performance: {
      id: 'C0002', 
      name: 'Performance',
      required: false
    },
    functional: {
      id: 'C0003',
      name: 'Functional',
      required: false
    },
    targeting: {
      id: 'C0004',
      name: 'Targeting',
      required: false
    }
  },
  
  // UI customization
  ui: {
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    borderRadius: '8px'
  },
  
  // Banner configuration
  banner: {
    position: 'bottom',
    showCloseButton: true,
    showRejectAllButton: true,
    showAcceptAllButton: true,
    showPreferencesButton: true
  },
  
  // Preference center configuration  
  preferenceCenter: {
    showToggle: true,
    showCookieList: true,
    showVendorList: true,
    enableSearch: true
  }
};

// Sample cookies for demonstration (replace with your actual cookies)
export const sampleCookies = [
  {
    name: '_ga',
    category: 'performance',
    purpose: 'Google Analytics - distinguishes users',
    expiry: '2 years',
    type: 'HTTP'
  },
  {
    name: '_gid', 
    category: 'performance',
    purpose: 'Google Analytics - distinguishes users',
    expiry: '24 hours',
    type: 'HTTP'
  },
  {
    name: 'sessionId',
    category: 'necessary', 
    purpose: 'Session management',
    expiry: 'Session',
    type: 'HTTP'
  },
  {
    name: 'preferences',
    category: 'functional',
    purpose: 'User preferences storage',
    expiry: '1 year', 
    type: 'Local Storage'
  },
  {
    name: '_fbp',
    category: 'targeting',
    purpose: 'Facebook Pixel - ad targeting',
    expiry: '3 months',
    type: 'HTTP'
  }
];

export default oneTrustConfig;
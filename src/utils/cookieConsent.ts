// OneTrust Cookie Consent Utilities

export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isRequired: boolean;
}

export interface OneTrustConfig {
  domainScript: string;
  autoShowBanner?: boolean;
  language?: string;
  geolocationEnabled?: boolean;
}

// Default cookie categories
export const defaultCookieCategories: CookieCategory[] = [
  {
    id: 'C0001',
    name: 'Strictly Necessary Cookies',
    description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
    isActive: true,
    isRequired: true
  },
  {
    id: 'C0002', 
    name: 'Performance Cookies',
    description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
    isActive: false,
    isRequired: false
  },
  {
    id: 'C0003',
    name: 'Functional Cookies', 
    description: 'These cookies enable the website to provide enhanced functionality and personalisation.',
    isActive: false,
    isRequired: false
  },
  {
    id: 'C0004',
    name: 'Targeting Cookies',
    description: 'These cookies may be set through our site by our advertising partners.',
    isActive: false,
    isRequired: false
  }
];

// OneTrust API wrapper
export class OneTrustManager {
  private static instance: OneTrustManager;
  private isInitialized = false;

  static getInstance(): OneTrustManager {
    if (!OneTrustManager.instance) {
      OneTrustManager.instance = new OneTrustManager();
    }
    return OneTrustManager.instance;
  }

  // Initialize OneTrust (called after script loads)
  initialize(): void {
    if (typeof window !== 'undefined' && window.OneTrust) {
      this.isInitialized = true;
      console.log('OneTrust initialized successfully');
    }
  }

  // Show cookie preference center
  showPreferenceCenter(): void {
    if (this.isOneTrustAvailable() && window.Optanon?.ToggleInfoDisplay) {
      window.Optanon.ToggleInfoDisplay();
    } else {
      console.warn('OneTrust preference center not available');
    }
  }

  // Accept all cookies
  acceptAll(): void {
    if (this.isOneTrustAvailable() && window.OneTrust) {
      window.OneTrust.AcceptAll();
    } else {
      console.warn('OneTrust AcceptAll not available');
    }
  }

  // Reject all non-essential cookies
  rejectAll(): void {
    if (this.isOneTrustAvailable() && window.OneTrust) {
      window.OneTrust.RejectAll();
    } else {
      console.warn('OneTrust RejectAll not available');
    }
  }

  // Get consent status for a specific category
  getConsentStatus(categoryId: string): boolean {
    if (this.isOneTrustAvailable() && window.OneTrust) {
      try {
        const activeCategories = this.getActiveCategories();
        return activeCategories.includes(categoryId);
      } catch (error) {
        console.error('Error getting consent status:', error);
      }
    }
    return false;
  }

  // Check if OneTrust is available
  private isOneTrustAvailable(): boolean {
    return this.isInitialized && typeof window !== 'undefined' && 
           (window.OneTrust || window.Optanon);
  }

  // Get all active consent categories
  getActiveCategories(): string[] {
    if (this.isOneTrustAvailable() && window.OneTrust) {
      try {
        const activeGroups = window.OneTrust.GetDomainData().Groups
          .filter((group: any) => group.Status === 'always' || group.Status === 'active')
          .map((group: any) => group.CustomGroupId);
        return activeGroups;
      } catch (error) {
        console.error('Error getting active categories:', error);
      }
    }
    return [];
  }

  // Set consent for specific categories
  setConsentForCategories(categories: { [categoryId: string]: boolean }): void {
    if (this.isOneTrustAvailable() && window.OneTrust) {
      try {
        Object.entries(categories).forEach(([categoryId, consent]) => {
          if (consent) {
            window.OneTrust.AllowCategory(categoryId);
          } else {
            window.OneTrust.DenyCategory(categoryId);
          }
        });
      } catch (error) {
        console.error('Error setting consent for categories:', error);
      }
    }
  }

  // Listen for consent changes
  onConsentChanged(callback: (categories: string[]) => void): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('OptanonLoaded', () => {
        callback(this.getActiveCategories());
      });

      window.addEventListener('OneTrustConsentChanged', () => {
        callback(this.getActiveCategories());
      });
    }
  }
}

// Utility functions for cookie management
export const cookieUtils = {
  // Set a cookie with proper consent checking
  setCookie(name: string, value: string, days: number = 365, categoryId?: string): void {
    if (categoryId && !OneTrustManager.getInstance().getConsentStatus(categoryId)) {
      console.warn(`Cannot set cookie ${name}: consent not granted for category ${categoryId}`);
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },

  // Get a cookie value
  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Delete a cookie
  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  // Check if cookies are enabled
  areCookiesEnabled(): boolean {
    try {
      document.cookie = "cookietest=1";
      const cookiesEnabled = document.cookie.indexOf("cookietest=") !== -1;
      document.cookie = "cookietest=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return cookiesEnabled;
    } catch (e) {
      return false;
    }
  }
};

// Export the singleton instance
export default OneTrustManager.getInstance();
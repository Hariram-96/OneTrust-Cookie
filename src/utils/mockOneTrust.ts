// Demo OneTrust Implementation
// This simulates OneTrust functionality for development/testing purposes
// Replace with actual OneTrust integration when you have a domain script ID

interface MockOneTrustAPI {
  AcceptAll: () => void;
  RejectAll: () => void;
  IsAlertBoxClosed: () => boolean;
  GetDomainData: () => any;
  AllowCategory: (categoryId: string) => void;
  DenyCategory: (categoryId: string) => void;
  ToggleInfoDisplay?: () => void;
}

class MockOneTrust implements MockOneTrustAPI {
  private isInitialized = false;
  private consentData: { [key: string]: boolean } = {
    'C0001': true,  // Necessary - always true
    'C0002': false, // Performance
    'C0003': false, // Functional
    'C0004': false  // Targeting
  };
  
  private mockGroups = [
    {
      CustomGroupId: 'C0001',
      GroupName: 'Strictly Necessary Cookies',
      Status: 'always',
      Description: 'These cookies are necessary for the website to function'
    },
    {
      CustomGroupId: 'C0002', 
      GroupName: 'Performance Cookies',
      Status: 'inactive',
      Description: 'These cookies help us understand how visitors interact with our website'
    },
    {
      CustomGroupId: 'C0003',
      GroupName: 'Functional Cookies', 
      Status: 'inactive',
      Description: 'These cookies enable enhanced functionality and personalization'
    },
    {
      CustomGroupId: 'C0004',
      GroupName: 'Targeting Cookies',
      Status: 'inactive', 
      Description: 'These cookies are used to deliver advertisements more relevant to you'
    }
  ];

  constructor() {
    this.initialize();
  }

  private initialize() {
    console.log('🍪 Mock OneTrust initialized for development');
    this.isInitialized = true;
    
    // Simulate OneTrust loading delay
    setTimeout(() => {
      this.triggerOptanonWrapper();
    }, 100);
  }

  private triggerOptanonWrapper() {
    if (typeof window !== 'undefined' && window.OptanonWrapper) {
      window.OptanonWrapper();
    }
    
    // Dispatch custom events
    window.dispatchEvent(new CustomEvent('OptanonLoaded'));
  }

  AcceptAll(): void {
    console.log('🍪 Mock OneTrust: Accept All called');
    Object.keys(this.consentData).forEach(key => {
      this.consentData[key] = true;
    });
    this.updateGroupStatus();
    this.dispatchConsentChanged();
  }

  RejectAll(): void {
    console.log('🍪 Mock OneTrust: Reject All called');
    // Reset to default (only necessary cookies)
    this.consentData = {
      'C0001': true,  // Necessary always stays true
      'C0002': false,
      'C0003': false, 
      'C0004': false
    };
    this.updateGroupStatus();
    this.dispatchConsentChanged();
  }

  IsAlertBoxClosed(): boolean {
    return this.isInitialized;
  }

  GetDomainData(): any {
    return {
      Groups: this.mockGroups.map(group => ({
        ...group,
        Status: this.consentData[group.CustomGroupId] ? 'active' : 'inactive'
      }))
    };
  }

  AllowCategory(categoryId: string): void {
    console.log(`🍪 Mock OneTrust: Allow category ${categoryId}`);
    if (categoryId in this.consentData) {
      this.consentData[categoryId] = true;
      this.updateGroupStatus();
      this.dispatchConsentChanged();
    }
  }

  DenyCategory(categoryId: string): void {
    console.log(`🍪 Mock OneTrust: Deny category ${categoryId}`);
    // Can't deny necessary cookies
    if (categoryId !== 'C0001' && categoryId in this.consentData) {
      this.consentData[categoryId] = false;
      this.updateGroupStatus();
      this.dispatchConsentChanged();
    }
  }

  private updateGroupStatus(): void {
    this.mockGroups.forEach(group => {
      if (group.CustomGroupId === 'C0001') {
        group.Status = 'always'; // Necessary cookies always active
      } else {
        group.Status = this.consentData[group.CustomGroupId] ? 'active' : 'inactive';
      }
    });
  }

  private dispatchConsentChanged(): void {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('OneTrustConsentChanged', {
        detail: { activeCategories: this.getActiveCategories() }
      }));
    }, 50);
  }

  private getActiveCategories(): string[] {
    return Object.entries(this.consentData)
      .filter(([_, isActive]) => isActive)
      .map(([categoryId]) => categoryId);
  }

  // Method to get current consent status
  getConsentStatus(): { [key: string]: boolean } {
    return { ...this.consentData };
  }
}

// Initialize mock OneTrust if real OneTrust is not available
if (typeof window !== 'undefined' && !window.OneTrust) {
  const mockOneTrust = new MockOneTrust();
  
  // Expose mock OneTrust API
  window.OneTrust = mockOneTrust;
  window.Optanon = {
    ToggleInfoDisplay: () => {
      console.log('🍪 Mock OneTrust: Toggle Info Display called');
      // You can trigger your custom preference center here
      const event = new CustomEvent('showPreferenceCenter');
      window.dispatchEvent(event);
    },
    SetAlertBoxClosed: (callback: () => void) => {
      console.log('🍪 Mock OneTrust: SetAlertBoxClosed called');
      callback();
    },
    InsertHtml: (html: string) => {
      console.log('🍪 Mock OneTrust: InsertHtml called', html);
    },
    GetDomainData: () => {
      return mockOneTrust.GetDomainData();
    }
  };
  
  console.log('🔧 Mock OneTrust API initialized for development');
}

export default MockOneTrust;
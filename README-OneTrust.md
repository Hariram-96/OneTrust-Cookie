# OneTrust Cookie Consent Demo

A comprehensive demonstration of OneTrust Cookie Consent Management implementation with React, TypeScript, and Vite.

## 🍪 Features

- **Complete Landing Page**: Modern, responsive design showcasing OneTrust integration
- **Cookie Banner**: Customizable consent banner with accept/reject/customize options
- **Preference Center**: Detailed cookie category management interface
- **OneTrust Integration**: Ready-to-use OneTrust SDK integration with utilities
- **TypeScript Support**: Full type safety for cookie management
- **Responsive Design**: Mobile-first responsive design
- **Accessibility**: WCAG compliant cookie consent interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OneTrust account and domain script ID

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OneTrust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure OneTrust**
   - Update `index.html` with your OneTrust domain script ID
   - Modify `src/config/oneTrustConfig.ts` with your settings
   ```typescript
   // Replace 'your-domain-script-id-here' with your actual ID
   data-domain-script="your-actual-domain-script-id"
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 OneTrust Setup

### 1. Get Your Domain Script ID

1. Log into your [OneTrust Console](https://app.onetrust.com/)
2. Go to **Scripts** > **Cookie Consent**
3. Copy your Domain Script ID
4. Update `index.html`:

```html
<script type="text/javascript" 
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js" 
        charset="UTF-8" 
        data-domain-script="YOUR-DOMAIN-SCRIPT-ID-HERE">
</script>
```

### 2. Configure Cookie Categories

Update `src/config/oneTrustConfig.ts` to match your OneTrust console setup:

```typescript
categories: {
  necessary: { id: 'C0001', name: 'Strictly Necessary', required: true },
  performance: { id: 'C0002', name: 'Performance', required: false },
  functional: { id: 'C0003', name: 'Functional', required: false },
  targeting: { id: 'C0004', name: 'Targeting', required: false }
}
```

## 📁 Project Structure

```
src/
├── components/          # React components (if needed)
├── config/             
│   └── oneTrustConfig.ts   # OneTrust configuration
├── utils/
│   └── cookieConsent.ts    # Cookie management utilities
├── App.tsx             # Main application component
├── App.css             # Application styles
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🛠 Usage

### Getting Data with Consent

The application now includes a **Data Collection Demo** section that shows how to collect different types of data based on user consent:

1. **Performance Data** (Analytics): Page views, session duration, user interactions
2. **Functional Data** (Preferences): User settings, theme, language, notifications  
3. **Targeting Data** (Advertising): User ID tracking, campaign attribution, behavioral data

#### Real-time Demo Features:
- ✅ **Live Consent Status**: Shows which categories are currently enabled
- 📊 **Analytics Simulation**: Tracks page views and interactions when performance cookies are enabled
- ⚙️ **Preference Management**: Save user settings when functional cookies are enabled
- 🎯 **Advertising Tracking**: Simulate ad tracking when targeting cookies are enabled
- 🍪 **Cookie Visualization**: See exactly which cookies are set based on consent

### Cookie Management Utilities

```typescript
import OneTrustManager, { cookieUtils } from './utils/cookieConsent';

// Show preference center
OneTrustManager.showPreferenceCenter();

// Accept all cookies
OneTrustManager.acceptAll();

// Reject non-essential cookies
OneTrustManager.rejectAll();

// Check consent status
const hasConsent = OneTrustManager.getConsentStatus('C0002');

// Set cookies with consent checking
cookieUtils.setCookie('analytics', 'enabled', 365, 'C0002');

// Listen for consent changes
OneTrustManager.onConsentChanged((activeCategories) => {
  console.log('Active categories:', activeCategories);
});
```

### Custom Cookie Banner

The application includes a custom cookie banner that works alongside OneTrust:

- **Accept All**: Enables all cookie categories
- **Reject All**: Only enables necessary cookies
- **Customize**: Opens detailed preference center
- **Cookie Settings**: Available in navigation for returning users

## 🎨 Customization

### Styling

Modify `src/App.css` to customize the appearance:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #f8fafc;
  --border-radius: 8px;
}
```

### Content

Update the landing page content in `src/App.tsx`:

- Hero section text and buttons
- Features grid content
- About section information
- Cookie category descriptions

## 🔒 Privacy Compliance

This demo supports major privacy regulations:

- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **LGPD** (Lei Geral de Proteção de Dados)
- **PIPEDA** (Personal Information Protection and Electronic Documents Act)

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

The application is fully responsive and works on:
- iOS Safari
- Chrome Mobile
- Samsung Internet
- Other mobile browsers

## 🧪 Testing

### Local Testing

1. Start the development server
2. Open browser developer tools
3. Check console for OneTrust initialization logs
4. Test cookie banner functionality
5. Verify consent preferences are saved

### Production Testing

1. Build the application: `npm run build`
2. Serve the built files: `npm run preview`
3. Test with your actual OneTrust domain script ID

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For OneTrust-specific issues:
- [OneTrust Support Center](https://support.onetrust.com/)
- [OneTrust Developer Documentation](https://developer.onetrust.com/)

For technical issues with this demo:
- Create an issue in this repository
- Check the browser console for error messages

## 🔄 Updates

Stay updated with OneTrust SDK changes:
- Monitor [OneTrust Release Notes](https://docs.onetrust.com/release-notes/)
- Update the SDK URL in `index.html` as needed
- Test new OneTrust features with your implementation

---

**Note**: This is a demonstration application. For production use, ensure you:
- Replace placeholder domain script IDs with your actual OneTrust IDs
- Review and customize cookie categories for your specific use case
- Test thoroughly with your OneTrust console configuration
- Implement proper error handling and fallbacks
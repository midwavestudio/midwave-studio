# Google Analytics Setup for Midwave Studio

## Implementation Overview

Google Analytics has been set up to track user interactions across the Midwave Studio website.

### Key Components

1. **Base Configuration**
   - Google Analytics 4 is implemented using the official Next.js integration (`@next/third-parties/google`)
   - The Google Analytics component is added to the main app layout
   - All pageviews are automatically tracked

2. **Environment Variables**
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Used to store the Google Analytics Measurement ID

3. **Analytics Utility Module**
   - Location: `src/utils/analytics.ts`
   - Provides an easy-to-use interface for tracking custom events
   - Handles common tracking patterns with built-in methods

## Event Tracking Implementation

### Currently Tracked Interactions

- **Page Views**: Tracked on page/component mount
- **Form Submissions**: Contact form submissions and errors
- **Navigation**: All header navigation clicks (desktop and mobile)
- **User Interactions**: 
  - Menu open/close 
  - Logo clicks
  - Email/phone clicks in contact info

### Usage Examples

```typescript
// Import the analytics utility
import Analytics from '../utils/analytics';

// Track page views (inside useEffect)
useEffect(() => {
  Analytics.pageView('Contact Page');
}, []);

// Track button clicks
const handleButtonClick = () => {
  Analytics.buttonClick('submit_button', 'contact_form');
  // rest of your code
};

// Track form submissions
const handleFormSubmit = async () => {
  try {
    // form submission code
    Analytics.formSubmitted('contact_form');
  } catch (error) {
    Analytics.formError('contact_form', error.message);
  }
};

// Custom events
Analytics.custom('custom_event_name', { 
  customParam1: 'value',
  customParam2: 123
});
```

## Setup for Production

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your Measurement ID (format: G-XXXXXXXXXX)
3. Add it to your .env.local file:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
   ```
4. Add the same environment variable in your production hosting platform:
   - For Vercel: Project Settings > Environment Variables
   - For other platforms: Refer to your platform's documentation

## Testing

To verify the implementation:
1. Add your measurement ID
2. Run the site locally (`npm run dev`)
3. Open Google Analytics Real-Time reporting
4. Visit different pages and perform actions on your local site
5. Confirm events are being tracked in the Real-Time reports

## Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Third Parties Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)
- [GA4 Event Parameters Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) 
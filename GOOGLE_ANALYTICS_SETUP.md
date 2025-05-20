# Google Analytics Setup for Midwave Studio

## Setup Steps

### 1. Google Analytics Account Setup
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Create a new GA4 property for "Midwave Studio"
4. Complete the setup process to get your Measurement ID (format: G-XXXXXXXXXX)

### 2. Environment Variables Setup
Create or update the `.env.local` file in the project root with:

```
# Google Analytics Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID from Google Analytics.

### 3. Implementation Status
- The code has been set up to use Google Analytics via the official Next.js integration
- The GoogleAnalytics component has been added to the app's layout.tsx file
- All pageviews and standard analytics should be automatically tracked

### 4. Notes for Production
- Make sure to add the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable in your production deployment settings (Vercel, Netlify, etc.)
- If you're using Vercel, add this variable in your Project Settings > Environment Variables section

### 5. Testing
To verify your Google Analytics integration:
1. Run the website locally with `npm run dev`
2. Open Google Analytics Real-Time reporting
3. Visit your local website (http://localhost:4000)
4. You should see active users in the Real-Time report

### 6. Advanced Tracking
If you need custom event tracking beyond pageviews, you can use the Google Analytics Event API. Example:

```javascript
// Track custom events
import { event } from '@next/third-parties/google'

// Call this when you want to track an event
function trackButtonClick() {
  event('button_click', {
    category: 'engagement',
    label: 'contact_form_submit',
  })
}
``` 
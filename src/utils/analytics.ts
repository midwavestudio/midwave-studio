'use client';

// Replace the direct import with a conditional check
// import { event } from '@next/third-parties/google';

type EventParams = {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

/**
 * Track a custom event in Google Analytics
 * @param action - The action name (required)
 * @param params - Additional event parameters
 */
export const trackEvent = (action: string, params?: EventParams) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Safely check if the GA event function is available
    if (typeof window !== 'undefined') {
      // Use dynamic import pattern instead of direct call
      import('@next/third-parties/google').then(({ event }) => {
        if (typeof event === 'function') {
          event(action, params);
        }
      }).catch(error => {
        console.error('Error importing GA module:', error);
      });
    }
  } catch (error) {
    console.error('Error tracking GA event:', error);
  }
};

/**
 * Utility functions for common event tracking
 */
export const Analytics = {
  // Page specific events
  pageView: (pageName: string) => {
    trackEvent('page_view', { pageName });
  },
  
  // User interaction events
  buttonClick: (buttonName: string, location?: string) => {
    trackEvent('button_click', { 
      buttonName, 
      location 
    });
  },
  
  // Form events
  formSubmitted: (formName: string) => {
    trackEvent('form_submit', { formName });
  },
  
  formError: (formName: string, errorMessage: string) => {
    trackEvent('form_error', { 
      formName, 
      errorMessage 
    });
  },
  
  // Project specific events
  projectViewed: (projectId: string, projectName: string) => {
    trackEvent('project_view', { 
      projectId, 
      projectName 
    });
  },
  
  // Custom event wrapper
  custom: (action: string, params?: EventParams) => {
    trackEvent(action, params);
  }
};

export default Analytics; 
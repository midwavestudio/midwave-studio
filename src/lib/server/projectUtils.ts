import { Project } from '../firebase/projectUtils';

/**
 * Server-side project utilities
 * These utilities can be used in server components
 */

// Marketing Agency Website data for server-side use
export const marketingAgencyWebsiteData: Project = {
  id: 'default-1',
  title: 'Marketing Agency Website',
  slug: 'marketing-agency-website',
  category: 'Web Development',
  description: 'A modern website for a digital marketing agency with custom animations and responsive design.',
  thumbnailUrl: '/images/HOME (1).jpg',
  imageUrls: ['/images/HOME (1).jpg'],
  featured: true,
  client: 'XYZ Digital Agency',
  services: ['Web Design', 'Frontend Development', 'CMS Integration'],
  technologies: ['React', 'Next.js', 'Tailwind CSS'],
  order: 1
}; 
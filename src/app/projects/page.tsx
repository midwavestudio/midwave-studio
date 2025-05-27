import { Metadata } from 'next';
import Projects from '@/components/projects/Projects';
import { marketingAgencyWebsiteData } from '@/lib/server/projectUtils';

// Create server-side versions of these objects
const landDevelopmentProjectData = {
  id: 'land-development',
  title: 'Land Development',
  slug: 'land-development',
  category: 'Web Development',
  description: 'Land development project with custom features and responsive design.',
  fullDescription: 'Comprehensive land development platform that provides tools for property developers and investors.',
  client: 'Land Development Client',
  date: '2023',
  services: ['Web Design', 'Frontend Development', 'CMS Integration'],
  technologies: ['React', 'Next.js', 'Tailwind CSS'],
  thumbnailUrl: '/images/adhocthumb.png',
  imageUrls: [
    '/images/adhocthumb.png',
    '/images/adhocmt.png',
    '/images/adhocmtsmall.png',
    '/images/Desktop - 1.jpg',
    '/images/Group 1199.jpg',
    '/images/Hero Section.jpg',
    '/images/HOME (1).jpg'
  ],
  url: 'https://example.com/land-development',
  featured: true,
  order: 2
};

export const metadata: Metadata = {
  title: 'Projects | Midwave Studio',
  description: 'Explore our portfolio of premium digital experiences crafted for discerning clients across various industries.',
  openGraph: {
    title: 'Projects | Midwave Studio',
    description: 'Explore our portfolio of premium digital experiences crafted for discerning clients across various industries.',
    images: [
      {
        url: '/images/og-projects.jpg',
        width: 1200,
        height: 630,
        alt: 'Midwave Studio Projects'
      }
    ]
  }
};

export default function ProjectsPage() {
  // Include default projects directly
  const defaultProjects = [marketingAgencyWebsiteData, landDevelopmentProjectData];
  
  // Pass the default projects to the client component
  return <Projects initialProjects={defaultProjects} />;
} 
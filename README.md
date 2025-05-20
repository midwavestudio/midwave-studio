# Midwave Studio

A modern portfolio website built with Next.js, TypeScript, and Firebase.

## Features

- **Modern Design**: Clean, responsive design with smooth animations
- **Project Portfolio**: Showcase your projects with detailed information and images
- **Admin Dashboard**: Manage your projects with an easy-to-use admin interface
- **Firebase Integration**: Store project data and images in Firebase
- **Responsive**: Looks great on all devices, from mobile to desktop
- **Google Analytics**: Complete GA4 integration for tracking site usage
- **Continuous Deployment**: Automatic deployment to production for each build

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase**: Authentication, Firestore Database, and Storage
- **Framer Motion**: Animation library
- **Vercel**: Hosting and continuous deployment
- **GitHub Actions**: CI/CD pipeline

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/midwavestudio/midwave.git
   cd midwave
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-CPEJP1DN9M
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:4000](http://localhost:4000) in your browser to see the result.

## Firebase Setup

1. Visit the Firebase Init page at [http://localhost:4000/firebase-init](http://localhost:4000/firebase-init)
2. Follow the instructions to set up your Firebase project

## Deployment

### Automatic Deployment to Production

This project is configured for automatic deployment to production. Every push to the main branch will:
1. Trigger a GitHub Actions workflow
2. Build the project
3. Deploy directly to production if the build is successful

For setup instructions, see [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md)

### Manual Deployment

For manual deployment, use the Vercel button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmidwavestudio%2Fmidwave)

## Analytics

This project includes Google Analytics 4 integration. For setup instructions, see:
- [GOOGLE_ANALYTICS_SETUP.md](GOOGLE_ANALYTICS_SETUP.md)
- [ANALYTICS_SETUP.md](ANALYTICS_SETUP.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel](https://vercel.com/)
- [Google Analytics](https://analytics.google.com/)

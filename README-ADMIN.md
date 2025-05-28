# Midwave Studio Admin Interface

This document provides instructions on how to use the new admin interface for Midwave Studio. The admin interface allows you to manage your portfolio projects, including adding, editing, and deleting projects.

## Overview

The admin dashboard is accessible at `/admin` and includes the following features:

- Dashboard overview with project statistics
- Project management (list, create, edit, delete)
- Image upload and management
- Project categorization and tagging
- Featured project selection
- Data export and import functionality
- Site settings configuration

## Accessing the Admin Interface

Navigate to `/admin` in your browser. The admin interface uses client-side protection, which can be enhanced with proper authentication in a production environment.

## Using the Admin Dashboard

### Dashboard

The main dashboard displays:
- Project statistics (total projects, images, featured projects)
- Quick action buttons
- Recently updated projects

### Managing Projects

#### Viewing Projects

The Projects page (`/admin/projects`) displays all your portfolio projects in a list. You can:
- Sort projects by different criteria
- Filter projects by category
- Search for specific projects
- Toggle featured status directly from the list

#### Creating a New Project

To create a new project:
1. Click "New Project" from the dashboard or projects list
2. Fill in the project details (title, description, category, etc.)
3. Add tags to help categorize your project
4. Upload a thumbnail and project images
5. Toggle the "Featured" option if you want to highlight this project
6. Click "Create Project" to save

#### Editing a Project

To edit an existing project:
1. From the projects list, click the edit button next to the project
2. Update any fields as needed
3. Add or remove images
4. Update tags
5. Click "Update Project" to save changes

#### Deleting a Project

To delete a project:
1. From the project edit page, click the "Delete" button
2. Confirm the deletion in the prompt

### Settings

The Settings page (`/admin/settings`) allows you to configure:
- Site information (title, description)
- Portfolio display settings
- Data management options (export/import/reset)

#### Exporting and Importing Data

To backup your projects:
1. Go to Settings
2. Click "Export Data" to download a JSON file containing all your projects and settings

To restore from a backup:
1. Go to Settings
2. Click "Import Data" and select your backup JSON file

## Data Storage

The admin interface uses browser localStorage to store project data. This allows for:
- Persistent storage between sessions
- Working offline
- Easy portability

Note that localStorage has limitations:
- Limited to approximately 5MB of data
- Only available in the browser where it was created
- Cleared when browser cache/data is cleared

For production use, consider implementing a server-side storage solution.

## Customization

The admin interface is built with:
- Next.js for the framework
- Tailwind CSS for styling
- React Icons for iconography
- Client-side data management

You can customize the appearance and functionality by modifying the source code in the `/app/admin` directory.

## Support

If you encounter any issues or have questions about the admin interface, please contact the development team. 
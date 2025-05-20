# Automatic Deployment to Production Guide

This guide explains how to set up the Midwave Studio website for automatic deployment to production whenever changes are pushed to the main branch.

## Setup Overview

We've configured the project to use the following deployment pipeline:

1. Push changes to the main branch on GitHub
2. GitHub Actions automatically builds the project
3. Successful builds are automatically deployed to Vercel production

## Required Setup Steps

### 1. Vercel Setup

1. Create or log in to your [Vercel account](https://vercel.com)
2. Import your GitHub repository into Vercel
3. Complete the initial project setup in Vercel
4. Get your Vercel project details:
   - Vercel Project ID
   - Vercel Organization ID
   - Generate a Vercel API token

To get these values:
- Project ID and Org ID: Go to Project Settings > General > Project ID and Org ID
- Token: Go to your Vercel account settings > Tokens > Create new token

### 2. Add GitHub Secrets

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

1. `VERCEL_TOKEN`: Your Vercel API token
2. `VERCEL_ORG_ID`: Your Vercel Organization ID
3. `VERCEL_PROJECT_ID`: Your Vercel Project ID 
4. `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Your Google Analytics ID (G-CPEJP1DN9M)

### 3. Set Up Vercel Environment Variables

1. Go to your Vercel project settings
2. Navigate to the Environment Variables section
3. Add the following variable:
   - Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: `G-CPEJP1DN9M`
4. Set it to be available in Production, Preview, and Development

## How It Works

- The `.github/workflows/deploy.yml` file contains the GitHub Actions workflow
- The `vercel.json` file configures Vercel deployment settings
- When you push to the main branch, GitHub Actions will:
  1. Check out your code
  2. Install dependencies
  3. Build the project
  4. Deploy directly to production

## Manual Deployment

You can also trigger a manual deployment:

1. Go to your GitHub repository
2. Navigate to Actions > Deploy to Production workflow
3. Click "Run workflow" and select the branch to deploy

## Verifying Deployment

After setup, push a small change to the main branch to verify the automatic deployment pipeline works:

1. Make a minor change to a file
2. Commit and push to main
3. Check the GitHub Actions tab to monitor the workflow
4. Once complete, verify the changes on your production site 
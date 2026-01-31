# GitHub Actions CI/CD Deployment Setup

This project is configured with GitHub Actions for automated CI/CD deployment.

## Workflow Overview

The `.github/workflows/deploy.yml` file contains the CI/CD pipeline that:

1. **Triggers** on pushes to `main`/`develop` branches and PRs to `main`
2. **Tests** - Runs linting, builds the app, and runs tests
3. **Deploys** - Automatically deploys to production when pushing to `main`

## Required Secrets

Add these secrets to your GitHub repository settings:

1. **VERCEL_TOKEN**: Your Vercel API token
   - Get from: https://vercel.com/account/tokens
   - Create a new token with deployment permissions

2. **VERCEL_ORG_ID**: Your Vercel organization ID
   - Get from: `vercel link` command output or Vercel dashboard

3. **VERCEL_PROJECT_ID**: Your Vercel project ID
   - Get from: `vercel link` command output or Vercel project settings

## Setup Instructions

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add GitHub Actions CI/CD workflow"
   git push origin main
   ```

2. **Configure Vercel** (if not already done):
   ```bash
   npm install -g vercel
   vercel link
   ```

3. **Add GitHub Secrets**:
   - Go to your repository on GitHub
   - Settings → Secrets and variables → Actions
   - Add the three required secrets listed above

4. **Test the workflow**:
   - The workflow will automatically run on the next push to `main`
   - Check the Actions tab in your GitHub repository

## Workflow Details

### Test Job
- Runs on every push and PR
- Installs dependencies
- Runs linting (`npm run lint`)
- Builds the application (`npm run build`)
- Runs tests (`npm test` - continues on error if no tests exist)

### Deploy Job
- Only runs on `main` branch after successful test
- Builds the application
- Deploys to Vercel production using the provided secrets

## Alternative Deployment Options

If you prefer not to use Vercel, you can modify the `deploy.yml` file to use other deployment targets:

- **Static hosting** (Netlify, GitHub Pages): Use `next export` and upload the `out` directory
- **Docker containers**: Add Docker build and push steps
- **AWS/Google Cloud**: Use respective deployment actions

## Troubleshooting

- **Build failures**: Check the build logs in GitHub Actions
- **Permission errors**: Ensure Vercel token has proper permissions
- **Missing secrets**: Verify all required secrets are added to GitHub repository settings

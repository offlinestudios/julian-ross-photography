# GitHub Pages Deployment Guide

## Quick Start

1. **Create GitHub Repository**
   - Go to [GitHub.com](https://github.com)
   - Click "New repository"
   - Name it (e.g., "photography-portfolio")
   - Make it public
   - Don't initialize with README (we have our own)

2. **Upload Files**
   - Download/clone this project
   - Upload all files to your new repository
   - Or use Git commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
   - Click "Save"

4. **Access Your Site**
   - Your site will be available at:
   - `https://yourusername.github.io/repository-name`
   - It may take a few minutes to deploy

## Custom Domain (Optional)

1. Add a `CNAME` file to your repository root
2. Put your domain name in the file (e.g., `www.yoursite.com`)
3. Configure DNS with your domain provider
4. Update GitHub Pages settings to use custom domain

## File Structure for GitHub Pages

```
your-repository/
├── index.html          # Homepage (required)
├── about.html
├── contact.html
├── events.html
├── still-life.html
├── people.html
├── motion.html
├── assets/
│   ├── css/style.css
│   ├── js/script.js
│   └── images/
└── README.md
```

## Important Notes

- **index.html** must be in the root directory
- All file paths are relative (no leading slash)
- GitHub Pages serves static files only
- Changes may take a few minutes to appear
- Check the "Actions" tab for deployment status

## Troubleshooting

**Site not loading?**
- Check that index.html is in root directory
- Verify GitHub Pages is enabled in settings
- Wait 5-10 minutes for initial deployment

**Images not showing?**
- Check file paths in HTML
- Ensure images are in assets/images/
- Verify file extensions match (case-sensitive)

**Custom domain not working?**
- Check CNAME file content
- Verify DNS settings with domain provider
- Allow 24-48 hours for DNS propagation

## Success!

Your photography portfolio is now live on the web! 🎉

Share your URL: `https://yourusername.github.io/repository-name`


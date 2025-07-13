# Photography Portfolio Website

A modern, minimalist photography portfolio website built with pure HTML, CSS, and JavaScript. Designed for GitHub Pages deployment with professional typography and responsive design.

## Features

- **Minimal Design**: Clean, professional layout with white background and black text
- **Responsive Grid**: 3-column desktop, 2-column mobile image gallery
- **Lightbox Viewer**: Full-screen image viewing with navigation controls
- **Professional Typography**: Inter font family for commercial photography aesthetic
- **Video Support**: Ready for MP4 video integration in Motion section
- **Contact Form**: Professional contact form with project details
- **Mobile Responsive**: Optimized for all device sizes

## Pages

- **Home**: Overview gallery with mixed content from all categories
- **Events**: Event photography gallery
- **Still Life**: Product and still life photography
- **People**: Portrait and people photography
- **Motion**: Action photography with video placeholder support
- **About**: Professional bio and credentials
- **Contact**: Contact information and inquiry form

## Deployment to GitHub Pages

1. **Create a new repository** on GitHub
2. **Upload all files** from this directory to your repository
3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

Your website will be available at: `https://yourusername.github.io/repository-name`

## Customization

### Adding Your Images
1. Replace placeholder images in `assets/images/` with your photos
2. Update image paths in HTML files
3. Maintain aspect ratios for best grid layout

### Adding Videos (Motion Section)
1. Create `assets/videos/` folder
2. Add your MP4 files
3. Replace video placeholders in `motion.html`:
```html
<video autoplay muted loop playsinline>
  <source src="assets/videos/your-video.mp4" type="video/mp4">
</video>
```

### Adding Videos to Homepage Grid
To add videos to the main homepage grid:
1. Place your MP4 video files in the `assets/videos/` folder
2. Replace any gallery item in `index.html` with a video element:
```html
<div class="gallery-item" data-src="assets/videos/your-video.mp4" data-alt="Video description" data-type="video">
    <video autoplay muted loop playsinline>
        <source src="assets/videos/your-video.mp4" type="video/mp4">
    </video>
    <div class="overlay">
        <div class="zoom-icon">⊕</div>
    </div>
</div>
```
3. Videos will automatically autoplay, loop, and be muted in the grid
4. In the lightbox, videos will show with controls for user interaction

### Updating Content
- **About Page**: Edit `about.html` to include your bio and credentials
- **Contact Info**: Update contact details in `contact.html`
- **Social Links**: Update footer social media links in all HTML files

### Styling
- **Colors**: Modify CSS variables in `assets/css/style.css`
- **Typography**: Change font family in CSS file
- **Layout**: Adjust grid columns and spacing in CSS

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## File Structure

```
photography-portfolio-html/
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact page
├── events.html             # Events gallery
├── still-life.html         # Still life gallery
├── people.html             # People gallery
├── motion.html             # Motion gallery
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── script.js       # JavaScript functionality
│   └── images/
│       ├── placeholder-1.jpg
│       ├── placeholder-2.jpg
│       ├── placeholder-3.jpg
│       ├── placeholder-4.jpg
│       └── placeholder-5.jpg
└── README.md               # This file
```

## Technical Details

- **No Build Process**: Pure HTML/CSS/JS - no compilation needed
- **Lightweight**: Minimal dependencies, fast loading
- **SEO Friendly**: Semantic HTML structure
- **Accessible**: ARIA labels and keyboard navigation
- **Performance**: Optimized images and lazy loading

## License

This template is free to use for personal and commercial projects.

---

**Ready for GitHub Pages deployment!** Simply upload to your repository and enable GitHub Pages in settings.



## Adding Motion Videos

To add your own videos to the Motion section:

1. Place your MP4 video files in the `assets/videos` folder
2. Replace the video placeholder elements with actual video tags
3. Update the `data-src` path to point to your video files
4. Videos will automatically autoplay, loop, and be muted in the grid
5. In the lightbox, videos will show with controls for user interaction

**Example video element:**
```html
<video autoplay muted loop playsinline>
  <source src="assets/videos/your-video.mp4" type="video/mp4">
</video>
```

This allows you to showcase motion photography and video content seamlessly within the portfolio gallery system.


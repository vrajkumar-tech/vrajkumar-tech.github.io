# Rajkumar Venkataraman – Portfolio Website

A premium, glassmorphism-themed portfolio website built with vanilla HTML, CSS, and JavaScript. Designed with Apple-inspired aesthetics featuring frosted glass effects, smooth animations, and responsive design.

## 🎨 Design Features

- **Glassmorphism Theme**: iOS-inspired frosted glass panels with backdrop blur effects
- **Dark/Light Mode**: Smooth theme switching with system preference detection
- **Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **Micro-interactions**: Hover effects, smooth transitions, and scroll animations
- **Performance Optimized**: Lightweight, fast-loading with minimal dependencies

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with accessibility in mind
- **CSS3**: Modern CSS with custom properties, grid, and flexbox
- **Vanilla JavaScript**: No frameworks, pure JS for maximum performance
- **GitHub Pages**: Free hosting and deployment

## 📁 Project Structure

```
vrajkumar-tech.github.io/
├── assets/
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   ├── js/
│   │   └── script.js           # Interactive functionality
│   ├── img/
│   │   └── profile.jpg         # Profile image
│   ├── pdf/
│   │   └── Rajkumar_V_2023_D.pdf # CV download
│   └── icons/
│       └── favicon.ico         # Site favicon
├── index.html                  # Main HTML file
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Git installed on your local machine
- GitHub account
- Text editor (VS Code recommended)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/rkoots/vrajkumar-tech.github.io.git
   cd vrajkumar-tech.github.io
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server for better development experience:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using VS Code Live Server extension
   Right-click index.html → Open with Live Server
   ```

3. **Edit and customize**
   - Modify content directly in HTML files
   - Adjust styles in `assets/css/styles.css`
   - Add functionality in `assets/js/script.js`

## 🌐 Deployment to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. **Push to main branch**
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** tab
   - Scroll down to **GitHub Pages** section
   - Under **Build and deployment**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

3. **Access your site**
   - Your site will be available at `https://rkoots.github.io/vrajkumar-tech.github.io/`
   - (Replace `rkoots` with your GitHub username)

### Method 2: Custom Domain

1. **Set up custom domain**
   - In repository Settings → Pages, add your custom domain
   - Configure DNS records with your domain provider

2. **Update base URLs**
   - Update canonical URLs and meta tags in `index.html`
   - Update any absolute paths to use your custom domain

## 🎛️ Customization Guide

### Personal Information

Update these sections in `index.html`:

```html
<!-- Hero Section -->
<h1 class="hero-title">Your Name</h1>
<p class="hero-subtitle">Your Title</p>
<p class="hero-company">Your Company</p>
<p class="hero-location">Your Location | your.email@example.com</p>

<!-- Contact Section -->
<span>your.email@example.com</span>
<span>Your Location</span>
```

### Profile Image

1. Replace `/assets/img/profile.jpg` with your image
2. Recommended size: 400x400px or higher
3. Format: JPG, PNG, or WebP

### CV Download

1. Place your CV in `/assets/pdf/` folder
2. Update the download link in `index.html`:
   ```html
   <a href="/assets/pdf/your-cv.pdf" class="btn btn-primary" download>
       Download CV
   </a>
   ```

### Color Scheme

Modify CSS variables in `assets/css/styles.css`:

```css
:root {
  --accent: #007AFF;        /* Primary accent color */
  --accent-hover: #0056CC;  /* Hover state */
  /* Add more custom colors */
}
```

### Adding Projects

Update the projects section in `index.html`:

```html
<div class="project-card glass-card">
    <div class="project-header">
        <h3 class="project-title">Your Project</h3>
        <span class="project-status">Status</span>
    </div>
    <p class="project-description">Project description...</p>
    <div class="project-tech">
        <span class="tech-tag">Technology</span>
        <!-- Add more tags -->
    </div>
    <div class="project-actions">
        <a href="#" class="project-link">View Code</a>
    </div>
</div>
```

## 🎯 Features Explained

### Glassmorphism Effects

The glass effect is achieved using:
- `backdrop-filter: blur()` for frosted appearance
- Semi-transparent backgrounds with `rgba()`
- Subtle borders and shadows for depth

### Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: > 768px

### Performance Optimizations

- Debounced scroll events
- Throttled mouse movements
- Lazy loading for images
- Minimal external dependencies

## 🔧 Advanced Configuration

### Adding Google Analytics

Add to `<head>` section in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### SEO Optimization

The site includes:
- Meta tags for search engines
- Open Graph for social sharing
- Semantic HTML structure
- Proper heading hierarchy

### Accessibility Features

- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## 🐛 Troubleshooting

### Common Issues

**Glass effect not working:**
- Ensure browser supports `backdrop-filter`
- Check CSS prefixes for older browsers

**Images not loading:**
- Verify file paths are correct
- Check file names case sensitivity
- Ensure images are in the correct folder

**Mobile menu not working:**
- Check JavaScript console for errors
- Verify event listeners are attached

**GitHub Pages not updating:**
- Clear browser cache
- Check if files are pushed to correct branch
- Wait up to 10 minutes for GitHub Pages to build

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support (may need `-webkit-` prefixes)
- **Safari**: Full support
- **Mobile Browsers**: Optimized for iOS Safari and Chrome Mobile

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:

1. Check this README for solutions
2. Search existing GitHub Issues
3. Create a new issue with detailed information

---

**Built with ❤️ using vanilla web technologies**
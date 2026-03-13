# Headless Resume Architecture

A modern, scalable approach to managing your CV/Resume with a single data source (`cv.json`) and multiple visual templates.

## 🎯 Architecture Overview

```
cv.json                    ← Single source of truth (canonical data)
    ↓
assets/js/cv-renderer.js   ← Core rendering engine
    ↓
templates/
    ├── modern/            ← Contemporary gradient design
    ├── classic/           ← Traditional professional layout
    ├── glass/             ← Glassmorphism with blur effects
    ├── animated/          ← Dynamic with animations
    └── minimalist/        ← Clean, content-focused
```

## ✨ Key Benefits

- **Single Data Source**: Update your CV once in `cv.json`, all templates reflect changes instantly
- **Multiple Designs**: Choose different templates for different audiences/purposes
- **No Duplication**: Never copy-paste CV data across multiple files again
- **Easy Maintenance**: Add new experiences, skills, or certifications in one place
- **Template Flexibility**: Create new templates without touching data
- **Type Safety**: Structured JSON schema ensures data consistency

## 📁 Project Structure

```
vrajkumar-tech.github.io/
├── cv.json                          # Canonical CV data
├── assets/
│   └── js/
│       └── cv-renderer.js           # Core rendering engine
└── templates/
    ├── index.html                   # Template selector page
    ├── modern/
    │   └── index.html               # Modern template
    ├── classic/
    │   └── index.html               # Classic template
    ├── glass/
    │   └── index.html               # Glass morphism template
    ├── animated/
    │   └── index.html               # Animated template
    └── minimalist/
        └── index.html               # Minimalist template
```

## 🚀 Getting Started

### 1. View Templates

Open `templates/index.html` in your browser to see all available templates and choose your preferred style.

### 2. Update Your Data

Edit `cv.json` to update your CV information:

```json
{
  "personalInfo": {
    "name": {
      "first": "Your",
      "last": "Name",
      "full": "Your Full Name"
    },
    "title": "Your Professional Title",
    "email": "your.email@example.com"
  },
  "experience": [...],
  "education": [...],
  "certifications": [...]
}
```

### 3. View Changes

Refresh any template to see your updates immediately reflected.

## 📋 CV Data Schema

### Personal Information
```json
{
  "personalInfo": {
    "name": {
      "first": "string",
      "last": "string",
      "full": "string",
      "display": "string (HTML allowed)"
    },
    "title": "string",
    "tagline": "string",
    "profileImage": "string (path)",
    "location": {
      "city": "string",
      "country": "string",
      "display": "string"
    },
    "email": "string",
    "phone": "string",
    "website": "string",
    "resumeDownload": "string (path)"
  }
}
```

### Experience (Multi-Role Support)
```json
{
  "experience": [
    {
      "id": "unique-id",
      "company": {
        "name": "string",
        "logo": "string (path)",
        "website": "string"
      },
      "roles": [
        {
          "position": "string",
          "period": {
            "start": "YYYY-MM",
            "end": "YYYY-MM | present",
            "display": "string"
          },
          "summary": "string",
          "achievements": [
            {
              "title": "string",
              "description": "string"
            }
          ],
          "skills": ["string"]
        }
      ],
      "location": "string",
      "current": boolean,
      "companySummary": "string",
      "overallSkills": ["string"]
    }
  ]
}
```

### Capabilities/Skills
```json
{
  "capabilities": [
    {
      "title": "string",
      "description": "string",
      "icon": "string",
      "skills": ["string"]
    }
  ]
}
```

### Certifications
```json
{
  "certifications": [
    {
      "title": "string",
      "issuer": "string",
      "description": "string",
      "badge": "green|blue|purple|orange|teal",
      "licenseNumber": "string",
      "issueDate": "YYYY-MM",
      "expirationDate": "YYYY-MM | null",
      "verificationUrl": "string"
    }
  ]
}
```

### Education
```json
{
  "education": [
    {
      "degree": "string",
      "field": "string",
      "institution": "string",
      "period": "string",
      "type": "undergraduate|high_school|secondary",
      "description": "string"
    }
  ]
}
```

## 🎨 Available Templates

### 1. Modern Template
**Best for**: Tech professionals, creative roles, startups

**Features**:
- Gradient hero section with vibrant colors
- Interactive timeline with hover effects
- Icon-based capability cards
- Responsive grid layouts
- Modern typography (Inter font)

**Color Scheme**: Purple/Blue gradients (#6366f1, #8b5cf6)

---

### 2. Classic Template
**Best for**: Corporate roles, traditional industries, ATS systems

**Features**:
- Professional serif typography (Merriweather)
- Clean section dividers
- Print-optimized layout
- Traditional resume structure
- High readability

**Color Scheme**: Navy/Gray (#2c3e50, #34495e)

---

### 3. Glass Morphism Template
**Best for**: Design portfolios, modern tech companies, creative industries

**Features**:
- Frosted glass UI elements
- Backdrop blur effects
- Vibrant multi-color gradients
- Floating card designs
- Modern glassmorphism aesthetic

**Color Scheme**: Purple/Pink/Blue gradients with transparency

---

### 4. Animated Template
**Best for**: Interactive portfolios, tech-forward companies, creative roles

**Features**:
- Scroll-triggered animations
- Smooth transitions and hover effects
- Gradient text animations
- Pulsing elements
- Dark theme with neon accents

**Color Scheme**: Dark background (#1a1a2e) with neon accents (#ff6b6b, #4ecdc4)

---

### 5. Minimalist Template
**Best for**: Senior roles, academic positions, content-focused presentations

**Features**:
- Clean, distraction-free design
- Monospace typography (IBM Plex Mono)
- Black and white color scheme
- Content-first approach
- Print-friendly

**Color Scheme**: Black/White/Gray scale

## 🔧 How It Works

### The Rendering Engine (`cv-renderer.js`)

The `CVRenderer` class handles all data-to-HTML binding:

```javascript
class CVRenderer {
    constructor() {
        this.cvData = null;
        this.init();
    }

    async loadCVData() {
        // Loads cv.json
        const response = await fetch('/cv.json');
        this.cvData = await response.json();
    }

    renderAll() {
        // Renders all sections
        this.renderPersonalInfo();
        this.renderExperience();
        this.renderCapabilities();
        this.renderCertifications();
        this.renderEducation();
        // ... etc
    }
}
```

### Template Integration

Each template includes:

```html
<!-- Load the renderer -->
<script src="../../assets/js/cv-renderer.js"></script>

<!-- Initialize -->
<script>
    const renderer = new CVRenderer();
</script>
```

The renderer automatically:
1. Fetches `cv.json`
2. Populates all HTML elements with data
3. Updates meta tags for SEO
4. Generates structured data (JSON-LD)

## 🆕 Creating a New Template

### Step 1: Create Template Directory
```bash
mkdir templates/your-template
```

### Step 2: Create HTML File
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CV - Your Template</title>
    <!-- Your styles -->
</head>
<body>
    <!-- Your HTML structure with empty elements -->
    <h1 class="hero__title"></h1>
    <div class="timeline"></div>
    
    <!-- Load renderer -->
    <script src="../../assets/js/cv-renderer.js"></script>
    <script>
        const renderer = new CVRenderer();
    </script>
</body>
</html>
```

### Step 3: Use Standard Class Names

The renderer looks for these class names:

**Personal Info**:
- `.hero__title` - Name
- `.hero__summary` - Tagline
- `.hero__eyebrow` - Job title
- `.hero__profile-img` - Profile image

**Experience**:
- `.timeline` - Experience container
- `.timeline-item` - Individual company
- `.role-item` - Individual role

**Capabilities**:
- `.capability-grid` - Skills container
- `.capability-card` - Individual skill category

**Certifications**:
- `.cert-grid` - Certifications container
- `.cert-card` - Individual certification

**Education**:
- `.education__items` - Education container
- `.education-item` - Individual education entry

### Step 4: Add to Template Selector

Edit `templates/index.html` to add your new template card.

## 📱 Responsive Design

All templates are mobile-responsive with breakpoints at:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🖨️ Print Optimization

Templates include print-specific CSS:

```css
@media print {
    .btn,
    .hero__actions {
        display: none;
    }
    
    .section {
        page-break-inside: avoid;
    }
}
```

## 🔍 SEO & Metadata

The renderer automatically updates:
- Page title
- Meta description
- Open Graph tags
- Structured data (JSON-LD) for search engines

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "jobTitle": "Your Title",
  "email": "your@email.com",
  "knowsAbout": ["Skill 1", "Skill 2"]
}
```

## 🎯 Best Practices

### Data Management
1. **Keep cv.json clean**: Use proper JSON formatting
2. **Validate data**: Ensure all required fields are present
3. **Use consistent dates**: Format as "YYYY-MM" or "YYYY-MM-DD"
4. **Optimize images**: Keep profile images under 500KB

### Template Development
1. **Use semantic HTML**: Proper heading hierarchy (h1, h2, h3)
2. **Maintain accessibility**: ARIA labels, alt text, keyboard navigation
3. **Test responsiveness**: Check on multiple devices
4. **Optimize performance**: Minimize CSS, use system fonts when possible

### Version Control
1. **Track cv.json changes**: Commit updates with descriptive messages
2. **Tag releases**: Version your CV data (v1.0, v2.0, etc.)
3. **Backup regularly**: Keep copies of your CV data

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access at `https://username.github.io/templates/modern/`

### Custom Domain
1. Add CNAME file to repository root
2. Configure DNS settings
3. Enable HTTPS in GitHub Pages settings

### Static Hosting (Netlify, Vercel)
1. Connect repository
2. Set build command: `none` (static site)
3. Set publish directory: `/`
4. Deploy

## 🔄 Updating Your CV

### Adding New Experience
```json
{
  "experience": [
    {
      "id": "new-company",
      "company": {
        "name": "New Company",
        "logo": "/assets/img/new-company-logo.png"
      },
      "roles": [
        {
          "position": "New Position",
          "period": {
            "start": "2024-01",
            "end": "present",
            "display": "Jan 2024 – Present"
          },
          "achievements": [...]
        }
      ]
    }
  ]
}
```

### Adding New Skills
```json
{
  "capabilities": [
    {
      "title": "New Skill Category",
      "description": "Description of this skill area",
      "icon": "icon-name",
      "skills": [
        "Skill 1",
        "Skill 2",
        "Skill 3"
      ]
    }
  ]
}
```

### Adding Certifications
```json
{
  "certifications": [
    {
      "title": "New Certification",
      "issuer": "Issuing Organization",
      "description": "What this certification covers",
      "badge": "blue",
      "licenseNumber": "ABC123",
      "issueDate": "2024-01",
      "verificationUrl": "https://verify.example.com/cert"
    }
  ]
}
```

## 🐛 Troubleshooting

### Template Not Loading Data
1. Check browser console for errors
2. Verify `cv.json` path is correct
3. Ensure JSON is valid (use JSONLint)
4. Check CORS settings if loading from file://

### Images Not Displaying
1. Verify image paths in `cv.json`
2. Check image files exist in specified locations
3. Use relative paths from template location

### Styles Not Applied
1. Clear browser cache
2. Check CSS syntax errors
3. Verify class names match renderer expectations

## 📚 Advanced Customization

### Custom Rendering Logic
Extend the renderer for template-specific needs:

```javascript
const renderer = new CVRenderer();

document.addEventListener('DOMContentLoaded', () => {
    // Custom rendering after main render
    if (renderer.cvData) {
        // Your custom logic here
    }
});
```

### Dynamic Theme Switching
```javascript
const themes = {
    light: { /* colors */ },
    dark: { /* colors */ }
};

function applyTheme(theme) {
    Object.entries(themes[theme]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
    });
}
```

## 📄 License

This headless resume architecture is provided as-is for personal and commercial use.

## 🤝 Contributing

To add new templates or improve the renderer:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check existing documentation
- Review template examples
- Validate your `cv.json` structure

---

**Built with ❤️ using vanilla JavaScript and modern CSS**

No frameworks. No build tools. Just clean, maintainable code.

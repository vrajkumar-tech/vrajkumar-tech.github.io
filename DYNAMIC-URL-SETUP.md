# Dynamic URL Configuration

## Overview
This repository now supports dynamic hostname detection, allowing the site to work seamlessly with custom domains (e.g., `rajkumar.is-a.dev`) without hardcoding URLs.

## Changes Made

### 1. Sitemap Update
**File:** `sitemap.xml`
- Updated all URLs from `https://vrajkumar-tech.github.io/` to `https://rajkumar.is-a.dev/`
- This matches your CNAME configuration

### 2. Dynamic URL Handler
**File:** `assets/js/dynamic-urls.js`
- Created a reusable JavaScript module that automatically updates:
  - Canonical URLs
  - Open Graph URLs and images
  - Twitter Card images
  - Sitemap links
  - JSON-LD structured data

### 3. Updated HTML Files
The following files have been updated with dynamic URL handling:

#### Main Files
- ✅ `index.html` - Landing page with dynamic URL script
- ✅ `sitemap.xml` - Updated to use rajkumar.is-a.dev

#### Template Files
- ✅ `templates/index.html` - Template gallery
- ✅ `templates/classic/index.html` - Classic CV template
- ✅ `templates/modern/index.html` - Modern CV template

#### Remaining Templates (Need Manual Update)
The following templates still need the dynamic URL script added:
- `templates/animated/index.html`
- `templates/default/index.html`
- `templates/glass/index.html`
- `templates/minimalist/index.html`
- `templates/neon/index.html`
- `templates/gradient-flow/index.html`
- `templates/parallax/index.html`
- `templates/particle/index.html`

## How to Update Remaining Templates

### Option 1: Include the Dynamic URL Script
Add this script tag before the closing `</head>` tag:

```html
<script src="../../assets/js/dynamic-urls.js"></script>
```

### Option 2: Inline Script (Already Applied to Some Templates)
Add this script before the closing `</body>` tag:

```html
<script>
    // Dynamically set URLs based on current hostname
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    document.querySelector('link[rel="canonical"]').href = baseUrl + currentPath;
    document.querySelector('meta[property="og:url"]').content = baseUrl + currentPath;
    document.querySelector('meta[property="og:image"]').content = baseUrl + '/assets/img/profile.png';
    document.querySelector('meta[name="twitter:image"]').content = baseUrl + '/assets/img/profile.png';
</script>
```

### Option 3: Use the PowerShell Script
Run the provided script to batch update all files:

```powershell
powershell -ExecutionPolicy Bypass -File update-urls.ps1
```

## Meta Tag Updates Required

For each HTML file, update hardcoded URLs to empty strings:

### Before:
```html
<link rel="canonical" href="https://vrajkumar-tech.github.io/templates/classic/">
<meta property="og:url" content="https://vrajkumar-tech.github.io/templates/classic/">
<meta property="og:image" content="https://vrajkumar-tech.github.io/assets/img/profile.png">
<meta name="twitter:image" content="https://vrajkumar-tech.github.io/assets/img/profile.png">
```

### After:
```html
<link rel="canonical" href="">
<meta property="og:url" content="">
<meta property="og:image" content="">
<meta name="twitter:image" content="">
```

The JavaScript will populate these dynamically based on the current hostname.

## Benefits

1. **Domain Flexibility**: Works with any custom domain without code changes
2. **SEO Friendly**: Proper canonical URLs and Open Graph tags
3. **Maintenance**: Single source of truth (current hostname)
4. **Testing**: Works locally and on any deployment environment

## Testing

After deployment, verify:
1. Visit `https://rajkumar.is-a.dev/`
2. Check page source - meta tags should show `rajkumar.is-a.dev`
3. Test social sharing - images and URLs should be correct
4. Submit sitemap to Google Search Console

## Google Search Console

After updating, resubmit your sitemap:
1. Go to Google Search Console
2. Navigate to Sitemaps
3. Submit: `https://rajkumar.is-a.dev/sitemap.xml`

The sitemap errors should be resolved as all URLs now use the correct domain.

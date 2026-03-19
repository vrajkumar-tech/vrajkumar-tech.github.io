#!/usr/bin/env python3
"""
Script to update all hardcoded URLs in HTML files to use dynamic hostname detection.
This ensures the site works correctly with custom domains (e.g., rajkumar.is-a.dev).
"""

import os
import re
from pathlib import Path

def add_dynamic_url_script(html_content, file_path):
    """Add or update dynamic URL script in HTML files."""
    
    # Check if script already exists
    if 'window.location.origin' in html_content and 'baseUrl' in html_content:
        print(f"  ✓ Already has dynamic URL script: {file_path}")
        return html_content
    
    # Find the closing </head> tag
    head_close_match = re.search(r'</head>', html_content, re.IGNORECASE)
    if not head_close_match:
        print(f"  ✗ No </head> tag found: {file_path}")
        return html_content
    
    # Prepare the dynamic URL script
    dynamic_script = """
    <script>
        // Dynamically set URLs based on current hostname
        (function() {
            const baseUrl = window.location.origin;
            const currentPath = window.location.pathname;
            
            // Update canonical URL
            const canonical = document.querySelector('link[rel="canonical"]');
            if (canonical && !canonical.href) {
                canonical.href = baseUrl + currentPath;
            }
            
            // Update Open Graph URLs
            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl && !ogUrl.content) {
                ogUrl.content = baseUrl + currentPath;
            }
            
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage && !ogImage.content) {
                ogImage.content = baseUrl + '/assets/img/profile.png';
            }
            
            // Update Twitter image
            const twitterImage = document.querySelector('meta[name="twitter:image"]');
            if (twitterImage && !twitterImage.content) {
                twitterImage.content = baseUrl + '/assets/img/profile.png';
            }
            
            // Update sitemap URL
            const sitemap = document.querySelector('link[rel="sitemap"]');
            if (sitemap && !sitemap.href) {
                sitemap.href = baseUrl + '/sitemap.xml';
            }
            
            // Update structured data if present
            const structuredData = document.querySelector('script[type="application/ld+json"]');
            if (structuredData && structuredData.textContent.includes('""')) {
                try {
                    const jsonData = JSON.parse(structuredData.textContent);
                    if (jsonData.url === "") jsonData.url = baseUrl;
                    if (jsonData.image === "") jsonData.image = baseUrl + '/assets/img/profile.png';
                    structuredData.textContent = JSON.stringify(jsonData, null, 2);
                } catch (e) {
                    console.error('Error updating structured data:', e);
                }
            }
        })();
    </script>
"""
    
    # Insert before </head>
    insert_pos = head_close_match.start()
    updated_content = html_content[:insert_pos] + dynamic_script + "\n    " + html_content[insert_pos:]
    
    print(f"  ✓ Added dynamic URL script: {file_path}")
    return updated_content

def update_meta_tags(html_content):
    """Update hardcoded URLs in meta tags to empty strings for dynamic population."""
    
    # Update canonical link
    html_content = re.sub(
        r'<link rel="canonical" href="https://vrajkumar-tech\.github\.io[^"]*"',
        '<link rel="canonical" href=""',
        html_content
    )
    
    # Update Open Graph URL
    html_content = re.sub(
        r'<meta property="og:url" content="https://vrajkumar-tech\.github\.io[^"]*"',
        '<meta property="og:url" content=""',
        html_content
    )
    
    # Update Open Graph image
    html_content = re.sub(
        r'<meta property="og:image" content="https://vrajkumar-tech\.github\.io[^"]*"',
        '<meta property="og:image" content=""',
        html_content
    )
    
    # Update Twitter image
    html_content = re.sub(
        r'<meta name="twitter:image" content="https://vrajkumar-tech\.github\.io[^"]*"',
        '<meta name="twitter:image" content=""',
        html_content
    )
    
    # Update sitemap link
    html_content = re.sub(
        r'<link rel="sitemap" href="https://vrajkumar-tech\.github\.io[^"]*"',
        '<link rel="sitemap" href=""',
        html_content
    )
    
    # Update structured data URLs
    html_content = re.sub(
        r'"url":\s*"https://vrajkumar-tech\.github\.io[^"]*"',
        '"url": ""',
        html_content
    )
    html_content = re.sub(
        r'"image":\s*"https://vrajkumar-tech\.github\.io[^"]*"',
        '"image": ""',
        html_content
    )
    
    return html_content

def process_html_file(file_path):
    """Process a single HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Update meta tags
        content = update_meta_tags(content)
        
        # Add dynamic URL script
        content = add_dynamic_url_script(content, file_path)
        
        # Write back if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"  ✗ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all HTML files."""
    repo_root = Path(__file__).parent
    
    print("🔄 Updating HTML files to use dynamic URLs...\n")
    
    # Find all HTML files
    html_files = list(repo_root.rglob('*.html'))
    
    # Exclude certain directories
    exclude_patterns = ['.git', 'node_modules', 'venv', '.venv']
    html_files = [
        f for f in html_files 
        if not any(pattern in str(f) for pattern in exclude_patterns)
    ]
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    updated_count = 0
    for html_file in html_files:
        print(f"Processing: {html_file.relative_to(repo_root)}")
        if process_html_file(html_file):
            updated_count += 1
    
    print(f"\n✅ Complete! Updated {updated_count} files")
    print(f"📝 All URLs will now dynamically use the current hostname")

if __name__ == '__main__':
    main()

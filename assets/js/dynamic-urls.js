/**
 * Dynamic URL Handler
 * Automatically updates meta tags and structured data to use the current hostname
 * This ensures the site works correctly with custom domains (e.g., rajkumar.is-a.dev)
 */

(function() {
    'use strict';
    
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && (!canonical.href || canonical.href === window.location.href.split('?')[0])) {
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
    if (structuredData && structuredData.textContent.trim()) {
        try {
            const jsonData = JSON.parse(structuredData.textContent);
            
            // Update main URL if empty
            if (jsonData.url === "") {
                jsonData.url = baseUrl + currentPath;
            }
            
            // Update image if empty
            if (jsonData.image === "") {
                jsonData.image = baseUrl + '/assets/img/profile.png';
            }
            
            // Update isPartOf URL if present and empty
            if (jsonData.isPartOf && jsonData.isPartOf.url === "") {
                jsonData.isPartOf.url = baseUrl;
            }
            
            structuredData.textContent = JSON.stringify(jsonData, null, 2);
        } catch (e) {
            console.error('Error updating structured data:', e);
        }
    }
    
    console.log('✓ Dynamic URLs initialized for:', baseUrl);
})();

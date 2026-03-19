# PowerShell script to update all HTML files with dynamic URL handling

$files = Get-ChildItem -Path . -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch '\\\.git\\' }

Write-Host "Found $($files.Count) HTML files to process`n" -ForegroundColor Cyan

$updatedCount = 0

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Replace hardcoded URLs with empty strings for dynamic population
    $content = $content -replace 'href="https://vrajkumar-tech\.github\.io/[^"]*"', 'href=""'
    $content = $content -replace 'content="https://vrajkumar-tech\.github\.io/[^"]*"', 'content=""'
    $content = $content -replace '"url":\s*"https://vrajkumar-tech\.github\.io[^"]*"', '"url": ""'
    $content = $content -replace '"image":\s*"https://vrajkumar-tech\.github\.io[^"]*"', '"image": ""'
    
    # Check if dynamic script already exists
    if ($content -notmatch 'window\.location\.origin' -and $content -match '</head>') {
        $dynamicScript = @"

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
            if (structuredData) {
                try {
                    const jsonData = JSON.parse(structuredData.textContent);
                    if (jsonData.url === "") jsonData.url = baseUrl + currentPath;
                    if (jsonData.image === "") jsonData.image = baseUrl + '/assets/img/profile.png';
                    if (jsonData.isPartOf && jsonData.isPartOf.url === "") {
                        jsonData.isPartOf.url = baseUrl;
                    }
                    structuredData.textContent = JSON.stringify(jsonData, null, 2);
                } catch (e) {
                    console.error('Error updating structured data:', e);
                }
            }
        })();
    </script>
"@
        $content = $content -replace '</head>', "$dynamicScript`n</head>"
        Write-Host "  Added dynamic URL script" -ForegroundColor Green
    }
    
    # Write back if changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $updatedCount++
        Write-Host "  Updated!" -ForegroundColor Green
    } else {
        Write-Host "  No changes needed" -ForegroundColor Gray
    }
}

Write-Host "`n==> Complete! Updated $updatedCount files" -ForegroundColor Green
Write-Host "==> All URLs will now dynamically use the current hostname" -ForegroundColor Cyan

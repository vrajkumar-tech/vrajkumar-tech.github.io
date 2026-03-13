/**
 * CV Renderer - Headless Resume Architecture
 * Renders CV data from JSON into HTML templates
 * Supports multiple roles per company and enhanced data structure
 */

class CVRenderer {
    constructor() {
        this.cvData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadCVData();
            this.renderAll();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize CV renderer:', error);
            // Display error message on page
            document.body.innerHTML = `
                <div style="padding: 2rem; font-family: Arial, sans-serif;">
                    <h1>Error Loading CV Data</h1>
                    <p>Could not load cv.json file. Please check the file exists and the path is correct.</p>
                    <p>Error: ${error.message}</p>
                    <p>Path attempted: ${window.location.pathname.includes('/templates/') ? 'relative path' : '/cv.json'}</p>
                </div>
            `;
        }
    }

    async loadCVData() {
        // Use inline data if available, otherwise fetch from file
        if (window.cvData) {
            this.cvData = window.cvData;
            return;
        }
        
        // Try multiple paths to find cv.json
        const possiblePaths = [
            '../../cv.json',  // For templates/*/index.html
            '../cv.json',     // For templates/index.html
            '/cv.json',       // For root level
            './cv.json'       // Current directory
        ];
        
        console.log('Current location:', window.location.href);
        console.log('Current pathname:', window.location.pathname);
        
        let lastError = null;
        
        for (const cvPath of possiblePaths) {
            try {
                console.log('Trying to load CV data from:', cvPath);
                const response = await fetch(cvPath);
                
                if (response.ok) {
                    this.cvData = await response.json();
                    console.log('✓ CV data loaded successfully from:', cvPath);
                    return;
                }
                
                console.log('✗ Failed to load from', cvPath, '- Status:', response.status);
                lastError = new Error(`HTTP ${response.status} from ${cvPath}`);
            } catch (error) {
                console.log('✗ Error loading from', cvPath, ':', error.message);
                lastError = error;
            }
        }
        
        throw new Error(`Could not load cv.json from any path. Last error: ${lastError?.message}`);
    }

    renderAll() {
        this.renderMeta();
        this.renderPersonalInfo();
        this.renderSocialLinks();
        this.renderStats();
        this.renderAbout();
        this.renderExperience();
        this.renderCapabilities();
        this.renderCertifications();
        this.renderEducation();
        this.renderInsights();
        this.renderContact();
        this.renderFooter();
        
        // Template-specific rendering
        if (this.isClassicTemplate()) {
            this.renderClassicTemplate();
        }
    }

    renderMeta() {
        // Update page meta tags
        document.title = this.cvData.seo?.title || 'Rajkumar Venkataraman - CV';
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && this.cvData.seo?.description) {
            metaDescription.content = this.cvData.seo.description;
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = this.cvData.seo?.title || '';

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.content = this.cvData.seo?.description || '';

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.content = this.cvData.seo?.image || '';

        // Update structured data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": this.cvData.personalInfo?.name?.full || '',
            "jobTitle": this.cvData.personalInfo?.title || '',
            "email": this.cvData.personalInfo?.email || '',
            "url": this.cvData.personalInfo?.website || '',
            "sameAs": this.cvData.socialLinks?.map(link => link.url) || [],
            "knowsAbout": this.cvData.capabilities?.flatMap(cap => cap.skills) || []
        };

        const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
        if (structuredDataScript) {
            structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
        }
    }

    renderPersonalInfo() {
        const personalInfo = this.cvData.personalInfo;
        
        // Hero section
        const heroTitle = document.querySelector('.hero__title');
        if (heroTitle && personalInfo?.name?.display) {
            heroTitle.innerHTML = personalInfo.name.display;
        }

        const heroSummary = document.querySelector('.hero__summary');
        if (heroSummary && personalInfo?.tagline) {
            heroSummary.textContent = personalInfo.tagline;
        }

        const heroEyebrow = document.querySelector('.hero__eyebrow');
        if (heroEyebrow && personalInfo?.title) {
            heroEyebrow.textContent = personalInfo.title;
        }

        const profileImg = document.querySelector('.hero__profile-img');
        if (profileImg && personalInfo?.profileImage) {
            profileImg.src = personalInfo.profileImage;
            profileImg.alt = personalInfo.name?.full || 'Profile';
        }

        const downloadBtn = document.querySelector('.hero__actions .btn--primary');
        if (downloadBtn && personalInfo?.resumeDownload) {
            downloadBtn.href = personalInfo.resumeDownload;
        }

        // CV page specific elements
        const homeName = document.querySelector('.home__name');
        if (homeName && personalInfo?.name?.full) {
            homeName.textContent = personalInfo.name.full;
        }

        const homeEducation = document.querySelector('.home__education');
        if (homeEducation && personalInfo?.title && personalInfo?.location?.display) {
            homeEducation.innerHTML = `${personalInfo.title}<br/>ADF Data Science Private Limited<br/>${personalInfo.location.display} | ${personalInfo.email}`;
        }

        const homeProfileImg = document.querySelector('.home__img');
        if (homeProfileImg && personalInfo?.profileImage) {
            homeProfileImg.src = personalInfo.profileImage;
            homeProfileImg.alt = personalInfo.name?.full || 'Profile';
        }
    }

    renderSocialLinks() {
        const socialLinks = this.cvData.socialLinks;
        
        // Hero socials
        const heroSocials = document.querySelector('.hero__socials');
        if (heroSocials && socialLinks) {
            heroSocials.innerHTML = socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="hero__social-link" aria-label="${link.platform}">
                    <span class="hero__social-text">${link.display}</span>
                </a>
            `).join('');
        }

        // Home socials
        const homeSocials = document.querySelector('.home__social');
        if (homeSocials && socialLinks) {
            homeSocials.innerHTML = socialLinks.map(link => {
                const iconClass = this.getIconClass(link.platform);
                return `
                    <a href="${link.url}" target="_blank" class="home__social-link">
                        <i class='${iconClass}'></i>
                    </a>
                `;
            }).join('');
        }

        // Footer socials
        const footerSocials = document.querySelector('.footer__socials');
        if (footerSocials && socialLinks) {
            footerSocials.innerHTML = socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="${link.platform}">
                    ${link.display}
                </a>
            `).join('');
        }
    }

    renderStats() {
        const stats = this.cvData.stats;
        const heroStats = document.querySelector('.hero__stats');
        
        if (heroStats && stats) {
            heroStats.innerHTML = stats.map(stat => `
                <div class="hero__stat">
                    <div class="hero__stat-value">${stat.value}</div>
                    <div class="hero__stat-label">${stat.label}</div>
                </div>
            `).join('');
        }

        // About stats (CV page)
        const aboutStats = document.querySelectorAll('.about__subtitle');
        if (aboutStats.length >= 3 && stats) {
            aboutStats[0].innerHTML = `<b>${stats[0]?.value || '15+'}</b> Years`;
            aboutStats[1].textContent = stats[3]?.value || '5+ Teams';
            aboutStats[2].textContent = stats[2]?.value || '10+ Products';
        }
    }

    renderAbout() {
        const about = this.cvData.about;
        
        // Section headers
        const aboutEyebrow = document.querySelector('#about .section__eyebrow');
        if (aboutEyebrow && about?.eyebrow) {
            aboutEyebrow.textContent = about.eyebrow;
        }

        const aboutTitle = document.querySelector('#about .section__title');
        if (aboutTitle && about?.title) {
            aboutTitle.innerHTML = about.title;
        }

        // About narrative
        const aboutNarrative = document.querySelector('.about__narrative');
        if (aboutNarrative && about?.narrative) {
            aboutNarrative.innerHTML = about.narrative.map(paragraph => `
                <p class="about__paragraph">${paragraph}</p>
            `).join('');
        }

        // About highlights
        const aboutHighlights = document.querySelector('.about__highlights');
        if (aboutHighlights && about?.highlights) {
            aboutHighlights.innerHTML = about.highlights.map(highlight => `
                <div class="about__highlight">
                    <div class="about__highlight-icon">
                        <i class="icon icon--${highlight.icon}" aria-hidden="true"></i>
                    </div>
                    <div class="about__highlight-content">
                        <h3 class="about__highlight-title">${highlight.title}</h3>
                        <p class="about__highlight-description">${highlight.description}</p>
                    </div>
                </div>
            `).join('');
        }

        // About description (CV page)
        const aboutDescription = document.querySelector('.about__description');
        if (aboutDescription && about?.narrative?.[0]) {
            aboutDescription.textContent = about.narrative[0];
        }
    }

    renderExperience() {
        const experience = this.cvData.experience;
        const timeline = document.querySelector('.timeline');
        
        if (timeline && experience) {
            timeline.innerHTML = experience.map(company => this.renderCompany(company)).join('');
        }

        // CV page experience
        const expireanceContainer = document.querySelector('.expireance__container');
        if (expireanceContainer && experience) {
            expireanceContainer.innerHTML = `
                <div class="">
                    ${experience.map(company => this.renderCompanyCard(company)).join('')}
                </div>
            `;
        }
    }

    renderCompany(company) {
        const roles = company.roles || [this.createSingleRole(company)];
        
        return `
            <div class="timeline-item ${company.current ? 'timeline-item--current' : ''}">
                <div class="timeline-item__header">
                    <div class="timeline-item__company">
                        <img src="${company.company.logo}" alt="${company.company.name}" class="timeline-item__logo">
                        <div class="timeline-item__company-info">
                            <h3 class="timeline-item__company-name">${company.company.name}</h3>
                            <p class="timeline-item__period">${company.roles?.[0]?.period?.display || company.period?.display}</p>
                            <p class="timeline-item__location">${company.location || ''}</p>
                        </div>
                    </div>
                </div>
                <div class="timeline-item__content">
                    ${company.companySummary ? `<p class="timeline-item__summary">${company.companySummary}</p>` : ''}
                    <div class="timeline-item__roles">
                        ${roles.map(role => this.renderRole(role)).join('')}
                    </div>
                    ${company.overallSkills ? `
                        <div class="timeline-item__skills">
                            <h4>Key Skills</h4>
                            <div class="skill-tags">
                                ${company.overallSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderRole(role) {
        return `
            <div class="role-item">
                <h4 class="role-item__position">${role.position}</h4>
                <p class="role-item__period">${role.period?.display || ''}</p>
                ${role.summary ? `<p class="role-item__summary">${role.summary}</p>` : ''}
                ${role.achievements ? `
                    <ul class="role-item__achievements">
                        ${role.achievements.map(achievement => `
                            <li>
                                <strong>${achievement.title}</strong> ${achievement.description}
                            </li>
                        `).join('')}
                    </ul>
                ` : ''}
                ${role.skills ? `
                    <div class="role-item__skills">
                        ${role.skills.map(skill => `<span class="skill-tag skill-tag--small">${skill}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderCompanyCard(company) {
        const roles = company.roles || [this.createSingleRole(company)];
        
        return `
            <div class="testimonial__card swiper-slide ${company.current ? 'testimonial__bg' : ''}">
                <img src="${company.company.logo}" alt="${company.company.name}" class="testimonial__img">
                <h2 class="">${company.company.name} | ${roles[roles.length - 1]?.period?.start || company.period?.start} - ${company.current ? 'Present' : roles[0]?.period?.end || company.period?.end}</h2><br/>
                <div>
                    ${roles.map(role => `
                        <h3 class="testimonial__name">${role.position} | ${role.period?.display}</h3>
                        <ul>
                            ${role.achievements?.map(achievement => `
                                <li>► ${achievement.description}</li>
                            `).join('') || ''}
                        </ul><br/>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createSingleRole(company) {
        return {
            position: company.position,
            period: company.period,
            summary: company.summary,
            achievements: company.achievements,
            skills: company.skills
        };
    }

    renderCapabilities() {
        const capabilities = this.cvData.capabilities;
        const capabilityGrid = document.querySelector('.capability-grid');
        
        if (capabilityGrid && capabilities) {
            capabilityGrid.innerHTML = capabilities.map(capability => `
                <div class="capability-card">
                    <div class="capability-card__header">
                        <div class="capability-card__icon">
                            <i class="icon icon--${capability.icon}" aria-hidden="true"></i>
                        </div>
                        <h3 class="capability-card__title">${capability.title}</h3>
                    </div>
                    <p class="capability-card__description">${capability.description}</p>
                    <div class="capability-card__skills">
                        ${capability.skills.map(skill => `
                            <div class="capability-skill">
                                <span class="capability-skill__name">${skill}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }

    renderCertifications() {
        const certifications = this.cvData.certifications;
        const certGrid = document.querySelector('.cert-grid');
        
        if (certGrid && certifications) {
            certGrid.innerHTML = certifications.map(cert => `
                <div class="cert-card">
                    <div class="cert-card__header">
                        <div class="cert-card__badge cert-card__badge--${cert.badge}">
                            <i class="icon icon--certificate" aria-hidden="true"></i>
                        </div>
                        <div class="cert-card__info">
                            <h3 class="cert-card__title">${cert.title}</h3>
                            <p class="cert-card__issuer">${cert.issuer}</p>
                        </div>
                    </div>
                    <p class="cert-card__description">${cert.description}</p>
                    ${cert.verificationUrl ? `
                        <a href="${cert.verificationUrl}" target="_blank" rel="noopener noreferrer" class="cert-card__verification">
                            Verify Certificate
                        </a>
                    ` : ''}
                </div>
            `).join('');
        }

        // CV page services (certifications)
        const servicesContainer = document.querySelector('.services__container');
        if (servicesContainer && certifications) {
            servicesContainer.innerHTML = certifications.map(cert => this.renderServiceCard(cert)).join('');
        }
    }

    renderServiceCard(cert) {
        return `
            <div class="services__card">
                <div class="serv">
                    <h3 class="services__title">${cert.title} <br> ${cert.issuer}</h3>
                    <span class="services__button">
                        See More <i class='bx bx-right-arrow services__icon'></i>
                    </span>
                </div>
                <div class="services__modal">
                    <div class="services__modal-content">
                        <i class='bx bx-x services__modal-close'></i>
                        <h3 class="services__modal-title">${cert.title}</h3>
                        <p class="services__modal-description">${cert.description}</p>
                        <ul class="services__modal-list">
                            ${cert.licenseNumber ? `
                                <li class="services__modal-item">
                                    <i class='bx bx-check-circle'></i>
                                    <p class="services__modal-info">
                                        License/Registration: ${cert.licenseNumber}
                                    </p>
                                </li>
                            ` : ''}
                            <li class="services__modal-item">
                                <i class='bx bx-check-circle'></i>
                                <p class="services__modal-info">
                                    Issued By: ${cert.issuer}
                                </p>
                            </li>
                            <li class="services__modal-item">
                                <i class='bx bx-check-circle'></i>
                                <p class="services__modal-info">
                                    Issue Date: ${cert.issueDate} — ${cert.expirationDate || 'No Expiration'}
                                </p>
                            </li>
                            ${cert.verificationUrl ? `
                                <li class="services__modal-item">
                                    <i class='bx bx-check-circle'></i>
                                    <a class="services__modal-info" target="_blank" href="${cert.verificationUrl}">
                                        Link to Certificate
                                    </a>
                                </li>
                            ` : ''}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    renderEducation() {
        const education = this.cvData.education;
        const educationItems = document.querySelector('.education__items');
        
        if (educationItems && education) {
            educationItems.innerHTML = education.map(edu => `
                <div class="education-item">
                    <div class="education-item__header">
                        <h3 class="education-item__degree">${edu.degree}</h3>
                        <p class="education-item__period">${edu.period}</p>
                    </div>
                    <p class="education-item__field">${edu.field}</p>
                    <p class="education-item__institution">${edu.institution}</p>
                    ${edu.description ? `<p class="education-item__description">${edu.description}</p>` : ''}
                </div>
            `).join('');
        }

        // CV page skills (education section)
        const skillsContent = document.querySelector('.skills__content');
        if (skillsContent && education) {
            const educationGroup = skillsContent.querySelector('.skills__group');
            if (educationGroup) {
                educationGroup.innerHTML = education.map(edu => `
                    <div class="skills__data">
                        <i class='bx bxs-badge-check'></i>
                        <div>
                            <h3 class="skills__name">${edu.degree}</h3>
                            <span class="skills__level">${edu.period}</span>
                            <span class="skills__level">${edu.description || edu.institution}</span>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    renderInsights() {
        const insights = this.cvData.insights;
        const blogGrid = document.querySelector('.blog-grid');
        
        if (blogGrid && insights) {
            blogGrid.innerHTML = insights.map(insight => `
                <article class="blog-card">
                    <div class="blog-card__header">
                        <div class="blog-card__badge blog-card__badge--${insight.badge}">
                            ${insight.category}
                        </div>
                    </div>
                    <h3 class="blog-card__title">${insight.title}</h3>
                    <p class="blog-card__description">${insight.description}</p>
                    <a href="${insight.url}" target="_blank" rel="noopener noreferrer" class="blog-card__link">
                        Read More
                        <i class="icon icon--arrow-right" aria-hidden="true"></i>
                    </a>
                </article>
            `).join('');
        }
    }

    renderContact() {
        const contact = this.cvData.contact;
        
        // Section headers
        const contactEyebrow = document.querySelector('#contact .section__eyebrow');
        if (contactEyebrow && contact?.eyebrow) {
            contactEyebrow.textContent = contact.eyebrow;
        }

        const contactTitle = document.querySelector('#contact .section__title');
        if (contactTitle && contact?.title) {
            contactTitle.textContent = contact.title;
        }

        const contactSubtitle = document.querySelector('#contact .section__subtitle');
        if (contactSubtitle && contact?.subtitle) {
            contactSubtitle.textContent = contact.subtitle;
        }

        // Contact details
        const contactDetails = document.querySelector('.contact__details');
        if (contactDetails && this.cvData.personalInfo) {
            contactDetails.innerHTML = `
                <div class="contact-detail">
                    <i class="icon icon--email" aria-hidden="true"></i>
                    <a href="mailto:${this.cvData.personalInfo.email}">${this.cvData.personalInfo.email}</a>
                </div>
                ${this.cvData.personalInfo.phone ? `
                    <div class="contact-detail">
                        <i class="icon icon--phone" aria-hidden="true"></i>
                        <a href="tel:${this.cvData.personalInfo.phone}">${this.cvData.personalInfo.phone}</a>
                    </div>
                ` : ''}
                ${this.cvData.personalInfo.website ? `
                    <div class="contact-detail">
                        <i class="icon icon--globe" aria-hidden="true"></i>
                        <a href="${this.cvData.personalInfo.website}" target="_blank" rel="noopener noreferrer">
                            ${this.cvData.personalInfo.website}
                        </a>
                    </div>
                ` : ''}
                ${this.cvData.personalInfo.location?.display ? `
                    <div class="contact-detail">
                        <i class="icon icon--location" aria-hidden="true"></i>
                        <span>${this.cvData.personalInfo.location.display}</span>
                    </div>
                ` : ''}
            `;
        }

        // Contact quote
        const contactQuote = document.querySelector('.contact__quote');
        if (contactQuote && contact?.quote) {
            contactQuote.textContent = contact.quote;
        }

        // Contact availability
        const availabilityText = document.querySelector('.contact__availability span:last-child');
        if (availabilityText && contact?.availability) {
            availabilityText.textContent = contact.availability;
        }

        // Contact form
        const contactForm = document.querySelector('#contact-form');
        if (contactForm && contact?.form?.fields) {
            contactForm.innerHTML = `
                <div class="form__row">
                    ${contact.form.fields.map(field => this.renderFormField(field)).join('')}
                </div>
                <button type="submit" class="btn btn--primary">Send Message</button>
            `;
        }
    }

    renderFormField(field) {
        const fieldHtml = `
            <div class="form__group">
                <label for="${field.name}" class="form__label">${field.label}</label>
        `;

        if (field.type === 'textarea') {
            return fieldHtml + `
                    <textarea 
                        id="${field.name}" 
                        name="${field.name}" 
                        class="form__input" 
                        placeholder="${field.placeholder}"
                        rows="${field.rows || 4}"
                        ${field.required ? 'required' : ''}
                    ></textarea>
                </div>
            `;
        } else if (field.type === 'select') {
            return fieldHtml + `
                    <select id="${field.name}" name="${field.name}" class="form__select">
                        ${field.options?.map(option => `
                            <option value="${option.value}">${option.text}</option>
                        `).join('')}
                    </select>
                </div>
            `;
        } else {
            return fieldHtml + `
                    <input 
                        type="${field.type}" 
                        id="${field.name}" 
                        name="${field.name}" 
                        class="form__input" 
                        placeholder="${field.placeholder}"
                        autocomplete="${field.autocomplete || ''}"
                        ${field.required ? 'required' : ''}
                    >
                </div>
            `;
        }
    }

    renderFooter() {
        const personalInfo = this.cvData.personalInfo;
        
        const footerLogo = document.querySelector('.footer__logo');
        if (footerLogo && personalInfo?.name?.full) {
            footerLogo.textContent = personalInfo.name.full;
        }

        const footerTagline = document.querySelector('.footer__tagline');
        if (footerTagline && personalInfo?.title) {
            footerTagline.textContent = personalInfo.title;
        }

        // Update current year
        const currentYear = document.getElementById('current-year');
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }

    // Template-specific rendering methods
    isClassicTemplate() {
        return document.querySelector('.template-classic') || document.querySelector('.header__img');
    }

    renderClassicTemplate() {
        this.renderClassicHeader();
        this.renderClassicExperience();
        this.renderClassicSkills();
        this.renderClassicEducation();
        this.renderClassicCertifications();
        this.renderClassicContact();
        this.renderClassicFooter();
    }

    renderClassicHeader() {
        const personalInfo = this.cvData.personalInfo;
        
        const headerImg = document.querySelector('.header__img');
        if (headerImg && personalInfo?.profileImage) {
            headerImg.src = personalInfo.profileImage;
            headerImg.alt = personalInfo.name?.full || 'Profile';
        }

        const headerName = document.querySelector('.header__name');
        if (headerName && personalInfo?.name?.full) {
            headerName.textContent = personalInfo.name.full;
        }

        const title = document.querySelector('.title');
        if (title && personalInfo?.title) {
            title.textContent = personalInfo.title;
        }

        const tagline = document.querySelector('.tagline');
        if (tagline && personalInfo?.tagline) {
            tagline.textContent = personalInfo.tagline;
        }

        const downloadBtn = document.querySelector('.header__contact .btn');
        if (downloadBtn && personalInfo?.resumeDownload) {
            downloadBtn.href = personalInfo.resumeDownload;
        }
    }

    renderClassicExperience() {
        const experience = this.cvData.experience;
        const container = document.getElementById('experience-container');
        
        if (container && experience) {
            container.innerHTML = experience.map(company => this.renderClassicCompany(company)).join('');
        }
    }

    renderClassicCompany(company) {
        const roles = company.roles || [this.createSingleRole(company)];
        
        return `
            <div class="experience-item">
                <div class="experience-header">
                    <div class="experience-company">
                        <img src="${company.company.logo}" alt="${company.company.name}" class="experience-logo">
                        <div class="experience-info">
                            <h3>${company.company.name}</h3>
                            <div class="period">${roles[roles.length - 1]?.period?.start || company.period?.start} - ${company.current ? 'Present' : roles[0]?.period?.end || company.period?.end}</div>
                        </div>
                    </div>
                </div>
                ${roles.map(role => `
                    <div class="role-item">
                        <h4>${role.position}</h4>
                        <div class="role-period">${role.period?.display}</div>
                        ${role.achievements ? `
                            <ul>
                                ${role.achievements.map(achievement => `
                                    <li>${achievement.description}</li>
                                `).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderClassicSkills() {
        const capabilities = this.cvData.capabilities;
        const skillsGrid = document.querySelector('.skills-grid');
        
        if (skillsGrid && capabilities) {
            skillsGrid.innerHTML = capabilities.map(capability => `
                <div class="skill-category">
                    <h3>${capability.title}</h3>
                    <ul class="skill-list">
                        ${capability.skills.map(skill => `
                            <li>${skill}</li>
                        `).join('')}
                    </ul>
                </div>
            `).join('');
        }
    }

    renderClassicEducation() {
        const education = this.cvData.education;
        const container = document.getElementById('education-container');
        
        if (container && education) {
            container.innerHTML = education.map(edu => `
                <div class="edu-item">
                    <h4>${edu.degree}</h4>
                    <div class="period">${edu.period}</div>
                    <p><strong>${edu.field}</strong></p>
                    <p>${edu.institution}</p>
                </div>
            `).join('');
        }
    }

    renderClassicCertifications() {
        const certifications = this.cvData.certifications;
        const container = document.getElementById('certifications-container');
        
        if (container && certifications) {
            container.innerHTML = certifications.map(cert => `
                <div class="cert-item">
                    <h4>${cert.title}</h4>
                    <div class="period">${cert.issueDate} - ${cert.expirationDate || 'No Expiration'}</div>
                    <p><strong>${cert.issuer}</strong></p>
                    <p>${cert.description}</p>
                    ${cert.verificationUrl ? `
                        <a href="${cert.verificationUrl}" target="_blank" style="color: #3498db;">Verify Certificate</a>
                    ` : ''}
                </div>
            `).join('');
        }
    }

    renderClassicContact() {
        const contact = this.cvData.contact;
        const personalInfo = this.cvData.personalInfo;
        const contactInfo = document.querySelector('.contact-info');
        
        if (contactInfo && personalInfo) {
            contactInfo.innerHTML = `
                ${personalInfo.email ? `
                    <div class="contact-item">
                        <span>📧</span>
                        <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
                    </div>
                ` : ''}
                ${personalInfo.phone ? `
                    <div class="contact-item">
                        <span>📱</span>
                        <a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>
                    </div>
                ` : ''}
                ${personalInfo.website ? `
                    <div class="contact-item">
                        <span>🌐</span>
                        <a href="${personalInfo.website}" target="_blank">${personalInfo.website}</a>
                    </div>
                ` : ''}
                ${personalInfo.location?.display ? `
                    <div class="contact-item">
                        <span>📍</span>
                        <span>${personalInfo.location.display}</span>
                    </div>
                ` : ''}
            `;
        }

        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm && contact?.form?.fields) {
            contactForm.innerHTML = contact.form.fields.map(field => this.renderClassicFormField(field)).join('') + 
                '<button type="submit" class="btn">Send Message</button>';
        }
    }

    renderClassicFormField(field) {
        if (field.type === 'textarea') {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}</label>
                    <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder}" rows="${field.rows || 4}" ${field.required ? 'required' : ''}></textarea>
                </div>
            `;
        } else if (field.type === 'select') {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}</label>
                    <select id="${field.name}" name="${field.name}">
                        ${field.options?.map(option => `
                            <option value="${option.value}">${option.text}</option>
                        `).join('')}
                    </select>
                </div>
            `;
        } else {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}</label>
                    <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
                </div>
            `;
        }
    }

    renderClassicFooter() {
        const personalInfo = this.cvData.personalInfo;
        
        const footerName = document.querySelector('.footer__name');
        if (footerName && personalInfo?.name?.full) {
            footerName.textContent = personalInfo.name.full;
        }

        const footerLinks = document.querySelector('.footer__links');
        if (footerLinks && this.cvData.socialLinks) {
            footerLinks.innerHTML = this.cvData.socialLinks.map(link => `
                <a href="${link.url}" target="_blank">${link.platform}</a>
            `).join('');
        }

        // Update current year
        const currentYear = document.getElementById('current-year');
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }

    getIconClass(platform) {
        const iconMap = {
            'linkedin': 'bx bxl-linkedin',
            'github': 'bx bxl-github',
            'twitter': 'bx bxl-twitter',
            'devto': 'bx bxl-dev-to',
            'dribbble': 'bx bxl-dribbble'
        };
        return iconMap[platform] || 'bx bx-link';
    }

    setupEventListeners() {
        // Service modal functionality (CV page)
        const modalBtns = document.querySelectorAll('.services__button');
        const modalCloses = document.querySelectorAll('.services__modal-close');
        const modals = document.querySelectorAll('.services__modal');

        modalBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                modals[index]?.classList.add('active-modal');
            });
        });

        modalCloses.forEach(close => {
            close.addEventListener('click', () => {
                modals.forEach(modal => {
                    modal.classList.remove('active-modal');
                });
            });
        });

        // Contact form submission
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle form submission here
                console.log('Form submitted:', Object.fromEntries(new FormData(contactForm)));
            });
        }
    }
}

// Initialize CV renderer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CVRenderer();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CVRenderer;
}

/**
 * OceanAid360 Website Scripts
 * Main JavaScript file for all pages
 * Updated for multi-page architecture and modular header/footer
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if using modular header/footer approach
    const isModular = document.getElementById('header-container') !== null || 
                       document.getElementById('footer-container') !== null;
                       
    // If not using modular approach, initialize elements directly
    if (!isModular) {
        // Add active class to current page in navigation
        highlightCurrentPage();
        
        // Initialize mobile navigation toggle
        initMobileNav();
    }
    
    // Initialize any sliders on the page
    initSliders();
    
    // Initialize form validation if contact form exists
    if (document.querySelector('.contact-form')) {
        initFormValidation();
    }
    
    // Handle smooth scrolling for anchor links
    initSmoothScroll();
    
    // Load modular components if using that approach
    if (isModular) {
        loadModularComponents();
    }
});

/**
 * Loads the header and footer components and initializes their functionality
 * This is the new function for modular implementation
 */
function loadModularComponents() {
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
    
    // Check if jQuery is available
    if (typeof jQuery === 'undefined') {
        console.error('jQuery is required for modular components. Please include jQuery in your page.');
        return;
    }
    
    // Generate cache-busting parameter
    const cacheBuster = "?v=" + new Date().getTime();
    
    // Load header if container exists
    if (headerContainer) {
        jQuery(headerContainer).load('header.html' + cacheBuster, function() {
            // Initialize header functionality after loading
            highlightCurrentPage();
            initMobileNav();
        });
    }
    
    // Load footer if container exists
    if (footerContainer) {
        jQuery(footerContainer).load('footer.html' + cacheBuster, function() {
            // Initialize any footer-specific functionality if needed
            initFooterFunctionality();
        });
    }
}

/**
 * Initialize any footer-specific functionality
 * New function for the modular approach
 */
function initFooterFunctionality() {
    // Initialize newsletter form if it exists
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your newsletter submission logic here
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
    
    // Initialize any other footer-specific elements
    // For example, accordion functionality, social links tracking, etc.
}

/**
 * Highlights the current page in the navigation menu
 * Works with both old and new navigation structures
 */
function highlightCurrentPage() {
    // Get current page filename from URL
    const currentPage = window.location.pathname.split('/').pop();
    
    // Get all navigation links (support both old and new nav structures)
    const navLinks = document.querySelectorAll('nav ul li a, .nav-menu li a');
    
    // Loop through navigation links and add active class to current page
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        // Handle index.html and empty path (home page)
        if ((currentPage === '' || currentPage === 'index.html') && 
            (linkPage === 'index.html' || linkPage === './')) {
            link.classList.add('active');
        } 
        // Handle other pages
        else if (linkPage === currentPage) {
            link.classList.add('active');
        }
        // Handle dropdown active state for program pages
        else if (
            (currentPage === 'emergency.html' || 
            currentPage === 'shores.html' || 
            currentPage === 'recycling.html' || 
            currentPage === 'funding.html' || 
            currentPage === 'partnering.html') && 
            linkPage === 'nonprofit.html'
        ) {
            const parentLi = link.parentElement;
            if (parentLi && parentLi.classList.contains('dropdown')) {
                link.classList.add('active');
            }
        }
    });
}

/**
 * Initializes mobile navigation menu toggle
 * Supports both old and new navigation structures
 */
function initMobileNav() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburgerMenu && navMenu) {
        // Add ARIA attributes
        hamburgerMenu.setAttribute('aria-expanded', 'false');
        
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA expanded state
            const isExpanded = hamburgerMenu.classList.contains('active');
            hamburgerMenu.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            
            // Transform hamburger to X
            const bars = hamburgerMenu.querySelectorAll('.bar');
            if (hamburgerMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !e.target.closest('.nav-menu') && 
                !e.target.closest('.hamburger-menu')) {
                navMenu.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                
                // Reset hamburger
                const bars = hamburgerMenu.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // For dropdown toggles in mobile view
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.dropdown-menu');
        
        if (window.innerWidth <= 768 && link && submenu) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    submenu.classList.toggle('active');
                }
            });
        }
    });
    
    // Resize event to reset mobile menu when switching to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('active');
                
                // Reset hamburger
                const bars = hamburgerMenu.querySelectorAll('.bar');
                if (bars.length) {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
            
            // Reset dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
    
    // Support for legacy navigation structures
    
    // For the header structure with mobile-menu-toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
        });
        
        // For dropdown toggles in mobile view (legacy)
        const hasDropdownItems = document.querySelectorAll('.has-dropdown > a');
        
        hasDropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Only handle dropdown toggle on mobile/tablet view
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    parent.classList.toggle('dropdown-active');
                    
                    // Update ARIA attributes
                    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
                    this.setAttribute('aria-expanded', !expanded);
                }
            });
        });
    }
    
    // Keep legacy support for older pages
    const mobileNavBtn = document.querySelector('.mobile-nav-toggle');
    
    if (mobileNavBtn) {
        const navMenu = document.querySelector('nav ul');
        
        if (navMenu) {
            mobileNavBtn.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                mobileNavBtn.classList.toggle('active');
            });
        }
    }
}

/**
 * Initializes any image sliders on the page
 * Simple slider implementation without external libraries
 */
function initSliders() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        
        if (slides.length > 0 && prevBtn && nextBtn) {
            let currentSlide = 0;
            
            // Show the first slide
            showSlide(currentSlide);
            
            // Previous button event listener
            prevBtn.addEventListener('click', () => {
                currentSlide--;
                if (currentSlide < 0) {
                    currentSlide = slides.length - 1;
                }
                showSlide(currentSlide);
            });
            
            // Next button event listener
            nextBtn.addEventListener('click', () => {
                currentSlide++;
                if (currentSlide >= slides.length) {
                    currentSlide = 0;
                }
                showSlide(currentSlide);
            });
            
            // Function to show a specific slide
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    if (i === index) {
                        slide.style.display = 'block';
                    } else {
                        slide.style.display = 'none';
                    }
                });
            }
        }
    });
}

/**
 * Initializes form validation for contact form
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            let isValid = true;
            
            // Get form fields
            const nameField = contactForm.querySelector('[name="name"]');
            const emailField = contactForm.querySelector('[name="email"]');
            const messageField = contactForm.querySelector('[name="message"]');
            
            // Clear previous error messages
            const errorMessages = contactForm.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.remove());
            
            // Validate name
            if (nameField && !nameField.value.trim()) {
                isValid = false;
                showError(nameField, 'Please enter your name');
            }
            
            // Validate email
            if (emailField && !isValidEmail(emailField.value)) {
                isValid = false;
                showError(emailField, 'Please enter a valid email address');
            }
            
            // Validate message
            if (messageField && !messageField.value.trim()) {
                isValid = false;
                showError(messageField, 'Please enter your message');
            }
            
            // Prevent form submission if validation fails
            if (!isValid) {
                event.preventDefault();
            }
        });
    }
    
    // Helper function to show error message
    function showError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.3rem';
        
        field.style.borderColor = 'red';
        field.parentNode.appendChild(errorElement);
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Initializes smooth scrolling for anchor links
 * Works for links with href values that start with #
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking
                const navMenu = document.querySelector('.nav-menu');
                const hamburgerMenu = document.querySelector('.hamburger-menu');
                
                if (navMenu && navMenu.classList.contains('active') && hamburgerMenu) {
                    navMenu.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    
                    // Reset hamburger
                    const bars = hamburgerMenu.querySelectorAll('.bar');
                    if (bars.length) {
                        bars[0].style.transform = 'none';
                        bars[1].style.opacity = '1';
                        bars[2].style.transform = 'none';
                    }
                }
            }
        });
    });
}

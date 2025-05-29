/**
 * OceanAid360 Website Scripts
 * Main JavaScript file for all pages
 * Updated for multi-page architecture
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add active class to current page in navigation
    highlightCurrentPage();
    
    // Initialize mobile navigation toggle
    initMobileNav();
    
    // Initialize any sliders on the page
    initSliders();
    
    // Initialize form validation if contact form exists
    if (document.querySelector('.contact-form')) {
        initFormValidation();
    }
    
    // Handle smooth scrolling for anchor links
    initSmoothScroll();
    
    // Handle quantity selectors for products
    initQuantitySelectors();
});

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
        });
    }
    
    // For dropdown toggles in mobile view (legacy)
    const hasDropdown = document.querySelectorAll('.has-dropdown');
    
    hasDropdown.forEach(item => {
        if (window.innerWidth < 992) {
            item.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' && e.target.parentElement.classList.contains('has-dropdown')) {
                    e.preventDefault();
                    this.classList.toggle('active');
                }
            });
        }
    });
    
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

/**
 * Initializes quantity selectors for product pages
 */
function initQuantitySelectors() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const button = e.target;
            const input = button.parentNode.querySelector('.quantity-input');
            const currentValue = parseInt(input.value) || 1;
            
            if (button.textContent === '+') {
                input.value = currentValue + 1;
            } else if (button.textContent === '-' && currentValue > 1) {
                input.value = currentValue - 1;
            }
        }
    });
}
/**
 * OceanAid360 Website Scripts
 * Main JavaScript file for all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add active class to current page in navigation
    highlightCurrentPage();
    
    // Initialize mobile navigation toggle if it exists
    initMobileNav();
    
    // Initialize any sliders on the page
    initSliders();
    
    // Initialize form validation if contact form exists
    if (document.querySelector('.contact-form')) {
        initFormValidation();
    }
});

/**
 * Highlights the current page in the navigation menu
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
    });
}
/**
 * Initializes mobile navigation menu toggle
 */
function initMobileNav() {
    // For the new header structure
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // For dropdown toggles in mobile view
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
        
        mobileNavBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileNavBtn.classList.toggle('active');
        });
    }
}
/**
 * Initializes any image sliders on the page
 * This is a simple slider implementation - for more complex needs, 
 * consider using a library like Swiper.js
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
 * Smooth scroll to page sections when clicking on navigation links
 * This works for links with href values that start with #
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Handle quantity selector in product pages
 */
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

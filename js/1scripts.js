// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Dropdown Toggle
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
});
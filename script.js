// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle mobile nav
            mobileNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when nav is open
            if (mobileNav.classList.contains('active')) {
                body.style.overflow = 'hidden';
                mobileNav.style.display = 'block';
            } else {
                body.style.overflow = '';
                setTimeout(() => {
                    if (!mobileNav.classList.contains('active')) {
                        mobileNav.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = '';
                setTimeout(() => {
                    mobileNav.style.display = 'none';
                }, 300);
            }
        });
        
        // Close mobile nav when clicking nav links
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = '';
                setTimeout(() => {
                    mobileNav.style.display = 'none';
                }, 300);
            });
        });
    }
    
    // Donate button functionality
    const donateButtons = document.querySelectorAll('.donate-btn');
    donateButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'donate.html';
        });
    });
    
    // Causes carousel functionality
    const causesGrid = document.querySelector('.causes-grid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const scrollProgress = document.querySelector('.scroll-progress-fill');
    
    if (causesGrid && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = causesGrid.querySelectorAll('.cause-card');
        const totalCards = cards.length;
        
        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth + 32; // card width + gap
            const scrollPosition = currentIndex * cardWidth;
            causesGrid.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            // Update progress bar
            const progress = (currentIndex / (totalCards - 1)) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = progress + '%';
            }
        }
        
        prevBtn.addEventListener('click', function() {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', function() {
            currentIndex = Math.min(totalCards - 1, currentIndex + 1);
            updateCarousel();
        });
        
        // Auto-scroll functionality
        let autoScrollInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }, 5000);
        
        // Pause auto-scroll on hover
        causesGrid.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
        
        causesGrid.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            }, 5000);
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Stats animation on scroll
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate numbers
                const numberElement = entry.target.querySelector('.stat-value');
                if (numberElement) {
                    animateNumber(numberElement);
                }
            }
        });
    }, observerOptions);
    
    // Observe stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Number animation function
    function animateNumber(element) {
        const text = element.textContent;
        const hasLakh = text.includes('Lakh');
        const hasCr = text.includes('Cr');
        const hasRupee = text.includes('₹');
        
        // Extract number
        let numberStr = text.replace(/[^\d.]/g, '');
        let targetNumber = parseFloat(numberStr);
        
        if (isNaN(targetNumber)) return;
        
        let currentNumber = 0;
        const increment = targetNumber / 50; // 50 steps
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            
            let displayNumber = currentNumber.toFixed(2);
            let displayText = displayNumber;
            
            if (hasRupee) displayText = '₹' + displayText;
            if (hasCr) displayText += ' Cr+';
            else if (hasLakh) displayText += ' Lakh+';
            else displayText += '+';
            
            element.textContent = displayText;
        }, stepTime);
    }
    
    // Contact form functionality
    const quickContactForm = document.getElementById('quickContactForm');
    const quickFormSuccess = document.getElementById('quickFormSuccess');
    
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            let isValid = true;
            const requiredFields = ['name', 'email', 'phone', 'address', 'caseDescription'];
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    input.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    input.style.borderColor = '#22c55e';
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                document.getElementById('email').style.borderColor = '#ef4444';
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show success message
            quickContactForm.style.display = 'none';
            quickFormSuccess.style.display = 'block';
            
            // Reset form after 5 seconds
            setTimeout(() => {
                quickContactForm.style.display = 'block';
                quickFormSuccess.style.display = 'none';
                quickContactForm.reset();
                
                // Reset input styles
                const inputs = quickContactForm.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.style.borderColor = '';
                });
            }, 5000);
            
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        });
    }
    
    // Contact options click handlers
    const contactOptions = document.querySelectorAll('.contact-option');
    contactOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionType = this.classList[1]; // Get the second class (whatsapp, instagram, etc.)
            
            switch(optionType) {
                case 'whatsapp':
                    window.open('https://wa.me/1234567890', '_blank');
                    break;
                case 'instagram':
                    window.open('https://instagram.com/srivinyakafoundation', '_blank');
                    break;
                case 'phone':
                    window.location.href = 'tel:+911234567890';
                    break;
                case 'email':
                    window.location.href = 'mailto:office@vinayaka.foundation';
                    break;
                default:
                    break;
            }
        });
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        const closeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        };
        
        notification.querySelector('.notification-close').addEventListener('click', closeNotification);
        
        setTimeout(closeNotification, 5000);
    }
    
    // Cause card donate buttons
    const causeDonateBtns = document.querySelectorAll('.donate-btn-overlay');
    causeDonateBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.location.href = 'donate.html';
        });
    });
    
    // Social media links
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            
            switch(platform) {
                case 'facebook':
                    window.open('https://facebook.com/srivinyakafoundation', '_blank');
                    break;
                case 'twitter':
                    window.open('https://twitter.com/srivinyakafoundation', '_blank');
                    break;
                case 'instagram':
                    window.open('https://instagram.com/srivinyakafoundation', '_blank');
                    break;
                case 'linkedin':
                    window.open('https://linkedin.com/company/srivinyakafoundation', '_blank');
                    break;
            }
        });
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
});
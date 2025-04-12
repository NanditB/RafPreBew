// Progress bar functionality
const progressBar = document.querySelector('.progress-bar');

// WhatsApp button functionality
const whatsappButton = document.querySelector('.whatsapp-float');
let isWhatsappVisible = false;

// Section Navigation
const sectionNav = document.querySelector('.section-nav');
const sections = document.querySelectorAll('section');
const heroSection = document.querySelector('.hero');
const ctaButton = document.querySelector('.cta-button');
let currentSectionIndex = 0;

// Show navigation arrows when clicking "Commencer"
ctaButton.addEventListener('click', () => {
    sectionNav.classList.add('visible');
});

// Navigation button click handlers
const prevButton = document.querySelector('.section-nav-btn.prev');
const nextButton = document.querySelector('.section-nav-btn.next');

prevButton.addEventListener('click', () => {
    if (currentSectionIndex > 0) {
        scrollToSection(currentSectionIndex - 1);
    }
});

nextButton.addEventListener('click', () => {
    if (currentSectionIndex < sections.length - 1) {
        scrollToSection(currentSectionIndex + 1);
    }
});

// Function to check if element is in viewport with cross-browser support
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    
    return (
        rect.top <= windowHeight * 0.5 && // Element's top is in the first half of viewport
        rect.bottom >= 0 && // Element's bottom is not above viewport
        rect.left <= windowWidth && // Element's left edge is in viewport
        rect.right >= 0 // Element's right edge is in viewport
    );
}

// Function to get current scroll position with cross-browser support
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

// Function to toggle navigation visibility with cross-browser support
function toggleNavigationVisibility() {
    const scrollPosition = getScrollPosition();
    const heroHeight = heroSection.offsetHeight;
    
    if (scrollPosition < heroHeight * 0.5) {
        sectionNav.classList.remove('visible');
    } else {
        sectionNav.classList.add('visible');
    }
}

// Function to scroll to a specific section with cross-browser support
function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        const targetSection = sections[index];
        const targetPosition = targetSection.offsetTop - 80; // Account for fixed header
        currentSectionIndex = index; // Update current index before scrolling
        
        // Smooth scroll with fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers that don't support smooth scrolling
            smoothScrollFallback(targetPosition);
        }
    }
}

// Smooth scroll fallback for older browsers
function smoothScrollFallback(targetPosition) {
    const startPosition = getScrollPosition();
    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 second
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    // Easing function
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    requestAnimationFrame(animation);
}

// Update current section index with cross-browser support
function updateCurrentSection() {
    const scrollPosition = getScrollPosition() + (window.innerHeight / 2);
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const absoluteTop = rect.top + getScrollPosition();
        const absoluteBottom = absoluteTop + rect.height;
        
        if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            currentSectionIndex = index;
        }
    });
}

// Add event listeners with passive option where supported
function addPassiveEventListener(element, eventName, func) {
    let passive = false;
    
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function() {
                passive = true;
                return true;
            }
        });
        window.addEventListener('test', null, opts);
    } catch (e) {}
    
    element.addEventListener(eventName, func, passive ? { passive: true } : false);
}

// Add scroll and resize event listeners
addPassiveEventListener(window, 'scroll', () => {
    updateCurrentSection();
    toggleNavigationVisibility();
    updateProgressBar();
});

addPassiveEventListener(window, 'resize', () => {
    toggleNavigationVisibility();
    updateProgressBar();
});

// Initial check
toggleNavigationVisibility();

function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
}

// Mobile menu functionality
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const bars = document.querySelectorAll('.bar');
    bars[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(8px, 8px)' : 'none';
    bars[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    bars[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : 'none';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        const bars = document.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
        }
    });
});

// Form submission handling
const businessForm = document.getElementById('businessForm');
if (businessForm) {
    businessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your server
        alert('Merci pour votre message ! Nous vous contacterons bientôt.');
        businessForm.reset();
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// Add animation to feature cards
document.querySelectorAll('.feature-card, .driver-card, .business-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.4s ease-out';
    observer.observe(card);
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});

// Driver form handling
const toggleFormButtons = document.querySelectorAll('.toggle-form');
const driverForms = document.querySelectorAll('.driver-form');

toggleFormButtons.forEach(button => {
    button.addEventListener('click', () => {
        const formId = button.getAttribute('data-form');
        const form = document.getElementById(formId);
        
        // Close all other forms
        driverForms.forEach(f => {
            if (f.id !== formId) {
                f.classList.remove('active');
            }
        });

        // Toggle current form
        form.classList.toggle('active');
        
        // Scroll form into view if it's now active
        if (form.classList.contains('active')) {
            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});

// Handle driver form submissions
document.querySelectorAll('.slick-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        let formContent = '';
        
        // Get current date and time
        const now = new Date();
        const dateTime = now.toLocaleString();
        
        // Add timestamp to the form content
        formContent += `Date: ${dateTime}\n`;
        
        // Add form type
        const isDriverForm = form.closest('.driver-form');
        formContent += `Type: ${isDriverForm ? form.closest('.driver-card').querySelector('h3').textContent : 'Business'}\n`;
        
        // Add form data
        formData.forEach((value, key) => {
            if (value) {
                formContent += `${key}: ${value}\n`;
            }
        });
        formContent += '\n-------------------\n\n';

        // Create a Blob with the content
        const blob = new Blob([formContent], { type: 'text/plain' });
        const fileName = isDriverForm ? 'Mess/Driver.txt' : 'Mess/Business.txt';
        
        // Create download link
        /*
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);*/


        // Show success message
        alert('Formulaire envoyé avec succès!');
        
        // Reset form and close it if it's a driver form
        form.reset();
        if (isDriverForm) {
            form.closest('.driver-form').classList.remove('active');
        }
    });
});

// Close forms when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.driver-card')) {
        driverForms.forEach(form => form.classList.remove('active'));
    }
});

// Carousel functionality
function initializeCarousel(carouselContainer) {
    const carousel = carouselContainer.querySelector('.carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = carouselContainer.querySelector('.carousel-button.prev');
    const nextButton = carouselContainer.querySelector('.carousel-button.next');
    const dotsContainer = carouselContainer.querySelector('.carousel-dots');

    let currentSlide = 0;
    const slideCount = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = carouselContainer.querySelectorAll('.carousel-dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }

    // Event listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Auto-advance slides
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Initialize all carousels
document.querySelectorAll('.carousel-container').forEach(initializeCarousel);

function handleScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    
    // Update progress bar
    const progress = (scrollPosition / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
}

// Add scroll event listeners
window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

// Form functionality
const becomePartnerBtn = document.querySelector('.partner-info .button');

// Redirect to independent courier form when clicking "Devenir Partenaire"
becomePartnerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const independentForm = document.getElementById('independent-form');
    const toggleButton = document.querySelector('[data-form="independent-form"]');
    
    // Scroll to drivers section
    document.getElementById('drivers').scrollIntoView({ behavior: 'smooth' });
    
    // Wait for scroll to complete then open the form
    setTimeout(() => {
        // Close any open forms
        document.querySelectorAll('.driver-form').forEach(form => {
            form.classList.remove('active');
        });
        
        // Open the independent courier form
        independentForm.classList.add('active');
        independentForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1000);
});

// Ensure the form toggles when the button is clicked
document.querySelector('.toggle-form[data-form="investor-form"]').addEventListener('click', () => {
    console.log('Button clicked'); // Debugging log
    const form = document.getElementById('investor-form');
    form.classList.toggle('active');
    console.log('Form class list:', form.classList); // Debugging log
});

// ... existing code ... 

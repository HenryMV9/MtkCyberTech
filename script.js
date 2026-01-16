import { initializeI18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeI18n();
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || 'Not provided',
                issueType: formData.get('issueType'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            const whatsappNumber = '15705409942';
            const whatsappMessage = `*New Case Review Submission*\n\n` +
                `*Name:* ${data.name}\n` +
                `*Email:* ${data.email}\n` +
                `*Phone:* ${data.phone}\n` +
                `*Issue Type:* ${data.issueType}\n` +
                `*Case Details:*\n${data.message}\n\n` +
                `*Submitted:* ${new Date().toLocaleString()}`;

            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                contactForm.reset();
            }, 800);

            setTimeout(() => {
                contactForm.style.display = 'grid';
                formSuccess.style.display = 'none';
            }, 5000);
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const targetPosition = targetElement.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    navbar.style.transition = 'transform 0.3s ease';
});

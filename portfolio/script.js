document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Smooth Scrolling for Nav Links
    const navLinks = document.querySelectorAll('.nav-links a, .hero-actions a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'var(--white)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Animate stats on scroll
    const stats = document.querySelectorAll('.stat-num');
    let animated = false;

    const animateStats = () => {
        if (animated) return;
        
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            if (isNaN(target)) return;
            
            let count = 0;
            const increment = target / 50;
            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    stat.textContent = Math.ceil(count) + (stat.textContent.includes('M+') ? 'M+' : '+');
                    setTimeout(updateCount, 20);
                } else {
                    stat.textContent = target + (stat.textContent.includes('M+') ? 'M+' : '+');
                }
            };
            updateCount();
        });
        animated = true;
    };

    // Simple intersection observer for stats
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateStats();
        }
    }, { threshold: 0.5 });

    if (stats.length > 0) {
        observer.observe(document.querySelector('.about-stats'));
    }
});

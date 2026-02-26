// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 600);
    }
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
        navbar.style.background = 'rgba(15, 15, 30, 0.95)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(15, 15, 30, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all game cards and feature cards
document.querySelectorAll('.game-card, .feature-card, .pricing-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add click handlers to all "Buy Now" buttons
document.querySelectorAll('.game-card .btn-primary').forEach(button => {
    button.addEventListener('click', function() {
        const gameCard = this.closest('.game-card');
        const gameName = gameCard.querySelector('h3').textContent;
        const price = gameCard.querySelector('.price').textContent;
        
        // Show purchase modal (you can replace this with actual payment integration)
        showPurchaseModal(gameName, price);
    });
});

// Simple purchase modal
function showPurchaseModal(gameName, price) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--dark-light);
            padding: 3rem;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            border: 2px solid var(--primary);
            animation: slideUp 0.3s ease;
        ">
            <h2 style="margin-bottom: 1rem; color: var(--primary);">Purchase ${gameName}</h2>
            <p style="color: var(--text-dim); margin-bottom: 2rem;">
                You're about to purchase <strong style="color: var(--text);">${gameName}</strong> for <strong style="color: var(--primary);">${price}</strong>
            </p>
            <div style="margin-bottom: 2rem;">
                <input type="email" placeholder="Your email address" style="
                    width: 100%;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    background: var(--dark);
                    color: var(--text);
                    font-size: 1rem;
                    margin-bottom: 1rem;
                ">
                <input type="text" placeholder="Discord username (optional)" style="
                    width: 100%;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    background: var(--dark);
                    color: var(--text);
                    font-size: 1rem;
                ">
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn-primary" style="flex: 1;" onclick="completePurchase('${gameName}')">
                    Complete Purchase
                </button>
                <button class="btn-secondary" style="flex: 1;" onclick="this.closest('div[style*=fixed]').remove()">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Complete purchase (placeholder - integrate with actual payment processor)
function completePurchase(gameName) {
    alert(`Thank you for your purchase of ${gameName}!\n\nIn a real implementation, this would redirect to a payment processor like Stripe, PayPal, or Sellix.\n\nYou would receive the game files via email immediately after payment.`);
    document.querySelector('div[style*="fixed"]').remove();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Counter animation for hero stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number && !statNumber.dataset.animated) {
                statNumber.dataset.animated = 'true';
                statNumber.textContent = '0';
                setTimeout(() => {
                    animateCounter(statNumber, number);
                    // Add back the suffix
                    setTimeout(() => {
                        if (text.includes('+')) {
                            statNumber.textContent = number + '+';
                        } else if (text.includes('★')) {
                            statNumber.textContent = number + '★';
                        }
                    }, 2000);
                }, 200);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Add hover effect to game cards with tilt
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'rgba(99, 102, 241, 0.6)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'rgba(99, 102, 241, 0.2)';
        this.style.transform = '';
    });
    
    // 3D tilt effect
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
    });
});

// Floating animation for feature icons
document.querySelectorAll('.feature-icon').forEach((icon, index) => {
    icon.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
});

// Add CSS for float animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(floatStyle);

console.log('🎮 RoUI Market - Website loaded successfully!');

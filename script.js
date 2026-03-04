document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor (Optimized)
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let mouseX = -100;
    let mouseY = -100;
    let cursorActive = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursorActive) {
            cursorActive = true;
            requestAnimationFrame(updateCursor);
        }
    }, { passive: true });

    const updateCursor = () => {
        // Using transform3d for hardware acceleration instead of top/left layout thrashing
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        if (cursor.classList.contains('hovering')) {
            cursor.style.transform += ' scale(1.5)';
        }
        if (cursorActive) requestAnimationFrame(updateCursor);
    };

    // Hover effect on clickable elements
    const clickables = document.querySelectorAll('a, button, .product-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Reveal Elements on Scroll (Optimized with IntersectionObserver)
    const reveals = document.querySelectorAll('.fade-in-anim, .section-title, .product-card');
    reveals.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, { rootMargin: "0px 0px -100px 0px" });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('active'));
    }

    // Magnetic Buttons
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-buy, .btn-primary-small');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseout', function () {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // Navigation Scroll Effect (Optimized via requestAnimationFrame debounce)
    const header = document.querySelector('header');
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.classList.remove('active'); // Close mobile menu on click

            const href = this.getAttribute('href');
            if (href === '#') return; // Prevent DOMException

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Testimonials Carousel Auto-Rotation - Horizontal Sliding Track
    const track = document.getElementById('testimonialsTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    if (track && slides.length > 0) {
        let currentIndex = 0;

        setInterval(() => {
            const slideWidth = slides[0].offsetWidth;
            const containerWidth = track.parentElement.offsetWidth;
            const gap = 20; // 20px gap from CSS gap property
            const maxVisible = Math.max(1, Math.floor(containerWidth / (slideWidth + gap - 1))); // rough approx
            const maxIndex = Math.max(0, slides.length - maxVisible);

            currentIndex++;
            if (currentIndex > maxIndex) {
                currentIndex = 0; // jump back to start
            }

            const moveAmount = slideWidth + gap;
            track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
        }, 3500); // Rotate every 3.5 seconds
    }
});

// WhatsApp Integration
// Predefined phone number
const phoneNumber = "923437596970";

function orderViaWhatsApp(productName, price) {
    const message = `Hello! I would like to order one unit of *${productName}*.\nThe total listed price is *Rs ${price}*.\n\nPlease let me know the delivery details and process.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

function openGeneralWhatsApp() {
    const message = `Hello! I have an inquiry about your dairy products.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

// Safepay Integration
async function payWithSafepay(productName, price) {
    try {
        const originalText = event.target.innerHTML;
        event.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        const SAFEPAY_SECRET = 'sec_ff8d1e70-6082-471e-9d29-a0f3faf41161';

        // Try Sandbox first, fallback to Production
        const createTracker = async (env, url) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-SFPY-MERCHANT-SECRET': SAFEPAY_SECRET
                },
                body: JSON.stringify({
                    client: SAFEPAY_SECRET,
                    amount: parseFloat(price),
                    currency: 'PKR',
                    environment: env
                })
            });
            return await response.json();
        };

        let environment = 'sandbox';
        let data = await createTracker('sandbox', 'https://sandbox.api.getsafepay.com/order/v1/init');

        if (!data || !data.data || !data.data.token) {
            environment = 'production';
            data = await createTracker('production', 'https://api.getsafepay.com/order/v1/init');
        }

        event.target.innerHTML = originalText;

        if (data && data.data && data.data.token) {
            safepay.Checkout.setup({
                environment: environment,
                tracker: data.data.token,
                source: "custom",
                checkout_style: "modal",
                onCheckout: (res) => {
                    console.log("Safepay Success:", res);
                    alert("Payment completed successfully!");
                },
                onCancel: () => {
                    console.log("Safepay Cancelled");
                }
            });
        } else {
            console.error("Safepay Error:", data);
            alert("Failed to initialize Safepay payment. Please check your Secret Key or use WhatsApp.");
        }
    } catch (err) {
        console.error("Safepay init error:", err);
        alert("An error occurred. Please try again later. Check console for details.");
        if (event && event.target) {
            event.target.innerHTML = '<i class="fas fa-credit-card"></i> Pay with Safepay';
        }
    }
}

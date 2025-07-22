// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentImgSpan = document.getElementById('current-img');
const totalImgsSpan = document.getElementById('total-imgs');

let currentImageIndex = 0;
let galleryImages = [];

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryImages = Array.from(galleryItems).map(item => ({
        src: item.dataset.src,
        alt: item.dataset.alt
    }));

    totalImgsSpan.textContent = galleryImages.length;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const current = galleryImages[currentImageIndex];

    // Hide video and show image by default
    if (lightboxVideo) {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }

    if (current.src.endsWith('.mp4') && lightboxVideo) {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.querySelector('source').src = current.src;
        lightboxVideo.load();
        lightboxVideo.play();
    } else {
        updateLightboxImage();
    }

    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
    const current = galleryImages[currentImageIndex];
    
    // Hide and pause video if it exists
    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
        lightboxVideo.style.display = 'none';
    }

    lightboxImg.src = current.src;
    lightboxImg.alt = current.alt;
    lightboxImg.style.display = 'block';
    currentImgSpan.textContent = currentImageIndex + 1;
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Pause and reset video if it exists
    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }
}

function prevImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
    openLightbox(currentImageIndex);
}

function nextImage() {
    currentImageIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
    openLightbox(currentImageIndex);
}

closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
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
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Video hover functionality for desktop and touch functionality for mobile
function initVideoHover() {
    const videoItems = document.querySelectorAll('.gallery-item.video-item video');
    
    videoItems.forEach(video => {
        const galleryItem = video.closest('.gallery-item');
        let touchTimer = null;
        let isPlaying = false;
        let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        let hasShownHint = localStorage.getItem('videoHintShown') === 'true';
        
        // Desktop hover functionality
        if (!isTouchDevice) {
            galleryItem.addEventListener('mouseenter', () => {
                video.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            });
            
            galleryItem.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        } else {
            // Mobile touch functionality
            
            // Show hint on first interaction if not shown before
            if (!hasShownHint) {
                galleryItem.classList.add('show-hint');
                setTimeout(() => {
                    galleryItem.classList.remove('show-hint');
                    localStorage.setItem('videoHintShown', 'true');
                }, 3000);
            }
            
            // Touch and hold to preview (like Instagram stories)
            galleryItem.addEventListener('touchstart', (e) => {
                // Don't prevent default to allow normal click events for lightbox
                
                touchTimer = setTimeout(() => {
                    video.play().catch(e => {
                        console.log('Video autoplay prevented:', e);
                    });
                    isPlaying = true;
                    
                    // Add visual feedback for touch preview
                    galleryItem.classList.add('playing');
                    galleryItem.style.transform = 'scale(0.98)';
                    galleryItem.style.transition = 'transform 0.1s ease';
                    
                    // Haptic feedback if available
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                }, 300); // Start preview after 300ms hold
            });
            
            galleryItem.addEventListener('touchend', (e) => {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
                
                // Reset visual feedback
                galleryItem.style.transform = 'scale(1)';
                galleryItem.classList.remove('playing');
                
                if (isPlaying) {
                    video.pause();
                    video.currentTime = 0;
                    isPlaying = false;
                    e.preventDefault(); // Prevent lightbox opening when ending preview
                    e.stopPropagation();
                }
            });
            
            galleryItem.addEventListener('touchcancel', (e) => {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
                
                galleryItem.style.transform = 'scale(1)';
                galleryItem.classList.remove('playing');
                
                if (isPlaying) {
                    video.pause();
                    video.currentTime = 0;
                    isPlaying = false;
                }
            });
            
            // Alternative: Double tap to toggle play/pause
            let lastTap = 0;
            galleryItem.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 500 && tapLength > 0 && !isPlaying) {
                    // Double tap detected and not currently in preview mode
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (video.paused) {
                        video.play().catch(e => {
                            console.log('Video autoplay prevented:', e);
                        });
                        galleryItem.classList.add('playing');
                        
                        // Auto-pause after 3 seconds for preview
                        setTimeout(() => {
                            if (!video.paused) {
                                video.pause();
                                video.currentTime = 0;
                                galleryItem.classList.remove('playing');
                            }
                        }, 3000);
                    } else {
                        video.pause();
                        video.currentTime = 0;
                        galleryItem.classList.remove('playing');
                    }
                }
                lastTap = currentTime;
            });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initVideoHover();
});


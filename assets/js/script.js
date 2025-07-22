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

// Apple-style video optimization and hover functionality
function initVideoHover() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const videoItems = document.querySelectorAll('.gallery-item.video-item');
    
    // Intersection Observer for smart preloading (Apple-style)
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (!video) return;
            
            if (entry.isIntersecting) {
                // Video is near viewport - start aggressive preloading
                if (video.preload !== 'auto') {
                    video.preload = 'auto';
                    video.load(); // Force reload with new preload setting
                    console.log('Smart preloading video:', video.src);
                }
            } else if (entry.intersectionRatio < 0.1) {
                // Video is far from viewport - reduce memory usage
                if (!video.classList.contains('playing') && video.readyState > 2) {
                    video.preload = 'metadata';
                }
            }
        });
    }, {
        rootMargin: '300px', // Start loading 300px before entering viewport
        threshold: [0, 0.1, 0.5]
    });
    
    videoItems.forEach((galleryItem, index) => {
        const video = galleryItem.querySelector('video');
        if (!video) return;
        
        // Observe for smart preloading
        videoObserver.observe(galleryItem);
        
        // Apple-style video optimization
        video.preload = 'metadata'; // Start with metadata only
        video.muted = true; // Required for autoplay policies
        video.playsInline = true; // Prevent fullscreen on mobile
        
        // Enhanced buffering strategy with loading states
        let isBuffering = false;
        let bufferTimeout;
        let preloadPromise = null;
        
        const ensureVideoReady = () => {
            if (preloadPromise) return preloadPromise;
            
            preloadPromise = new Promise((resolve) => {
                if (video.readyState >= 3) { // HAVE_FUTURE_DATA or better
                    resolve();
                    return;
                }
                
                isBuffering = true;
                galleryItem.classList.add('buffering');
                
                // Force aggressive preloading
                video.preload = 'auto';
                video.load();
                
                const checkBuffer = () => {
                    if (video.readyState >= 3) {
                        isBuffering = false;
                        galleryItem.classList.remove('buffering');
                        preloadPromise = null;
                        resolve();
                    } else {
                        bufferTimeout = setTimeout(checkBuffer, 50); // Check more frequently
                    }
                };
                
                // Start checking immediately
                checkBuffer();
                
                // Fallback timeout
                setTimeout(() => {
                    if (isBuffering) {
                        console.log('Video buffering timeout, proceeding anyway');
                        isBuffering = false;
                        galleryItem.classList.remove('buffering');
                        preloadPromise = null;
                        resolve();
                    }
                }, 3000);
            });
            
            return preloadPromise;
        };
        
        let touchTimer;
        let doubleTapTimer;
        let tapCount = 0;
        let isPlaying = false;
        let hasShownHint = localStorage.getItem('videoHintShown') === 'true';
        
        // Show hint for mobile users (first time only)
        if (isTouchDevice && !hasShownHint && index < 3) { // Only show on first few videos
            galleryItem.classList.add('show-hint');
            setTimeout(() => {
                galleryItem.classList.remove('show-hint');
                localStorage.setItem('videoHintShown', 'true');
            }, 3000);
        }
        
        if (isTouchDevice) {
            // Enhanced touch and hold functionality with preloading
            galleryItem.addEventListener('touchstart', async (e) => {
                galleryItem.classList.add('touch-active');
                
                // Start buffering immediately on touch (Apple-style)
                const readyPromise = ensureVideoReady();
                
                touchTimer = setTimeout(async () => {
                    try {
                        await readyPromise; // Wait for sufficient buffering
                        await video.play();
                        isPlaying = true;
                        galleryItem.classList.add('playing');
                        
                        // Enhanced visual feedback
                        galleryItem.style.transform = 'scale(0.98)';
                        galleryItem.style.transition = 'transform 0.1s ease';
                        
                        // Haptic feedback
                        if (navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                    } catch (e) {
                        console.log('Video play prevented:', e);
                        galleryItem.classList.remove('buffering');
                    }
                }, 200); // Reduced delay since we're pre-buffering
            });
            
            galleryItem.addEventListener('touchend', (e) => {
                clearTimeout(touchTimer);
                clearTimeout(bufferTimeout);
                galleryItem.classList.remove('touch-active', 'buffering');
                galleryItem.style.transform = 'scale(1)';
                
                if (isPlaying) {
                    video.pause();
                    video.currentTime = 0;
                    isPlaying = false;
                    galleryItem.classList.remove('playing');
                    e.preventDefault(); // Prevent lightbox when ending preview
                    e.stopPropagation();
                }
            });
            
            galleryItem.addEventListener('touchcancel', (e) => {
                clearTimeout(touchTimer);
                clearTimeout(bufferTimeout);
                galleryItem.classList.remove('touch-active', 'buffering');
                galleryItem.style.transform = 'scale(1)';
                
                if (isPlaying) {
                    video.pause();
                    video.currentTime = 0;
                    isPlaying = false;
                    galleryItem.classList.remove('playing');
                }
            });
            
            // Enhanced double tap functionality with preloading
            galleryItem.addEventListener('touchend', async (e) => {
                if (isPlaying) return; // Skip if already playing from hold
                
                tapCount++;
                if (tapCount === 1) {
                    doubleTapTimer = setTimeout(() => {
                        tapCount = 0;
                    }, 300);
                } else if (tapCount === 2) {
                    clearTimeout(doubleTapTimer);
                    tapCount = 0;
                    e.preventDefault();
                    e.stopPropagation();
                    
                    try {
                        await ensureVideoReady(); // Ensure buffering before play
                        await video.play();
                        isPlaying = true;
                        galleryItem.classList.add('playing');
                        
                        // Auto-pause after 3 seconds
                        setTimeout(() => {
                            if (isPlaying) {
                                video.pause();
                                video.currentTime = 0;
                                isPlaying = false;
                                galleryItem.classList.remove('playing');
                            }
                        }, 3000);
                    } catch (e) {
                        console.log('Video play prevented:', e);
                        galleryItem.classList.remove('buffering');
                    }
                }
            });
            
        } else {
            // Enhanced desktop hover functionality with preloading
            galleryItem.addEventListener('mouseenter', async () => {
                try {
                    await ensureVideoReady(); // Ensure buffering before play
                    await video.play();
                    galleryItem.classList.add('playing');
                } catch (e) {
                    console.log('Video play prevented:', e);
                    galleryItem.classList.remove('buffering');
                }
            });
            
            galleryItem.addEventListener('mouseleave', () => {
                clearTimeout(bufferTimeout);
                video.pause();
                video.currentTime = 0;
                galleryItem.classList.remove('playing', 'buffering');
            });
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            videoObserver.disconnect();
            clearTimeout(touchTimer);
            clearTimeout(doubleTapTimer);
            clearTimeout(bufferTimeout);
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initVideoHover();
});


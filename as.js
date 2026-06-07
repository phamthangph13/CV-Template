document.addEventListener('DOMContentLoaded', function () {
    // ===== Register GSAP TextPlugin =====
    gsap.registerPlugin(TextPlugin);

    // ===== DOM References =====
    const openingScreen = document.getElementById('openingScreen');
    const openingCard = document.getElementById('openingCard');
    const slidesWrapper = document.getElementById('slidesWrapper');
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const navPrev = document.getElementById('navPrev');
    const navNext = document.getElementById('navNext');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const lyricsBar = document.getElementById('lyricsBar');
    const lyricsWords = document.getElementById('lyricsWords');
    const lyricsProgressBar = document.getElementById('lyricsProgressBar');
    const btnYes = document.getElementById('btnYes');
    const btnSuperYes = document.getElementById('btnSuperYes');
    const floatingHeartsContainer = document.getElementById('floatingHearts');

    let currentSlide = 0;
    let isTransitioning = false;
    let musicPlaying = false;

    // ===== Lyrics Data (parsed from SRT) =====
    const lyricsData = [
        { start: 0, end: 8, text: "Nhìn thấy anh vui em mãi nguyện rồi dù có đắng không muốn giọt lệ anh rơi" },
        { start: 8, end: 15, text: "Vì bấy lâu nay thiếu đi cảm giác có anh bầu bạn" },
        { start: 15, end: 22, text: "Chỉ mong anh sống với cuộc đời an yên nhiều khi trái tim ngỡ sấp đoạn trường" },
        { start: 22, end: 28, text: "Em vẫn cứ chấp niệm dù có đau đớn bám theo dấu chân em vẫn đứng trông anh giữa biển" },
        { start: 28, end: 36, text: "Em vẫn đứng trông anh giữa biển trời ngàn bạt ngàn mênh mông em sẽ dang tay bao bọc che chở thầm lặng" },
        { start: 36, end: 41, text: "Quan tâm và vỗ về nhân gian ráng tìm kiếm một ngày nắng ấm" },
        { start: 41, end: 48, text: "Em vốn bao dung nên đôi lòng chẳng để xúc cảm anh cứ dửng dưng" },
        { start: 48, end: 54, text: "Em còn ngờ lòng dành sự yêu thương hôn ước có lẽ ông trời định sẵn" },
        { start: 54, end: 100, text: "♪ ♫ ♪ ♫ ♪ ♫ ♪" },
        { start: 100, end: 105, text: "Biệt ly cách xa nhưng em vẫn nguyện vương mong anh vô điều kiện" },
        { start: 105, end: 112, text: "Nhiều khi trái tim ngửa sấp đoạn trường em vẫn cứ chấp niệm" },
        { start: 112, end: 118, text: "Em vẫn đứng trông anh giữa biển trời bạt ngàn mênh mông" },
        { start: 118, end: 124, text: "Quan tâm vỗ về nhân gian dù oán tìm kiếp một ngày nắng ấm" },
        { start: 124, end: 130, text: "Em vốn không nên đôi lần chẳng để cảm xúc anh cứ dửng dưng" },
        { start: 130, end: 137, text: "Em còn ngờ lòng dành sự yêu thương hôn ước có ông trời định sẵn" },
        { start: 137, end: 145, text: "Em vẫn đứng trông anh giữa biển trời bạt ngàn mênh mông" },
        { start: 145, end: 152, text: "Quan tâm vương vấn nhân gian dù ngoan tìm kiếm một ngày nắng ấm" },
        { start: 152, end: 157, text: "Em vốn đau dung nên đôi lần chẳng để tâm cảm xúc anh cứ dửng dưng" },
        { start: 157, end: 163, text: "Em còn ngờ lòng dành sự yêu thương" },
        { start: 163, end: 169, text: "Sao phải lụy ngọc buồn vương tình cảm cho anh" }
    ];

    // ===== Floating Hearts =====
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = ['♡', '♥', '❤', '💕', '💗', '✿', '❀', '🌸'][Math.floor(Math.random() * 8)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (0.6 + Math.random() * 1.2) + 'rem';
        floatingHeartsContainer.appendChild(heart);

        gsap.fromTo(heart,
            { y: window.innerHeight + 50, opacity: 0, rotation: Math.random() * 360 },
            {
                y: -100,
                opacity: gsap.utils.random(0.15, 0.4),
                rotation: '+=' + gsap.utils.random(-180, 180),
                duration: gsap.utils.random(8, 16),
                ease: 'none',
                onComplete: () => heart.remove()
            }
        );
    }

    setInterval(createFloatingHeart, 1200);
    for (let i = 0; i < 6; i++) setTimeout(createFloatingHeart, i * 300);

    // ===== Slide-Specific Background Decorations =====
    const slidesElements = document.querySelectorAll('.slide');
    const slideThemes = [
        ['💖', '💌', '✨', '💕', '💝', '🌹', '🎀', '🌸'], // Intro
        ['💻', '🎧', '⭐', '🎨', '🎵', '💫', '📚', '🧩'], // Profile
        ['🐱', '🍀', '☀️', '🌈', '😊', '🌸', '🧸', '🧁'], // Strengths
        ['👻', '🕷️', '☁️', '🌧️', '🥺', '💖', '🏚️', '🕸️'], // Fears
        ['🌍', '✈️', '💬', '🎈', '⭐', '💫', '🗺️', '🔔'], // Languages
        ['💍', '🔑', '🔒', '✨', '💐', '💕', '🧸', '💌']  // Commitments
    ];

    function initSlideDecorations() {
        slidesElements.forEach((slide, slideIdx) => {
            const decorContainer = document.createElement('div');
            decorContainer.className = 'slide-bg-decorations';
            slide.insertBefore(decorContainer, slide.firstChild);
            
            const icons = slideThemes[slideIdx] || slideThemes[0];
            
            // Create 8 drifting background icons per slide
            for (let i = 0; i < 8; i++) {
                const el = document.createElement('div');
                el.className = 'bg-decoration-item';
                el.textContent = icons[i % icons.length];
                decorContainer.appendChild(el);
                driftElementInSlide(el, slide);
            }
        });
    }

    function driftElementInSlide(el, slide) {
        // Find slide dimensions or default to window sizes
        const width = slide.offsetWidth || window.innerWidth;
        const height = slide.offsetHeight || window.innerHeight;
        
        const startX = gsap.utils.random(0, width);
        const startY = gsap.utils.random(0, height);
        
        gsap.set(el, {
            x: startX,
            y: startY,
            rotation: gsap.utils.random(0, 360),
            scale: gsap.utils.random(0.5, 1.2),
            opacity: 0
        });
        
        const duration = gsap.utils.random(15, 30);
        const targetX = startX + gsap.utils.random(-150, 150);
        const targetY = startY + gsap.utils.random(-150, 150);
        
        const tl = gsap.timeline({
            onComplete: () => driftElementInSlide(el, slide)
        });
        
        tl.to(el, {
            opacity: gsap.utils.random(0.04, 0.12),
            duration: duration * 0.2,
            ease: "sine.out"
        })
        .to(el, {
            x: targetX,
            y: targetY,
            rotation: "+=" + gsap.utils.random(-90, 90),
            duration: duration,
            ease: "none"
        }, 0)
        .to(el, {
            opacity: 0,
            duration: duration * 0.2,
            ease: "sine.in"
        }, duration * 0.8);
    }
    
    initSlideDecorations();

    // ===== Opening Screen — Modern Glass Card =====
    // Entrance animation for the card
    const openTl = gsap.timeline();
    openTl.fromTo(openingCard,
        { scale: 0.6, opacity: 0, y: 40, rotationY: -15 },
        { scale: 1, opacity: 1, y: 0, rotationY: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' }
    )
    .fromTo('.opening-heart-icon',
        { scale: 0, rotation: -30 },
        { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
        '-=0.6'
    )
    .fromTo('.opening-title',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
    )
    .fromTo('.opening-hint',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
    );

    // Click to open
    openingScreen.addEventListener('click', function (e) {
        // Ripple effect at click position
        const ripple = document.getElementById('openingRipple');
        const rect = openingCard.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';

        const closeTl = gsap.timeline();

        // Ripple burst
        closeTl.to(ripple, {
            scale: 30,
            opacity: 0.6,
            duration: 0.6,
            ease: 'power2.out'
        })
        // Card flies away
        .to(openingCard, {
            scale: 0.8,
            opacity: 0,
            y: -60,
            rotationX: 15,
            duration: 0.5,
            ease: 'power2.in'
        }, '-=0.3')
        // Fade screen
        .to(openingScreen, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                openingScreen.style.display = 'none';
                slidesWrapper.classList.add('active');
                // Activate first slide
                slides[0].classList.add('active');
                gsap.fromTo(slides[0],
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        onComplete: () => animateSlideContent(0)
                    }
                );
                playMusic();
                // Show lyrics bar after a short delay
                setTimeout(() => lyricsBar.classList.add('visible'), 1000);
            }
        });
    });

    // ===== Music Controls =====
    function playMusic() {
        backgroundMusic.volume = 0;
        backgroundMusic.play().then(() => {
            musicPlaying = true;
            gsap.to(backgroundMusic, { volume: 1, duration: 2, ease: 'power1.inOut' });
        }).catch(() => {
            musicPlaying = false;
        });
    }

    // ===== Slide Navigation =====
    function showSlide(index) {
        if (isTransitioning || index < 0 || index >= slides.length || index === currentSlide) return;
        isTransitioning = true;

        const prevSlide = slides[currentSlide];
        const nextSlide = slides[index];
        const direction = index > currentSlide ? 1 : -1;

        navDots.forEach(d => d.classList.remove('active'));
        navDots[index].classList.add('active');

        gsap.to(prevSlide, {
            opacity: 0,
            x: -80 * direction,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                prevSlide.classList.remove('active');
                prevSlide.style.transform = '';
            }
        });

        nextSlide.classList.add('active');
        gsap.fromTo(nextSlide,
            { opacity: 0, x: 80 * direction },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.15,
                onComplete: () => {
                    currentSlide = index;
                    isTransitioning = false;
                    animateSlideContent(index);
                }
            }
        );
    }

    function animateSlideContent(index) {
        const slide = slides[index];
        switch (index) {
            case 0: animateIntro(slide); break;
            case 1: animateProfile(slide); break;
            case 2: animateStrengths(slide); break;
            case 3: animateFears(slide); break;
            case 4: animateLanguages(slide); break;
            case 5: animateCommitments(slide); break;
        }
    }

    // ===== Slide Animations =====
    function animateIntro(slide) {
        const tl = gsap.timeline();
        tl.fromTo(slide.querySelector('.intro-sparkle'),
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
        )
        .fromTo(slide.querySelector('.intro-title'),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
            '-=0.3'
        )
        .fromTo(slide.querySelector('.intro-subtitle'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
        )
        .fromTo(slide.querySelector('.intro-divider'),
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo(slide.querySelector('.intro-poem'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo(slide.querySelector('.scroll-hint'),
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            '-=0.1'
        );
    }

    function animateProfile(slide) {
        const tl = gsap.timeline();
        tl.fromTo(slide.querySelector('.profile-img-wrapper'),
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.6)' }
        )
        .fromTo(slide.querySelector('.profile-name'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.3'
        )
        .fromTo(slide.querySelector('.profile-tagline'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo(slide.querySelector('.profile-quote'),
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.1'
        )
        .fromTo(slide.querySelectorAll('.info-item'),
            { x: 30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
            '-=0.2'
        );
    }

    function animateStrengths(slide) {
        const tl = gsap.timeline();
        tl.fromTo(slide.querySelector('.section-title'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo(slide.querySelector('.section-poem'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo(slide.querySelectorAll('.strength-card'),
            { rotationY: 90, scale: 0.8, opacity: 0 },
            { rotationY: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.2)' },
            '-=0.1'
        );
    }

    function animateFears(slide) {
        const tl = gsap.timeline();
        tl.fromTo(slide.querySelector('.section-title'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo(slide.querySelector('.section-poem'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo(slide.querySelectorAll('.fear-card'),
            { x: -80, rotation: -8, opacity: 0 },
            { x: 0, rotation: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
            '-=0.1'
        )
        .fromTo(slide.querySelector('.fear-special-card'),
            { scale: 0.6, y: 50, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.6)' },
            '-=0.2'
        );
    }

    function animateLanguages(slide) {
        const tl = gsap.timeline();
        tl.fromTo(slide.querySelector('.section-title'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo(slide.querySelector('.section-poem'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo(slide.querySelectorAll('.lang-card'),
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
            '-=0.1'
        );

        slide.querySelectorAll('.lang-fill').forEach(fill => {
            gsap.fromTo(fill,
                { width: "0%" },
                {
                    width: fill.dataset.width + '%',
                    duration: 1.5,
                    delay: 0.5,
                    ease: 'elastic.out(1, 0.75)'
                }
            );
        });
    }

    function animateCommitments(slide) {
        const tl = gsap.timeline();
        tl.fromTo(slide.querySelector('.section-title'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo(slide.querySelector('.section-poem'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo(slide.querySelectorAll('.commit-item'),
            { y: 80, scale: 0.9, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' },
            '-=0.1'
        );

        slide.querySelectorAll('.commit-number').forEach((num, i) => {
            gsap.fromTo(num,
                { scale: 0, rotation: -90 },
                { scale: 1, rotation: 0, duration: 0.5, delay: 0.5 + i * 0.1, ease: 'elastic.out(1.2, 0.6)' }
            );
        });

        const ctaSection = slide.querySelector('.cta-section');
        if (ctaSection) {
            gsap.fromTo(ctaSection,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 1, ease: 'power2.out' }
            );
            gsap.fromTo(slide.querySelectorAll('.cta-btn'),
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, stagger: 0.15, delay: 1.2, ease: 'back.out(2)' }
            );
        }
    }

    // ===== KARAOKE LYRICS — Word by Word with Jump Animation =====
    let lastLyricIndex = -1;
    let currentWordSpans = [];
    let wordAnimationTl = null;

    function renderLyricWords(text, lyricDuration) {
        // Kill any existing word animation
        if (wordAnimationTl) {
            wordAnimationTl.kill();
            wordAnimationTl = null;
        }

        // Clear existing words
        lyricsWords.innerHTML = '';
        currentWordSpans = [];

        const words = text.split(' ').filter(w => w.length > 0);
        const totalWords = words.length;

        // Create span for each word
        words.forEach((word) => {
            const span = document.createElement('span');
            span.className = 'lyric-word';
            span.textContent = word;
            lyricsWords.appendChild(span);
            currentWordSpans.push(span);
        });

        // Calculate timing: stagger words across the lyric duration
        // Leave some padding at end
        const usableDuration = lyricDuration * 0.85;
        const staggerDelay = totalWords > 1 ? usableDuration / totalWords : 0;

        // Create GSAP timeline for word-by-word karaoke animation
        wordAnimationTl = gsap.timeline();

        currentWordSpans.forEach((span, i) => {
            const delay = i * staggerDelay;

            // Each word: jump up, change color to active, then mark as done
            wordAnimationTl
                // Jump in: scale up + translate up + active color
                .fromTo(span,
                    {
                        opacity: 0.3,
                        y: 12,
                        scale: 0.7,
                    },
                    {
                        opacity: 1,
                        y: -6,
                        scale: 1.15,
                        duration: 0.18,
                        ease: 'back.out(2)',
                        onStart: () => {
                            span.classList.add('active');
                            span.classList.remove('done');
                        }
                    },
                    delay
                )
                // Settle back down
                .to(span, {
                    y: 0,
                    scale: 1,
                    duration: 0.15,
                    ease: 'power2.out',
                    onComplete: () => {
                        span.classList.remove('active');
                        span.classList.add('done');
                    }
                }, delay + 0.18);
        });
    }

    function updateLyrics() {
        if (!backgroundMusic || backgroundMusic.paused) {
            requestAnimationFrame(updateLyrics);
            return;
        }

        const currentTime = backgroundMusic.currentTime;
        const duration = backgroundMusic.duration || 1;

        // Update progress bar
        lyricsProgressBar.style.width = (currentTime / duration * 100) + '%';

        // Find current lyric
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].start && currentTime < lyricsData[i].end) {
                if (lastLyricIndex !== i) {
                    lastLyricIndex = i;
                    const lyricDuration = lyricsData[i].end - lyricsData[i].start;
                    renderLyricWords(lyricsData[i].text, lyricDuration);
                }
                break;
            }
        }

        requestAnimationFrame(updateLyrics);
    }

    // Start lyrics sync loop
    requestAnimationFrame(updateLyrics);

    // ===== Navigation Event Handlers =====
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = parseInt(dot.dataset.slide);
            if (target !== currentSlide) showSlide(target);
        });
    });

    navPrev.addEventListener('click', () => {
        if (currentSlide > 0) showSlide(currentSlide - 1);
    });

    navNext.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentSlide > 0) showSlide(currentSlide - 1);
        }
    });

    // Touch / Swipe navigation
    let touchStartY = 0;
    let touchStartX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const diffY = touchStartY - e.changedTouches[0].clientY;
        const diffX = touchStartX - e.changedTouches[0].clientX;

        // Only transition slides on vertical swipe (swipe up/down)
        // This avoids conflict with inner horizontal card scrolling carousels on mobile
        if (Math.abs(diffY) > Math.abs(diffX)) {
            if (Math.abs(diffY) > 60) {
                if (diffY > 0 && currentSlide < slides.length - 1) showSlide(currentSlide + 1);
                else if (diffY < 0 && currentSlide > 0) showSlide(currentSlide - 1);
            }
        }
    }, { passive: true });

    // Mouse wheel navigation
    let wheelTimeout = null;
    document.addEventListener('wheel', (e) => {
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 800);
        if (e.deltaY > 30 && currentSlide < slides.length - 1) showSlide(currentSlide + 1);
        else if (e.deltaY < -30 && currentSlide > 0) showSlide(currentSlide - 1);
    }, { passive: true });

    // ===== CTA Buttons =====
    function celebrateHearts(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.textContent = ['💕', '💖', '💗', '❤️', '💘', '✨', '🌟', '🎉'][Math.floor(Math.random() * 8)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.fontSize = (1.5 + Math.random() * 2) + 'rem';
                floatingHeartsContainer.appendChild(heart);

                gsap.fromTo(heart,
                    { y: window.innerHeight, opacity: 0 },
                    {
                        y: -200,
                        opacity: 1,
                        duration: gsap.utils.random(2, 4),
                        ease: 'power1.out',
                        onComplete: () => heart.remove()
                    }
                );
            }, i * 100);
        }
    }

    btnYes.addEventListener('click', () => {
        celebrateHearts(20);
        Swal.fire({
            title: '💕 Tuyệt vời!',
            html: `
                <p style="font-size: 1rem; line-height: 1.8; color: #6b7280;">
                    Em đã đồng ý! Từ giây phút này,<br>
                    anh hứa sẽ viết nên câu chuyện tình yêu<br>
                    đẹp nhất dành cho em. 💖
                </p>
            `,
            icon: 'success',
            confirmButtonText: 'Bắt đầu hành trình! ✨',
            customClass: { popup: 'swal2-popup' }
        });
    });

    btnSuperYes.addEventListener('click', () => {
        celebrateHearts(40);
        Swal.fire({
            title: '💖 Hạnh phúc quá!',
            html: `
                <p style="font-size: 1rem; line-height: 1.8; color: #6b7280;">
                    Em rất đồng ý! Trái tim anh đang bay lên tận trời!<br>
                    Cảm ơn em đã cho anh cơ hội<br>
                    được yêu thương và bảo vệ em. 🌸💍
                </p>
            `,
            icon: 'success',
            confirmButtonText: 'Yêu thương mãi mãi! 💕',
            customClass: { popup: 'swal2-popup' }
        });
    });
});

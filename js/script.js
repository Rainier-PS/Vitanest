    'use strict';

    const MARQUEE_WORDS = [
      'AI Pose Detection', 'Cognitive Training', 'Smart Hardware', 'Elderly Wellness',
      'Machine Learning', 'Fall Prevention', 'Arduino Uno', 'PictoBlox', 'Reaction Games'
    ];

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    gsap.defaults({ overwrite: 'auto', force3D: true });
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
    });

    const storedCursor = localStorage.getItem('customCursor') === 'true';
    if (storedCursor) document.body.classList.add('custom-cursor-enabled');

    const reduceMotion = localStorage.getItem('disableAnimations') === 'true';
    if (reduceMotion) document.body.classList.add('reduce-motion');

    const $cursor = document.getElementById('cursor');
    const $ring = document.getElementById('cursor-ring');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && $cursor && $ring) {
      let mx = -200, my = -200, rx = -200, ry = -200;
      gsap.set([$cursor, $ring], { xPercent: -50, yPercent: -50 });

      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

      (function loop() {
        const cursorEnabled = document.body.classList.contains('custom-cursor-enabled');
        if (cursorEnabled) {
          rx += (mx - rx) * 0.12;
          ry += (my - ry) * 0.12;
          gsap.set($cursor, { x: mx, y: my });
          gsap.set($ring, { x: rx, y: ry });
        }
        requestAnimationFrame(loop);
      })();

      document.querySelectorAll('a, button, .project-card, .expertise-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
      });
    }

    const $html = document.documentElement;
    const $toggle = document.getElementById('themeToggle');
    $html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

    $toggle.addEventListener('click', (e) => {
      const next = $html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

      if (!document.startViewTransition) {
        $html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        return;
      }

      const x = e.clientX || window.innerWidth / 2;
      const y = e.clientY || 40;
      const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

      const transition = document.startViewTransition(() => {
        $html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 650,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    });

    const $nav = document.getElementById('navbar');
    let ticking = false;

    const NAV_SCROLL_BREAKPOINT_PX = 768;

    function updateNavScrolled() {
      const isMobileNav = window.innerWidth <= NAV_SCROLL_BREAKPOINT_PX;
      $nav.classList.toggle('scrolled', !isMobileNav && window.scrollY > 60);
      $nav.dataset.mobile = isMobileNav ? 'true' : 'false';
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateNavScrolled();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateNavScrolled, { passive: true });
    updateNavScrolled();

    const sections = document.querySelectorAll('section[id]');
    const navAs = document.querySelectorAll('.nav-links a');

    const activateLink = () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) current = s.id;
      });
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    };
    window.addEventListener('scroll', activateLink, { passive: true });
    activateLink();

    const $menuBtn = document.getElementById('menuBtn');
    $menuBtn.addEventListener('click', () => {
      const open = $nav.classList.toggle('menu-open');
      $menuBtn.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', (e) => {
      if ($nav.classList.contains('menu-open') && !e.target.closest('#navbar')) {
        $nav.classList.remove('menu-open');
        $menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $nav.classList.contains('menu-open')) {
        $nav.classList.remove('menu-open');
        $menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => {
        $nav.classList.remove('menu-open');
        $menuBtn.setAttribute('aria-expanded', 'false');
      })
    );

    function updateScrollbar() {
      const scrolled = window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty('--sb-stop', (scrolled * 100) + '%');
    }
    window.addEventListener('scroll', updateScrollbar, { passive: true });
    updateScrollbar();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
    tl.to('#heroLabel', { opacity: 1, y: 0, duration: 0.65 })
      .to('#heroTitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.35')
      .to('#heroSubWrap', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('#heroBody', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
      .to('#heroLinks', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45');

    const orbs = document.querySelectorAll('.gradient-orb');

    if (!isTouchDevice) {
      const orbSetters = [...orbs].map((orb) => ({
        xTo: gsap.quickTo(orb, 'x', { duration: 0.6, ease: 'power2.out' }),
        yTo: gsap.quickTo(orb, 'y', { duration: 0.6, ease: 'power2.out' }),
      }));
      document.addEventListener('mousemove', e => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        orbSetters.forEach((setters, i) => {
          const spd = (i + 1) * 22;
          setters.xTo(x * spd);
          setters.yTo(y * spd);
        });
      }, { passive: true });
    }

    gsap.utils.toArray('.gradient-orb').forEach((orb, i) => {
      gsap.to(orb, {
        y: i % 2 === 0 ? 180 : -180,
        scrollTrigger: {
          trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1
        }
      });
    });

    function buildMarquee(id) {
      const track = document.getElementById(id);
      const words = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
      words.forEach(word => {
        const item = document.createElement('span');
        item.className = 'marquee-item';
        item.innerHTML = word + '<span class="marquee-dot"></span>';
        track.appendChild(item);
      });
    }
    buildMarquee('marqueeA');
    buildMarquee('marqueeB');

    function initMarquee() {
      const tA = document.getElementById('marqueeA');
      const tB = document.getElementById('marqueeB');
      const w = tA.offsetWidth;
      gsap.set(tB, { x: w });
      const dur = w / 90;
      gsap.to(tA, {
        x: -w, duration: dur, ease: 'linear', repeat: -1,
        onRepeat: () => gsap.set(tA, { x: 0 })
      });
      gsap.to(tB, {
        x: 0, duration: dur, ease: 'linear', repeat: -1,
        onRepeat: () => gsap.set(tB, { x: w })
      });
    }
    window.addEventListener('load', () => setTimeout(initMarquee, 80));

    function splitTextToSpans(selector) {
      document.querySelectorAll(selector).forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        text.split('').forEach(char => {
          if (char === '\n') {
            el.appendChild(document.createElement('br'));
            return;
          }
          const span = document.createElement('span');
          span.className = 'char';
          span.innerHTML = char === ' ' ? '&nbsp;' : char;
          el.appendChild(span);
        });
      });
    }

    splitTextToSpans('.section-title, .cta-title');

    gsap.utils.toArray('.section-title, .cta-title').forEach(title => {
      gsap.from(title.querySelectorAll('.char'), {
        scrollTrigger: { trigger: title, start: 'top 95%', end: 'top 80%', scrub: 1 },
        y: 80,
        opacity: 0,
        scale: 0.5,
        rotationX: -90,
        stagger: 0.05,
        ease: 'back.out(1.5)'
      });
    });

    gsap.from('#about .about-theme-card p', {
      scrollTrigger: { trigger: '#about .about-theme-card', start: 'top 100%', end: 'top 62%', scrub: 1 },
      y: 72,
      scale: 0.98,
      opacity: 0.1,
      stagger: 0.12,
    });

    if (!reduceMotion) {
      const innovationGrid = document.getElementById('innovationGrid');
      if (innovationGrid) {
        gsap.utils.toArray('.innovation-card').forEach((card, i) => {
          const fromLeft = i === 0;

          gsap.fromTo(card, {
            y: 56,
            x: fromLeft ? -40 : 40,
            opacity: 0.12,
            rotateY: fromLeft ? 8 : -8,
            scale: 0.98,
          }, {
            y: 0,
            x: 0,
            opacity: 1,
            rotateY: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
              end: 'top 58%',
              scrub: 1.15,
            },
          });

          const glow = card.querySelector('.innovation-glow');
          if (glow) {
            gsap.to(glow, {
              x: fromLeft ? 18 : -16,
              y: fromLeft ? -10 : 12,
              scale: 1.1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
            });
          }
        });

        gsap.from('.innovation-card .innovation-pane-icon', {
          scrollTrigger: {
            trigger: innovationGrid,
            start: 'top 88%',
            end: 'top 52%',
            scrub: 1,
          },
          scale: 0.6,
          rotate: -14,
          opacity: 0,
          stagger: 0.14,
        });

        gsap.from('.innovation-card .innovation-pane-body', {
          scrollTrigger: {
            trigger: innovationGrid,
            start: 'top 84%',
            end: 'top 48%',
            scrub: 1,
          },
          y: 28,
          opacity: 0.1,
          stagger: 0.1,
        });
      }
    } else {
      gsap.set('#innovationGrid, .innovation-card, .innovation-glow', { clearProps: 'all' });
    }

    if (!reduceMotion) {
      document.querySelectorAll('.ps-motion').forEach((row, idx) => {
        const phaseProblem = row.classList.contains('ps-motion-problem');
        const copy = row.querySelector('.ps-copy');
        const media = row.querySelector('.ps-media');

        const twist = idx % 2 === 0 ? 8 : -8;
        const floatY = phaseProblem ? 28 + (idx % 3) * 6 : 22 + (idx % 2) * 8;

        if (copy) {
          gsap.fromTo(copy, {
            x: phaseProblem ? -90 : 92,
            y: floatY,
            rotateY: (phaseProblem ? -1 : 1) * twist,
            scale: phaseProblem ? 0.94 : 0.93,
            opacity: 0.08,
          }, {
            x: 0,
            y: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 92%',
              end: 'top 52%',
              scrub: 1.15,
            },
          });
        }

        if (media) {
          gsap.fromTo(media, {
            x: phaseProblem ? 88 : -88,
            y: phaseProblem ? -18 : 20,
            rotateY: phaseProblem ? twist * -0.85 : twist * 0.85,
            scale: phaseProblem ? 0.84 : 0.86,
            opacity: 0.06,
          }, {
            x: 0,
            y: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 92%',
              end: 'top 52%',
              scrub: 1.15,
            },
          });
        }
      });

      gsap.utils.toArray('.ps-stage').forEach((stage, si) => {
        gsap.fromTo(stage, {
          y: si % 2 === 0 ? 48 : 36,
          rotateZ: si % 2 === 0 ? -0.4 : 0.35,
        }, {
          y: 0,
          rotateZ: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'top 98%',
            end: 'center 72%',
            scrub: 1.2,
          },
        });
      });
    }

    if (!reduceMotion) {
      const sdgWrap = document.getElementById('sdgShowcase');
      if (sdgWrap) {
        gsap.fromTo(sdgWrap, {
          y: 80,
          opacity: 0.18,
          rotateX: 6,
          scale: 0.985,
        }, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sdgWrap,
            start: 'top 94%',
            end: 'top 54%',
            scrub: 1.2,
          }
        });

        gsap.to('.sdg-orbit-left', {
          rotation: 220,
          x: 26,
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: sdgWrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          }
        });

        gsap.to('.sdg-orbit-right', {
          rotation: -200,
          x: -22,
          y: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sdgWrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          }
        });

        gsap.utils.toArray('.sdg-pillar').forEach((pillar, i) => {
          gsap.fromTo(pillar, {
            y: 68 + (i * 10),
            opacity: 0.1,
            rotateY: i === 1 ? 0 : (i % 2 === 0 ? -14 : 14),
          }, {
            y: 0,
            opacity: 1,
            rotateY: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sdgWrap,
              start: 'top 82%',
              end: 'top 42%',
              scrub: 1.1,
            }
          });
        });
      }
    } else {
      gsap.set('.sdg-showcase, .sdg-pillar', { clearProps: 'all' });
    }
    gsap.from('.accordion-item', {
      scrollTrigger: { trigger: '#ecoAccordion', start: 'top 100%', end: 'top 50%', scrub: 1 },
      x: 100, opacity: 0, stagger: 0.1
    });

    gsap.from('#ecoPreview', {
      scrollTrigger: { trigger: '#ecoPreview', start: 'top 95%', end: 'top 50%', scrub: 1 },
      scale: 0.5, opacity: 0, rotationY: 45
    });

    gsap.to('#timelineProgress', {
      scrollTrigger: { trigger: '#timelineContainer', start: 'top 60%', end: 'bottom 60%', scrub: 1 },
      scaleY: 1, ease: 'none'
    });

    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 95%', end: 'top 60%', scrub: 1 },
        x: i % 2 === 0 ? -100 : 100, opacity: 0
      });

      gsap.to(item.querySelector('.timeline-marker'), {
        scrollTrigger: {
          trigger: item,
          start: 'top 60%',
          toggleClass: 'active',
        }
      });
    });

    gsap.utils.toArray('.team-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 55%', scrub: 1 },
        y: 64 + (i % 2) * 8,
        opacity: 0.12,
        scale: 0.96,
      });
    });

    gsap.from('.media-card', {
      scrollTrigger: { trigger: '.media-grid', start: 'top 100%', end: 'top 50%', scrub: 1 },
      y: 100, scale: 0.8, opacity: 0, stagger: 0.2
    });

    gsap.utils.toArray('.section-label, .section-sub').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 70%', scrub: 1 },
        y: 40, opacity: 0
      });
    });

    let ctaTl = gsap.timeline({
      scrollTrigger: { trigger: '.cta-box', start: 'top 95%', end: 'top 65%', scrub: 1 }
    });
    ctaTl.fromTo('.cta-box', { scale: 0.8, y: 60, opacity: 0 }, { scale: 1.02, y: -5, opacity: 1, duration: 0.7 })
      .to('.cta-box', { scale: 1, y: 0, duration: 0.3 });

    const accItems = document.querySelectorAll('.accordion-item');
    const accContents = document.querySelectorAll('.accordion-content');
    const previews = document.querySelectorAll('.ecosystem-preview-fallback');

    accItems.forEach((item) => {
      const header = item.querySelector('.accordion-header');
      header.addEventListener('click', () => {
        const index = item.getAttribute('data-index');
        const isActive = item.classList.contains('active');

        accItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        });
        accContents.forEach(c => {
          c.style.maxHeight = null;
        });
        previews.forEach(p => p.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
          const content = item.querySelector('.accordion-content');
          content.style.maxHeight = content.scrollHeight + "px";
          previews[index].classList.add('active');
        } else {
          previews[0].classList.add('active');
        }
      });
    });

    const updateFirstAcc = () => {
      const activeObj = document.querySelector('.accordion-item.active .accordion-content');
      if (activeObj) activeObj.style.maxHeight = activeObj.scrollHeight + "px";
    }
    window.addEventListener('load', updateFirstAcc);
    window.addEventListener('resize', updateFirstAcc);

    gsap.to('#about .about-text', {
      y: -40,
      scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });

    window.showToast = function (msg, type = 'info') {
      const toast = document.createElement('div');
      toast.className = 'toast';
      const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' };
      toast.innerHTML = `<span>${msg}</span><div class="toast-bar ${type}"></div>`;
      document.body.appendChild(toast);

      const mob = window.innerWidth < 768;
      gsap.from(toast, { opacity: 0, yPercent: mob ? -120 : 120, duration: 0.5, ease: 'back.out(1.7)' });
      gsap.to(toast.querySelector('.toast-bar'), { width: 0, duration: 2.8, ease: 'linear' });
      setTimeout(() => {
        gsap.to(toast, {
          opacity: 0, yPercent: mob ? -120 : 120, duration: 0.4, ease: 'back.in(1.7)',
          onComplete: () => toast.remove()
        });
      }, 2800);
    };

    const $settingsOverlay = document.getElementById('settingsOverlay');
    const $settingsBackdrop = document.getElementById('settingsBackdrop');
    const $settingsClose = document.getElementById('settingsClose');
    const $cursorToggle = document.getElementById('cursorToggle');
    const $animationToggle = document.getElementById('animationToggle');

    $cursorToggle.checked = storedCursor;
    $animationToggle.checked = reduceMotion;

    const openSettings = () => {
      $settingsOverlay.classList.add('open');
      $settingsOverlay.setAttribute('aria-hidden', 'false');
    };
    const closeSettings = () => {
      $settingsOverlay.classList.remove('open');
      $settingsOverlay.setAttribute('aria-hidden', 'true');
    };

    $settingsBackdrop.addEventListener('click', closeSettings);
    $settingsClose.addEventListener('click', closeSettings);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $settingsOverlay.classList.contains('open')) {
        closeSettings();
      }
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        $settingsOverlay.classList.contains('open') ? closeSettings() : openSettings();
      }
    });

    $cursorToggle.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      localStorage.setItem('customCursor', enabled);
      if (enabled) {
        document.body.classList.add('custom-cursor-enabled');
      } else {
        document.body.classList.remove('custom-cursor-enabled');
      }
    });

    $animationToggle.addEventListener('change', (e) => {
      const disabled = e.target.checked;
      localStorage.setItem('disableAnimations', disabled);
      if (disabled) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
    });

    const $lightbox = document.createElement('div');
    $lightbox.id = 'lightbox';
    $lightbox.className = 'lightbox-overlay';
    $lightbox.setAttribute('aria-hidden', 'true');
    $lightbox.innerHTML = '<img id="lightbox-img" src="" alt="">';
    document.body.appendChild($lightbox);

    const $lightboxImg = document.getElementById('lightbox-img');

    document.querySelectorAll('img').forEach(img => {
      if (img.alt.includes('Logo')) {
      } else {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          $lightboxImg.src = img.src;
          $lightboxImg.alt = img.alt;
          $lightbox.classList.add('active');
          $lightbox.setAttribute('aria-hidden', 'false');
        });
      }
    });

    $lightbox.addEventListener('click', () => {
      $lightbox.classList.remove('active');
      $lightbox.setAttribute('aria-hidden', 'true');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $lightbox.classList.contains('active')) {
        $lightbox.classList.remove('active');
        $lightbox.setAttribute('aria-hidden', 'true');
      }
    });

    document.querySelectorAll('#navbar .nav-links li a').forEach(a => {
      a.addEventListener('mousemove', e => {
        const rect = a.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        a.style.setProperty('--x', `${x}px`);
        a.style.setProperty('--y', `${y}px`);
      });
    });

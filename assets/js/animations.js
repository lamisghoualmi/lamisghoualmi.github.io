/* =========================================================
   PREMIUM ANIMATIONS — Lamis GHOUALMI Portfolio
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initSectionParticles();
    initScrollObserver();
    initSkillsBadges();
    initTimeline();
    initIntroLoop();
    initExploreBtn();
});

function initExploreBtn() {
    var btn = document.getElementById('explore-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById('skills');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}


/* =========================================================
   1. PARTICLES CANVAS
   ========================================================= */
function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT  = 90;
    var CONNECTION_DIST = 220;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function makeParticle() {
        return {
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r:  Math.random() * 1.8 + 0.6,
            a:  Math.random() * 0.55 + 0.3
        };
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx   = particles[i].x - particles[j].x;
                var dy   = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    var alpha = (1 - dist / CONNECTION_DIST) * 0.55;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0,212,255,' + alpha + ')';
                    ctx.lineWidth   = 0.7;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,212,255,' + p.a + ')';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}


/* =========================================================
   2. SECTION-LOCAL PARTICLE NETWORKS
      Each target section (#top, #skills, #about) gets its own
      canvas rendered below the content at z-index: 0
   ========================================================= */
function initSectionParticles() {
    var canvases = document.querySelectorAll('.section-particles');
    canvases.forEach(function (canvas) {
        runSectionCanvas(canvas);
    });
}

function runSectionCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var COUNT = 65;
    var DIST  = 200;

    function resize() {
        var section   = canvas.parentElement;
        canvas.width  = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', function () {
        resize();
        // Re-clamp particles that are now out of bounds
        particles.forEach(function (p) {
            if (p.x > canvas.width)  p.x = canvas.width;
            if (p.y > canvas.height) p.y = canvas.height;
        });
    });

    for (var i = 0; i < COUNT; i++) {
        particles.push({
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r:  Math.random() * 1.6 + 0.5,
            a:  Math.random() * 0.5 + 0.25
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Connections
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var d  = Math.sqrt(dx * dx + dy * dy);
                if (d < DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0,212,255,' + (1 - d / DIST) * 0.5 + ')';
                    ctx.lineWidth   = 0.7;
                    ctx.stroke();
                }
            }
        }

        // Dots
        particles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,212,255,' + p.a + ')';
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }
    draw();
}


/* =========================================================
   3. INTRO — LOOPING SLIDE-IN + TYPEWRITER
      Resets every time the section scrolls out, retypes on re-entry
   ========================================================= */

var twCancel  = false;
var twRunning = false;

function initIntroLoop() {
    var section = document.getElementById('top');
    if (!section) return;

    if (!window.IntersectionObserver) {
        // Fallback: run once
        setTimeout(triggerIntro, 400);
        return;
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                triggerIntro();
            } else {
                resetIntro();
            }
        });
    }, { threshold: 0.35 });

    obs.observe(section);
}

function resetIntro() {
    twCancel  = true;
    twRunning = false;
    var headline = document.getElementById('intro-headline');
    var twEl     = document.getElementById('typewriter-text');
    if (headline) headline.classList.remove('visible');
    if (twEl)     twEl.innerHTML = '';
}

function triggerIntro() {
    if (twRunning) return;
    twCancel  = false;
    twRunning = true;

    var headline = document.getElementById('intro-headline');
    var twEl     = document.getElementById('typewriter-text');
    if (!headline) return;

    setTimeout(function () {
        if (twCancel) return;
        headline.classList.add('visible');

        if (twEl) {
            setTimeout(function () {
                if (twCancel) return;
                runTypewriter(twEl);
            }, 750);
        }
    }, 300);
}

function runTypewriter(el) {
    var lines = [
        'AI \u0026 ML Solutions Engineer  |  Microsoft Fabric \u00b7 Microsoft Foundry \u00b7 Power BI',
        'Agentic AI \u0026 Data Workflows  |  Scalable Analytics Systems',
        'IEEE \u00b7 Elsevier \u00b7 Springer Published  |  Conference Speaker'
    ];

    var lineIdx = 0;
    var charIdx = 0;
    var built   = '';

    el.innerHTML = '';

    function tick() {
        if (twCancel) { el.innerHTML = ''; return; }

        if (lineIdx >= lines.length) {
            // Typing done — blink cursor 2 s then fade it out
            var cursor = el.querySelector('.tw-cursor');
            if (cursor) {
                setTimeout(function () {
                    if (twCancel) return;
                    cursor.style.transition = 'opacity 0.6s';
                    cursor.style.opacity    = '0';
                    setTimeout(function () {
                        if (cursor.parentNode) cursor.remove();
                        twRunning = false;
                    }, 700);
                }, 2000);
            }
            return;
        }

        var line = lines[lineIdx];

        if (charIdx < line.length) {
            built += line[charIdx];
            charIdx++;
            el.innerHTML = built + '<span class="tw-cursor"></span>';
            setTimeout(tick, 26);
        } else {
            lineIdx++;
            charIdx = 0;
            if (lineIdx < lines.length) built += '<br />';
            setTimeout(tick, 80);
        }
    }

    tick();
}


/* =========================================================
   4. SCROLL FADE-IN (sections)
   ========================================================= */
function initScrollObserver() {
    var els = document.querySelectorAll('.fade-in-section');
    if (!els.length || !window.IntersectionObserver) {
        els.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach(function (el) { obs.observe(el); });
}


/* =========================================================
   5. SKILLS BADGE / ICON BOUNCE
   ========================================================= */
function initSkillsBadges() {
    // Support both old .skill-badge (Teaching.html) and new .skill-item (index.html)
    var grids = document.querySelectorAll('.skills-grid');
    if (!grids.length) return;

    function bounceIn(grid) {
        var items = grid.querySelectorAll('.skill-badge, .skill-item');
        if (!window.IntersectionObserver) {
            items.forEach(function (el) { el.classList.add('bounced-in'); });
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var els = entry.target.querySelectorAll('.skill-badge, .skill-item');
                    els.forEach(function (el, i) {
                        setTimeout(function () { el.classList.add('bounced-in'); }, i * 65);
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        obs.observe(grid);
    }

    grids.forEach(bounceIn);
}


/* =========================================================
   6. TIMELINE SLIDE-IN
   ========================================================= */
function initTimeline() {
    var items = document.querySelectorAll('.timeline-item');
    if (!items.length || !window.IntersectionObserver) {
        items.forEach(function (item) { item.classList.add('slide-in'); });
        return;
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
                setTimeout(function () {
                    entry.target.classList.add('slide-in');
                }, delay);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    items.forEach(function (item, i) {
        item.setAttribute('data-delay', i * 120);
        obs.observe(item);
    });
}

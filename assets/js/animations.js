/* =========================================================
   PREMIUM ANIMATIONS — Lamis GHOUALMI Portfolio
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initScrollObserver();
    initSkillsBadges();
    initTimeline();
    // Intro animations fire after main.js removes is-preload
    window.addEventListener('load', function () {
        setTimeout(initIntroAnimation, 200);
    });
});


/* =========================================================
   1. PARTICLES CANVAS
   ========================================================= */
function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 55;
    var CONNECTION_DIST = 130;

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
            vx: (Math.random() - 0.5) * 0.38,
            vy: (Math.random() - 0.5) * 0.38,
            r:  Math.random() * 1.4 + 0.4,
            a:  Math.random() * 0.45 + 0.15
        };
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(makeParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections first
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx   = particles[i].x - particles[j].x;
                var dy   = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    var alpha = (1 - dist / CONNECTION_DIST) * 0.28;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0,212,255,' + alpha + ')';
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw dots
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
   2. INTRO: NAME SLIDE-IN + TYPEWRITER
   ========================================================= */
function initIntroAnimation() {
    var headline     = document.getElementById('intro-headline');
    var typewriterEl = document.getElementById('typewriter-text');

    if (headline) {
        setTimeout(function () {
            headline.classList.add('visible');
            if (typewriterEl) {
                setTimeout(function () {
                    runTypewriter(typewriterEl);
                }, 750);
            }
        }, 300);
    }
}

function runTypewriter(el) {
    var lines = [
        'AI \u0026 ML Solutions Engineer  |  Microsoft Fabric \u00b7 Azure OpenAI \u00b7 Power BI',
        'Agentic AI \u0026 Data Workflows  |  Scalable Analytics Systems',
        'IEEE \u00b7 Elsevier \u00b7 Springer Published  |  Conference Speaker'
    ];

    var lineIdx = 0;
    var charIdx = 0;
    var built   = '';

    el.innerHTML = '';

    function tick() {
        if (lineIdx >= lines.length) {
            // finished — keep cursor for 2 s then fade it
            var lastCursor = el.querySelector('.tw-cursor');
            if (lastCursor) {
                setTimeout(function () {
                    lastCursor.style.transition = 'opacity 0.6s';
                    lastCursor.style.opacity = '0';
                    setTimeout(function () { lastCursor.remove(); }, 700);
                }, 2000);
            }
            return;
        }

        var line = lines[lineIdx];

        if (charIdx < line.length) {
            built   += line[charIdx];
            charIdx++;
            el.innerHTML = built + '<span class="tw-cursor"></span>';
            setTimeout(tick, 26);
        } else {
            lineIdx++;
            charIdx = 0;
            if (lineIdx < lines.length) {
                built += '<br />';
            }
            setTimeout(tick, 80);
        }
    }

    tick();
}


/* =========================================================
   3. SCROLL FADE-IN (sections)
   ========================================================= */
function initScrollObserver() {
    var els = document.querySelectorAll('.fade-in-section');
    if (!els.length || !window.IntersectionObserver) {
        // Fallback: make everything visible
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
   4. SKILLS BADGE BOUNCE
   ========================================================= */
function initSkillsBadges() {
    var grid = document.querySelector('.skills-grid');
    if (!grid || !window.IntersectionObserver) {
        if (grid) grid.querySelectorAll('.skill-badge').forEach(function (b) {
            b.classList.add('bounced-in');
        });
        return;
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var badges = entry.target.querySelectorAll('.skill-badge');
                badges.forEach(function (badge, i) {
                    setTimeout(function () {
                        badge.classList.add('bounced-in');
                    }, i * 70);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    obs.observe(grid);
}


/* =========================================================
   5. TIMELINE SLIDE-IN
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

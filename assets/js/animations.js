/* =========================================================
   PREMIUM ANIMATIONS — Lamis GHOUALMI Portfolio
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    initLoadingScreen();
    initParticles();
    initSectionParticles();
    initScrollObserver();
    initSkillsBadges();
    initTimeline();
    initIntroLoop();
    initStatsCounters();
    initPublications();
    initCursorTrail();
});


/* =========================================================
   0. LOADING SCREEN
   ========================================================= */
function initLoadingScreen() {
    var screen = document.getElementById('loading-screen');
    if (!screen) return;

    function hideScreen() {
        setTimeout(function () {
            screen.classList.add('loaded');
            setTimeout(function () { screen.style.display = 'none'; }, 550);
        }, 1000);
    }

    if (document.readyState === 'complete') {
        hideScreen();
    } else {
        window.addEventListener('load', hideScreen);
    }
}


/* =========================================================
   1. PARTICLES CANVAS — mouse repel + color variation + depth
   ========================================================= */
function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT  = 90;
    var CONNECTION_DIST = 220;
    var REPEL_RADIUS    = 130;
    var mouse = { x: -9999, y: -9999 };

    // Color palette: 0=cyan, 1=purple, 2=blue
    var colors = [
        [0, 212, 255],
        [168, 85, 247],
        [56, 139, 253]
    ];

    window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', function () {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function makeParticle() {
        var z     = Math.random();           // depth: 0=far, 1=near
        var col   = Math.floor(Math.random() * 3);
        var speed = 0.18 + z * 0.28;
        return {
            x:   Math.random() * canvas.width,
            y:   Math.random() * canvas.height,
            vx:  (Math.random() - 0.5) * speed * 2,
            vy:  (Math.random() - 0.5) * speed * 2,
            r:   0.5 + z * 2.0,
            a:   0.2 + z * 0.6,
            z:   z,
            col: col
        };
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Connections
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx   = particles[i].x - particles[j].x;
                var dy   = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    var alpha = (1 - dist / CONNECTION_DIST) * 0.35;
                    var c1 = colors[particles[i].col];
                    var c2 = colors[particles[j].col];
                    var r  = Math.round((c1[0] + c2[0]) / 2);
                    var g  = Math.round((c1[1] + c2[1]) / 2);
                    var b  = Math.round((c1[2] + c2[2]) / 2);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
                    ctx.lineWidth   = 0.6;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(function (p) {
            // Mouse repel
            var mdx = p.x - mouse.x;
            var mdy = p.y - mouse.y;
            var md  = Math.sqrt(mdx * mdx + mdy * mdy);
            if (md < REPEL_RADIUS && md > 0) {
                var force = (REPEL_RADIUS - md) / REPEL_RADIUS * 0.8;
                p.vx += (mdx / md) * force * 0.5;
                p.vy += (mdy / md) * force * 0.5;
                p.vx *= 0.96;
                p.vy *= 0.96;
            }

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;

            var c = colors[p.col];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + p.a + ')';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}


/* =========================================================
   2. SECTION-LOCAL PARTICLE NETWORKS
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

        particles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;
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
   3. INTRO — CYCLING TYPEWRITER WITH DELETE EFFECT
   ========================================================= */

var twCancel  = false;
var twRunning = false;

function initIntroLoop() {
    var section = document.getElementById('top');
    if (!section) return;

    if (!window.IntersectionObserver) {
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
    var titles = [
        'AI \u0026 ML Solutions Engineer',
        'Data Engineering Architect',
        'Agentic AI Builder',
        'IEEE \u00b7 Elsevier \u00b7 Springer Researcher'
    ];

    var titleIdx   = 0;
    var charIdx    = 0;
    var isDeleting = false;

    el.innerHTML = '';

    function tick() {
        if (twCancel) { el.innerHTML = ''; return; }

        var current = titles[titleIdx];

        if (!isDeleting) {
            charIdx++;
            el.innerHTML = current.substring(0, charIdx) + '<span class="tw-cursor"></span>';

            if (charIdx === current.length) {
                isDeleting = true;
                setTimeout(tick, 1800);
            } else {
                setTimeout(tick, 55);
            }
        } else {
            charIdx--;
            el.innerHTML = current.substring(0, charIdx) + '<span class="tw-cursor"></span>';

            if (charIdx === 0) {
                isDeleting = false;
                titleIdx   = (titleIdx + 1) % titles.length;
                setTimeout(tick, 380);
            } else {
                setTimeout(tick, 28);
            }
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


/* =========================================================
   7. STATS COUNTERS
   ========================================================= */
function initStatsCounters() {
    var items = document.querySelectorAll('.stat-item');
    if (!items.length) return;

    if (!window.IntersectionObserver) {
        items.forEach(animateCounter);
        return;
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    items.forEach(function (item) { obs.observe(item); });
}

function animateCounter(item) {
    var target   = parseInt(item.getAttribute('data-target') || '0', 10);
    var suffix   = item.getAttribute('data-suffix') || '';
    var el       = item.querySelector('.stat-number');
    if (!el) return;

    var duration = 1600;
    var startTime = null;

    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed  = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        var eased   = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target + suffix;
        }
    }

    requestAnimationFrame(update);
}


/* =========================================================
   8. PUBLICATIONS CARD REVEAL
   ========================================================= */
function initPublications() {
    var cards = document.querySelectorAll('.pub-card');
    if (!cards.length) return;

    if (!window.IntersectionObserver) {
        cards.forEach(function (c) { c.classList.add('revealed'); });
        return;
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var idx = Array.prototype.indexOf.call(cards, entry.target);
                var delay = idx * 150;
                setTimeout(function () { entry.target.classList.add('revealed'); }, delay);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(function (c) { obs.observe(c); });
}


/* =========================================================
   9. CURSOR TRAIL
   ========================================================= */
function initCursorTrail() {
    var canvas = document.getElementById('cursor-trail-canvas');
    if (!canvas) return;

    // Skip on touch-only devices
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) return;

    var ctx   = canvas.getContext('2d');
    var trail = [];

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', function () {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', function (e) {
        trail.push({ x: e.clientX, y: e.clientY });
        if (trail.length > 24) trail.shift();
    });

    function drawTrail() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (trail.length > 1) {
            for (var i = 1; i < trail.length; i++) {
                var frac = i / trail.length;
                ctx.beginPath();
                ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
                ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = 'rgba(0,212,255,' + (frac * 0.4) + ')';
                ctx.lineWidth   = frac * 2.2;
                ctx.lineCap     = 'round';
                ctx.stroke();
            }
        }
        requestAnimationFrame(drawTrail);
    }
    drawTrail();
}

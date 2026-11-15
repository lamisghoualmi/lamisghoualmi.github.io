/* =========================================================
   PREMIUM ANIMATIONS — Lamis GHOUALMI Portfolio
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    // Particle networks retired in favour of the CSS dot-grid + cursor light
    // (initParticles / initSectionParticles are kept below but no longer started).
    splitHeadline();
    initScrollObserver();
    initSkillsBadges();
    initTimeline();
    initIntroLoop();
    initExploreBtn();
});

/* Wrap each headline word in a span so CSS can reveal them one by one */
function splitHeadline() {
    var h = document.getElementById('intro-headline');
    if (!h || h.querySelector('.w')) return;
    var words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map(function (w, i) {
        return '<span class="w" style="--i:' + i + '">' + w + '</span>';
    }).join(' ');
}

function initExploreBtn() {
    var btn = document.getElementById('explore-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById('about');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}


/* =========================================================
   1. PARTICLES — soft two-tone network (cyan + violet)
      Shared engine for the fixed background canvas and the
      per-section canvases. Off-screen canvases pause, and
      nothing animates for visitors who prefer reduced motion.
   ========================================================= */
var PREFERS_REDUCED_MOTION = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var PARTICLE_TONES = ['34,211,238', '139,92,246', '139,92,246', '244,114,182'];

function runParticleCanvas(canvas, opts) {
    if (PREFERS_REDUCED_MOTION) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var visible = true;
    var running = false;

    function resize() {
        canvas.width  = opts.width();
        canvas.height = opts.height();
        particles.forEach(function (p) {
            if (p.x > canvas.width)  p.x = canvas.width;
            if (p.y > canvas.height) p.y = canvas.height;
        });
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < opts.count; i++) {
        particles.push({
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            r:  Math.random() * 1.5 + 0.5,
            a:  Math.random() * 0.45 + 0.25,
            c:  PARTICLE_TONES[i % PARTICLE_TONES.length]
        });
    }

    function frame() {
        if (!visible) { running = false; return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var d  = Math.sqrt(dx * dx + dy * dy);
                if (d < opts.dist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(' + particles[i].c + ',' + (1 - d / opts.dist) * opts.lineAlpha + ')';
                    ctx.lineWidth   = 0.6;
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
            ctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
            ctx.fill();
        });

        requestAnimationFrame(frame);
    }

    function start() {
        if (running) return;
        running = true;
        requestAnimationFrame(frame);
    }

    if (opts.observe && window.IntersectionObserver) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible) start();
        }, { rootMargin: '100px' }).observe(opts.observe);
    }
    start();
}

function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    runParticleCanvas(canvas, {
        count: 55, dist: 190, lineAlpha: 0.22,
        width:  function () { return window.innerWidth; },
        height: function () { return window.innerHeight; }
    });
}


/* =========================================================
   2. SECTION-LOCAL PARTICLE NETWORKS
   ========================================================= */
function initSectionParticles() {
    document.querySelectorAll('.section-particles').forEach(function (canvas) {
        var section = canvas.parentElement;
        runParticleCanvas(canvas, {
            count: 38, dist: 170, lineAlpha: 0.2,
            observe: section,
            width:  function () { return section.offsetWidth; },
            height: function () { return section.offsetHeight; }
        });
    });
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
    if (headline) headline.classList.remove('visible', 'settled');
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

        // Safety net: if the CSS reveal is starved on a busy device,
        // force the headline and Explore button visible after it should have finished.
        setTimeout(function () {
            if (twCancel) return;
            headline.classList.add('settled');
            var top = document.getElementById('top');
            if (top) top.classList.add('intro-settled');
        }, 2200);

        if (twEl) {
            setTimeout(function () {
                if (twCancel) return;
                runTypewriter(twEl);
            }, 750);
        }
    }, 300);
}

function runTypewriter(el) {
    // Types each subtitle line in turn, with a glowing cursor that follows the text
    var lines = [
        'Data \u0026 AI Solutions Architect \u00b7 Applied AI Engineer \u00b7 Analytics Engineering',
        'Microsoft Fabric \u00b7 Fabric Apps \u00b7 Azure OpenAI \u00b7 Agentic AI \u00b7 Power BI',
        'PhD Researcher  |  IEEE \u00b7 Elsevier \u00b7 Springer  |  Conference Speaker'
    ];
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    if (reduce) {
        el.innerHTML = lines.map(function (l) { return '<span class="tw-typed">' + esc(l) + '</span>'; }).join('');
        twRunning = false;
        return;
    }

    var lineIdx = 0, charIdx = 0;
    el.innerHTML = '';

    function render() {
        var html = '';
        for (var i = 0; i < lineIdx; i++) html += '<span class="tw-typed">' + esc(lines[i]) + '</span>';
        if (lineIdx < lines.length) {
            html += '<span class="tw-typed">' + esc(lines[lineIdx].slice(0, charIdx)) + '<span class="tw-cursor"></span></span>';
        }
        el.innerHTML = html;
    }

    function tick() {
        if (twCancel) { el.innerHTML = ''; return; }

        if (lineIdx >= lines.length) {
            // Done: leave a blinking cursor on the last line, then fade it out
            el.lastChild.insertAdjacentHTML('beforeend', '<span class="tw-cursor"></span>');
            var cursor = el.querySelector('.tw-cursor');
            setTimeout(function () {
                if (twCancel || !cursor) return;
                cursor.style.transition = 'opacity 0.6s';
                cursor.style.opacity = '0';
                setTimeout(function () { if (cursor.parentNode) cursor.remove(); twRunning = false; }, 700);
            }, 2200);
            return;
        }

        if (charIdx < lines[lineIdx].length) {
            charIdx++;
            render();
            setTimeout(tick, 22 + Math.random() * 22);   // slight human rhythm
        } else {
            lineIdx++;
            charIdx = 0;
            render();
            setTimeout(tick, 260);
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

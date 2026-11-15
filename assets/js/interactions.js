/* =========================================================
   MODERN INTERACTIONS
   - Scroll progress bar
   - Mouse-following spotlight on cards (sets --mx / --my)
   - Staggered reveal of cards inside grids
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- 1. Scroll progress bar ---- */
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;
    function updateProgress() {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (window.scrollY / max) : 0;
        bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, pct)) + ')';
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    updateProgress();

    /* ---- 2. Spotlight cards ---- */
    var spotSelector = '.solution-card, .value-card, .research-card, .skill-item, ' +
                       '.timeline-content, ol.pub-list li, .stat';
    document.querySelectorAll(spotSelector).forEach(function (el) {
        el.classList.add('spot');
        el.addEventListener('pointermove', function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* ---- 3. Staggered reveal for grid cards ---- */
    if (reduceMotion || !window.IntersectionObserver) return;

    var groups = document.querySelectorAll('.value-grid, .solution-grid, .research-grid, ol.pub-list');
    groups.forEach(function (group) {
        var items = Array.prototype.slice.call(group.children);
        items.forEach(function (item, i) {
            item.classList.add('reveal');
            item.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
        });
    });

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
                // Drop the delay once revealed so hover effects stay snappy
                setTimeout(function () { entry.target.style.transitionDelay = ''; }, 900);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
});

/* ---- Ambient cursor light: moves a soft glow behind the content ---- */
(function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return; // skip on touch
    var root = document.documentElement;
    var x = 0, y = 0, queued = false;
    window.addEventListener('pointermove', function (e) {
        x = e.clientX; y = e.clientY;
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
            root.style.setProperty('--cx', x + 'px');
            root.style.setProperty('--cy', y + 'px');
            root.classList.add('has-cursor');
            queued = false;
        });
    }, { passive: true });
})();

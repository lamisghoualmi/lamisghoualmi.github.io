/* =========================================================
   3D WAVE FIELD — intro background
   A perspective grid of glowing dots rolling like a surface,
   coloured cyan → violet → pink, with a ripple that follows
   the mouse. Pauses when off-screen; static for reduced motion.
   ========================================================= */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var section = document.getElementById('top');
        if (!section) return;
        var canvas = section.querySelector('.section-particles');
        if (!canvas) return;
        canvas.classList.add('wave');

        var ctx = canvas.getContext('2d');
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var W = 0, H = 0, cols = 0, rows = 0, colColours = [];
        var t = 0, visible = true, running = false;
        var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

        // Colour stops across the field (left → right)
        var stops = [[34, 211, 238], [139, 92, 246], [244, 114, 182]];
        function colourAt(u) {
            var seg = u < 0.5 ? 0 : 1;
            var k = u < 0.5 ? u / 0.5 : (u - 0.5) / 0.5;
            var a = stops[seg], b = stops[seg + 1];
            return [
                Math.round(a[0] + (b[0] - a[0]) * k),
                Math.round(a[1] + (b[1] - a[1]) * k),
                Math.round(a[2] + (b[2] - a[2]) * k)
            ];
        }

        function resize() {
            W = section.offsetWidth;
            H = section.offsetHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // Density adapts to width so phones stay smooth
            cols = W < 700 ? 40 : 64;
            rows = W < 700 ? 24 : 32;
            colColours = [];
            for (var k = 0; k < cols; k++) { var cc = colourAt(k / (cols - 1)); colColours.push("rgb(" + cc[0] + "," + cc[1] + "," + cc[2] + ")"); }
        }

        function frame() {
            if (!visible) { running = false; return; }
            ctx.globalAlpha = 1;
            ctx.clearRect(0, 0, W, H);

            // Ease the mouse so the ripple glides
            mouse.x += (mouse.tx - mouse.x) * 0.08;
            mouse.y += (mouse.ty - mouse.y) * 0.08;

            var fov = 320;
            var horizon = H * 0.5;
            var spanX = W * 1.6;
            var depth = 900;
            var camY = H * 0.55;

            for (var j = 0; j < rows; j++) {
                var v = j / (rows - 1);            // 0 = far, 1 = near
                var z = depth * (1 - v) + 20;
                var scale = fov / (fov + z);
                var rowAlpha = Math.pow(v, 1.6);   // fade out toward the horizon

                for (var i = 0; i < cols; i++) {
                    var u = i / (cols - 1);
                    var x = (u - 0.5) * spanX;

                    // Layered waves
                    var y = Math.sin(x * 0.006 + t * 1.1) * 26
                          + Math.cos(z * 0.012 - t * 0.9) * 22
                          + Math.sin((x + z) * 0.004 + t * 0.6) * 18;

                    var sx = W / 2 + x * scale;
                    var sy = horizon + (camY + y) * scale;

                    // Mouse ripple: lift dots near the cursor
                    var dx = sx - mouse.x, dy = sy - mouse.y;
                    var d2 = dx * dx + dy * dy;
                    var lift = Math.exp(-d2 / 9000) * 34 * scale;
                    sy -= lift;

                    if (sx < -10 || sx > W + 10 || sy > H + 10) continue;

                    ctx.fillStyle = colColours[i];
                    var glow = lift > 1 ? Math.min(1, lift / 12) : 0;
                    var a = (0.22 + 0.78 * rowAlpha) * (0.8 + 0.2 * Math.sin(x * 0.01 + t)) + glow * 0.5;
                    var r = Math.max(0.8, 2.0 * scale + glow);

                    ctx.globalAlpha = Math.min(1, a);
                    ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
                }
            }

            t += 0.012;
            if (!reduce) requestAnimationFrame(frame); else running = false;
        }

        function start() {
            if (running) return;
            running = true;
            requestAnimationFrame(frame);
        }

        resize();
        window.addEventListener('resize', function () { resize(); if (reduce) start(); });

        section.addEventListener('pointermove', function (e) {
            var r = canvas.getBoundingClientRect();
            mouse.tx = e.clientX - r.left;
            mouse.ty = e.clientY - r.top;
            if (mouse.x < -5000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
        });
        section.addEventListener('pointerleave', function () {
            mouse.tx = -9999; mouse.ty = -9999;
        });

        if (window.IntersectionObserver) {
            new IntersectionObserver(function (entries) {
                visible = entries[0].isIntersecting;
                if (visible) start();
            }, { rootMargin: '50px' }).observe(section);
        }
        start();
    });
})();

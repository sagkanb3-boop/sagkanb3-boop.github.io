/* Dot-grid canvas behind the hero + contact form handling */
(function () {
  'use strict';

  /* Animated dot grid */
  var canvas = document.getElementById('dotgrid');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var dots = [], W = 0, H = 0, t = 0;
    var GAP = 26, R = 2.2;

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width;
      H = canvas.height = r.height;
      dots = [];
      for (var x = GAP / 2; x < W; x += GAP) {
        for (var y = GAP / 2; y < H; y += GAP) {
          dots.push({ x: x, y: y, ph: (x + y) * 0.01 });
        }
      }
    }

    function draw() {
      t += 0.012;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#d5d1cf';
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var s = 1 + 0.25 * Math.sin(t + d.ph);
        ctx.beginPath();
        ctx.arc(d.x, d.y, R * s, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    // Respect reduced-motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctx.fillStyle = '#d5d1cf';
      dots.forEach(function (d) { ctx.beginPath(); ctx.arc(d.x, d.y, R, 0, Math.PI * 2); ctx.fill(); });
    } else {
      draw();
    }
  }

  /* Contact form -> free FormSubmit endpoint (no account needed).
     First submission triggers a one-time activation email to the inbox. */
  var forms = document.querySelectorAll('[data-contact-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var ok = form.parentElement.querySelector('.form-ok');
      btn.disabled = true;
      btn.textContent = 'Sending…';
      fetch('https://formsubmit.co/ajax/sagkanb3@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.querySelector('[name="name"]').value,
          email: form.querySelector('[name="email"]').value,
          message: form.querySelector('[name="message"]').value,
          _subject: 'New message from your portfolio site'
        })
      }).then(function (res) {
        if (!res.ok) throw new Error('send failed');
        form.style.display = 'none';
        if (ok) ok.style.display = 'block';
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = 'Send email';
        var note = form.parentElement.querySelector('.form-note');
        if (note) note.textContent = 'Something went wrong sending just now — please email sagkanb3@gmail.com directly.';
      });
    });
  });
})();

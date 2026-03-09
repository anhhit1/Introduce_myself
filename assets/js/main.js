/* ============================================
   Main JS — Neural Background + Lucide Init
   ============================================ */

// --- Neural Network Background Animation ---
(function () {
  var canvas = document.getElementById('neural-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.vx   = (Math.random() - 0.5) * 0.5;
    this.vy   = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2;
  };

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.fillStyle = 'rgba(95, 98, 247, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < 80; i++) {
      particles.push(new Particle());
    }
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.update();
      p.draw();

      for (var j = i + 1; j < particles.length; j++) {
        var dx   = p.x - particles[j].x;
        var dy   = p.y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.strokeStyle = 'rgba(6, 182, 212, ' + (0.15 * (1 - dist / 150)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
})();

// --- Lucide Icons Initialization ---
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// --- Mobile Navigation Menu ---
document.addEventListener('DOMContentLoaded', function () {
  var mobileBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', function () {
      var isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        mobileBtn.innerHTML = '<i class="w-6 h-6" data-lucide="x"></i>';
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileBtn.innerHTML = '<i class="w-6 h-6" data-lucide="menu"></i>';
      }
      
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }
});

// --- Theme Toggle ---
document.addEventListener('DOMContentLoaded', function () {
  var themeToggleBtn = document.getElementById('theme-toggle');
  
  if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  function updateThemeIcon() {
    if (!themeToggleBtn) return;
    if (document.documentElement.classList.contains('dark')) {
      themeToggleBtn.innerHTML = '<i class="w-4 h-4 text-slate-300" data-lucide="moon"></i>';
    } else {
      themeToggleBtn.innerHTML = '<i class="w-4 h-4 text-orange-500" data-lucide="sun"></i>';
    }
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      updateThemeIcon();
    });
    updateThemeIcon();
  }
});

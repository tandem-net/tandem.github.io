// Landing-page behavior, ported from the Tandem Design System component
// (templates/landing-page/LandingPage.dc.html) to framework-free vanilla JS.
// - Types out each terminal command as its step scrolls into view
// - Reveals steps on scroll (via CSS classes toggled here)
// - Rolls the finale word ("Tandemize your life / team / app / ...")
// The infinite ticker is pure CSS (see landing.css).
(function () {
  var root = document.querySelector('.lp-root');
  if (!root) return;

  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  root.classList.add('lp-js');

  var TYPE_SPEED_MS = 38;
  var ROLL_INTERVAL_MS = 2600;
  var ROLL_WORDS = ['life', 'team', 'app', 'workflow', 'business', 'startup', 'side project', 'empire'];
  var timers = [];

  // --- Terminals: reveal + type the command line for each step ---
  var steps = Array.prototype.slice.call(root.querySelectorAll('[data-step]'));

  steps.forEach(function (step) {
    var cmd = step.querySelector('.lp-cmd');
    if (cmd) {
      cmd.dataset.full = cmd.textContent;
      if (!reduced) cmd.textContent = '';
    }
  });

  function typeStep(step) {
    if (step._typed) return;
    step._typed = true;
    step.classList.add('in');
    var cmd = step.querySelector('.lp-cmd');
    if (!cmd || reduced) {
      step.classList.add('done');
      return;
    }
    var full = cmd.dataset.full || '';
    var i = 0;
    (function tick() {
      cmd.textContent = full.slice(0, i);
      if (i <= full.length) {
        i++;
        timers.push(setTimeout(tick, TYPE_SPEED_MS));
      } else {
        timers.push(setTimeout(function () { step.classList.add('done'); }, 200));
      }
    })();
  }

  if (reduced || !('IntersectionObserver' in window)) {
    steps.forEach(function (s) { s.classList.add('in'); typeStep(s); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          typeStep(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.28 });
    steps.forEach(function (s) { io.observe(s); });
  }

  // --- Finale: roll through the closing words ---
  var rollEl = root.querySelector('.lp-roll');
  if (rollEl && ROLL_WORDS.length > 1) {
    var idx = Math.max(0, ROLL_WORDS.indexOf(rollEl.textContent.trim()));

    if (reduced) {
      timers.push(setInterval(function () {
        idx = (idx + 1) % ROLL_WORDS.length;
        rollEl.textContent = ROLL_WORDS[idx];
      }, ROLL_INTERVAL_MS));
    } else {
      rollEl.addEventListener('animationend', function (e) {
        if (e.animationName === 'lp-rollout') {
          rollEl.textContent = ROLL_WORDS[idx];
          rollEl.classList.remove('lp-roll-out');
          void rollEl.offsetWidth; // force reflow so the in-animation restarts
          rollEl.classList.add('lp-roll-in');
        }
      });
      timers.push(setInterval(function () {
        idx = (idx + 1) % ROLL_WORDS.length;
        rollEl.classList.remove('lp-roll-in');
        void rollEl.offsetWidth;
        rollEl.classList.add('lp-roll-out');
      }, ROLL_INTERVAL_MS));
    }
  }
})();

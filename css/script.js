/* Scroll reveal (shared) */
(function () {
  function reveal() {
    var els = document.querySelectorAll('.fade-up');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  if (document.readyState !== 'loading') reveal();
  else document.addEventListener('DOMContentLoaded', reveal);
})();

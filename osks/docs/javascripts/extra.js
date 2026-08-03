document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.md-header');
  if (header) {
    header.setAttribute('data-osks', 'portal');
  }

  const revealItems = document.querySelectorAll('.panel, .feature-card, .module-card, .stat-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });
});

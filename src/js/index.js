function checkScrolled() {
  if (window.scrollY > 0) {
    document.body.classList.add('scrolled');
  }
  else {
    document.body.classList.remove('scrolled');
  }
}

function ready(cb) {
  if (document.readyState === 'complete') {
    cb();
  }
  else {
    document.addEventListener('DOMContentLoaded', cb);
  }
}

ready(() => {
  for (const button of document.querySelectorAll('.navbar-button')) {
    button.addEventListener('click', () => {
      button.classList.toggle('open');

      const controls = button.getAttribute('aria-controls');
      if (!controls) {
        return;
      }

      const controlledElement = document.getElementById(controls);
      if (!controlledElement) {
        return;
      }

      controlledElement.classList.toggle('open', button.classList.contains('open'));
    });
  }
});

document.addEventListener('scroll', checkScrolled);
checkScrolled();

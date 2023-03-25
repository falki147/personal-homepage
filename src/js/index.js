import PhotoSwipeLightbox from "photoswipe/dist/photoswipe-lightbox.esm";
import { ready } from "./ready";

function checkScrolled() {
  if (window.scrollY > 0) {
    document.body.classList.add('scrolled');
  }
  else {
    document.body.classList.remove('scrolled');
  }
}

function getChildrenHeight(element) {
  let height = 0;
  for (const child of element.children) {
    height += child.offsetHeight;
  }

  return height;
}

ready(() => {
  for (const button of document.querySelectorAll('.navbar-button')) {
    const controlledElement = document.getElementById(button.getAttribute('aria-controls'));
    if (!controlledElement) {
      continue;
    }

    function toggle(value = undefined) {
      button.classList.toggle('open', value);

      const opened = button.classList.contains('open');

      controlledElement.style.height = opened ? getChildrenHeight(controlledElement) + 'px' : '0';
      controlledElement.parentElement.classList.toggle('open', opened);
    }

    button.addEventListener('click', () => {
      toggle();
    });

    controlledElement.addEventListener('click', () => {
      if (button.classList.contains('open')) {
        toggle(false);
      }
    });
  }

  document.addEventListener('scroll', checkScrolled);
  checkScrolled();

  for (const gallery of document.querySelectorAll('.gallery')) {
    const lightbox = new PhotoSwipeLightbox({
      gallery,
      children: 'a',
      padding: { top: 40, bottom: 40, left: 40, right: 40 },
      pswpModule: () => import("photoswipe")
    });
    lightbox.init();
  }
});

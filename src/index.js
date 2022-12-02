require("./style.scss");

function checkScrolled() {
  if (window.scrollY > 0) {
    document.body.classList.add('scrolled');
  }
  else {
    document.body.classList.remove('scrolled');
  }
}

document.addEventListener('scroll', checkScrolled);
checkScrolled();

export function debounce(func, time) {
  let index = -1;
  return function () {
    if (index >= 0) {
      clearTimeout(index);
    }
    index = setTimeout(function () {
      index = -1;
      func();
    }, time);
  };
}

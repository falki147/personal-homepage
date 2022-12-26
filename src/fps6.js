const canvas = document.getElementById('canvas');
canvas.addEventListener('webglcontextlost', (e) => {
  alert('WebGL context lost. You will need to reload the page.');
  e.preventDefault();
}, false);

const statusElement = document.getElementById('fps6-status');
function setStatus(...args) {
  statusElement.innerText = args.join(' ');
  console.log(...args);
}

setStatus('Downloading...');

window.Module = {
  preRun: [
    () => {
      FS.createPreloadedFile('/', 'data.img', '/assets/fps6/data.img', true, false);
    },
    () => {
      document.querySelector('.fps6-container').classList.add('active');
    }
  ],
  print: console.log,
  canvas,
  totalDependencies: 0,
  monitorRunDependencies(left) {
    this.totalDependencies = Math.max(this.totalDependencies, left);

    if (left) {
      setStatus(`Preparing... (${this.totalDependencies - left}/${this.totalDependencies})`);
    }
    else {
      setStatus('All downloads complete.');
    }
  },
  onAbort() {
    setStatus('Application aborted!');
  }
};

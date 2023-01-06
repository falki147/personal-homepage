import Quill from 'quill';
import { ASTConverter } from './ASTConverter';
import { debounce } from './timing';
import { createSVGFromTree } from './createSVGFromTree';

let codeEditor = null;

function syntaxHighlight(areas) {
  const text = codeEditor.getText();

  codeEditor.removeFormat(0, codeEditor.getLength() - 1);
  codeEditor.root.classList.remove('code-editor-eof');

  for (const area of areas) {
    if (area.first.index < 0 || area.last.index < 0) {
      continue;
    }

    if (area.first.index >= text.length) {
      codeEditor.root.classList.add('code-editor-eof');
    }
    else {
      codeEditor.formatText(area.first.index, area.last.index - area.first.index, 'underline', true);
    }
  }
}

function checkSyntax() {
  // Get text from editor and replace &nbsp; with space
  const text = codeEditor.getText().replace(/\xA0/g, ' ');

  const { root, messages } = Module.Parse(text);
  const node = new ASTConverter(root).toSimplifiedTree();

  const tree = document.getElementById('ast-tree');

  const chart = createSVGFromTree(node, {
    label: d => d.name,
    click(data) {
      if (data.first && data.last) {
        codeEditor.setSelection(data.first.index, data.last.index - data.first.index);
      }
    },
    width: tree.offsetWidth
  });

  tree.innerHTML = '';
  tree.append(chart);

  syntaxHighlight(messages);
}

const checkSyntaxDebounced = debounce(checkSyntax, 500);

function init() {
  codeEditor = new Quill('#code-editor', {
    modules: {
      toolbar: false
    },
    theme: 'snow'
  });

  codeEditor.on('text-change', (_delta, _oldDelta, source) => {
    if (source === 'user') {
      checkSyntaxDebounced();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);

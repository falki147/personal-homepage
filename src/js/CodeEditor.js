import Quill from 'quill';
import { debounce } from "./timing";

export class CodeEditor {
  _codeEditor = null;
  _treeOutput = null;
  _onParse = [];

  constructor(container) {
    this._initEditor(container);
  }

  addOnParse(cb) {
    this._onParse.push(cb);
  }

  setSelection(index, length) {
    this._codeEditor.setSelection(index, length);
  }

  _initEditor(container) {
    this._codeEditor = new Quill(container, {
      modules: {
        toolbar: false
      },
      theme: 'snow'
    });

    const textChangedDebounced = debounce(() => this._textChanged(), 300);

    this._codeEditor.on('text-change', (_delta, _oldDelta, source) => {
      if (source === 'user') {
        textChangedDebounced();
      }
    });

    if (typeof global.Module !== 'object') {
      global.Module = {};
    }

    if (!global.Module.Parse) {
      const that = this;

      const cb = global.Module['onRuntimeInitialized'] || (() => {});
      global.Module['onRuntimeInitialized'] = function () {
        that._textChanged();
        return cb.apply(this, arguments);
      };
    }
    else {
      this._textChanged();
    }
  }

  _textChanged() {
    const { root, messages } = this._parseCode();
    this._updateEditorErrors(messages);

    for (const cb of this._onParse) {
      cb(root, messages);
    }
  }

  _parseCode() {
    // Parse function is loaded with emscripten, check if it's loaded
    if (!global.Module.Parse) {
      return { root: null, messages: [] };
    }

    // Get text from editor and replace &nbsp; with space
    const text = this._codeEditor.getText().replace(/\xA0/g, ' ');
    return global.Module.Parse(text);
  }

  _updateEditorErrors(messages) {
    const text = this._codeEditor.getText();

    this._codeEditor.removeFormat(0, this._codeEditor.getLength() - 1);
    this._codeEditor.root.classList.remove('code-editor-eof');

    for (const message of messages) {
      const { first, last } = message;

      if (first.index < 0 || last.index < 0) {
        continue;
      }

      if (first.index >= text.length) {
        this._codeEditor.root.classList.add('code-editor-eof');
      }
      else {
        this._codeEditor.formatText(first.index, last.index - first.index, 'underline', true);
      }
    }
  }
};

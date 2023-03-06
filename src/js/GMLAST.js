import { ASTTree } from './ASTTree';
import { CodeEditor } from './CodeEditor';
import { ready } from './ready';

ready(() => {
  const codeEditor = new CodeEditor('#code-editor');
  const astTree = new ASTTree('#ast-tree');

  codeEditor.addOnParse(root => astTree.render(root));

  astTree.addOnClick(data => {
    if (data.first && data.last) {
      codeEditor.setSelection(data.first.index, data.last.index - data.first.index);
    }
  });

  const errorList = document.getElementById('error-list');
  codeEditor.addOnParse((_, messages) => {
    while (errorList.lastChild) {
      errorList.removeChild(errorList.lastChild);
    }

    for (const message of messages) {
      const item = document.createElement('LI');
      item.classList.add('message');
      item.classList.add('message-' + message.level.toLowerCase());
      item.innerText = `${message.first.line}:${message.first.column} ${message.message}`;
      errorList.appendChild(item);
    }
  });
});

import { ASTTree } from './ASTTree';
import { CodeEditor } from './CodeEditor';

document.addEventListener('DOMContentLoaded', () => {
  const codeEditor = new CodeEditor('#code-editor');
  const astTree = new ASTTree('#ast-tree');

  codeEditor.addOnParse(root => astTree.render(root));

  astTree.addOnClick(data => {
    if (data.first && data.last) {
      codeEditor.setSelection(data.first.index, data.last.index - data.first.index);
    }
  });
});

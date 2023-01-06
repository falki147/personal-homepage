import { ASTConverter } from "./ASTConverter";
import { createSVGFromTree } from "./createSVGFromTree";

export class ASTTree {
  _element = null;
  _onClick = [];

  constructor(container) {
    this._element = typeof container === 'string' ? document.querySelector(container) : container;
  }

  addOnClick(cb) {
    this._onClick.push(cb);
  }

  render(root) {
    const node = new ASTConverter(root).toSimplifiedTree();

    const chart = createSVGFromTree(node, {
      label: d => d.name,
      click: (data) => {
        for (const cb of this._onClick) {
          cb(data);
        }
      },
      width: this._element.offsetWidth
    });

    this.clear();
    this._element.append(chart);
  }

  clear() {
    while(this._element.firstChild) {
      this._element.removeChild(this._element.lastChild);
    }
  }
};

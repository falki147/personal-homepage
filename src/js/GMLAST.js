import Quill from 'quill';
import { ASTConverter } from './ASTConverter';
import { debounce } from './timing';
import { tree, curveBumpX, stratify, hierarchy, create, link } from 'd3';

let codeEditor = null;

function syntaxHighlight(areas) {
  var text = codeEditor.getText();
  
  codeEditor.removeFormat(0, codeEditor.getLength() - 1);

  document.getElementById('code-editor').classList.remove('code-editor-eof');
  
  for (var i = 0; i < areas.length; ++i) {
    if (areas[i].first.index < 0 || areas[i].last.index < 0)
      continue;
    
    if (areas[i].first.index >= text.length)
      document.getElementById('code-editor').classList.add('code-editor-eof');
    else
      codeEditor.formatText(areas[i].first.index, areas[i].last.index - areas[i].first.index, 'underline', true);
  }
}

function checkSyntax() {
  const { root, messages } = Module.Parse(codeEditor.getText().replace(/\xA0/g, ' '));
  const node = new ASTConverter(root).toSimplifiedTree();
  
  console.log(messages);
  
  const tree = document.getElementById('ast-tree');
  
  const chart = Tree(node, {
    label: d => d.name,
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
  
  codeEditor.on('text-change', function (delta, oldDelta, source) {
    if (source === 'user')
      checkSyntaxDebounced();
  });
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree
function Tree(data, { // data is either tabular (array of objects) or hierarchy (nested objects)
children, // if hierarchical data, given a d in data, returns its children
label, // given a node d, returns the display name
width = 640, // outer width, in pixels
height, // outer height, in pixels
r = 6, // radius of nodes
padding = 1, // horizontal padding for first and last column
fill = "#999", // fill for nodes
stroke = "#555", // stroke for links
strokeWidth = 1.5, // stroke width for links
strokeOpacity = 0.4, // stroke opacity for links
strokeLinejoin, // stroke line join for links
strokeLinecap, // stroke line cap for links
halo = "#fff", // color of label halo 
haloWidth = 3, // padding around the labels
} = {}) {

// If id and parentId options are specified, or the path option, use d3.stratify
// to convert tabular data to a hierarchy; otherwise we assume that the data is
// specified as an object {children} with nested objects (a.k.a. the “flare.json”
// format), and use d3.hierarchy.
const root = hierarchy(data, children);

// Compute labels and titles.
const descendants = root.descendants();
const L = label == null ? null : descendants.map(d => label(d.data, d));

// Compute the layout.
const dx = 20;
const dy = width / (root.height + padding);
tree().nodeSize([dx, dy])(root);

// Center the tree.
let x0 = Infinity;
let x1 = -x0;
root.each(d => {
if (d.x > x1) x1 = d.x;
if (d.x < x0) x0 = d.x;
});

// Compute the default height.
if (height === undefined) height = x1 - x0 + dx * 2;

const svg = create("svg")
.attr("viewBox", [-dy * padding / 2, x0 - dx, width, height])
.attr("width", width)
.attr("height", height)
.attr("style", "max-width: 100%; height: auto; height: intrinsic;")
.attr("font-family", "sans-serif")
.attr("font-size", 10);

svg.append("g")
.attr("fill", "none")
.attr("stroke", stroke)
.attr("stroke-opacity", strokeOpacity)
.attr("stroke-linecap", strokeLinecap)
.attr("stroke-linejoin", strokeLinejoin)
.attr("stroke-width", strokeWidth)
.selectAll("path")
.data(root.links())
.join("path")
  .attr("d", link(curveBumpX)
      .x(d => d.y)
      .y(d => d.x));

const node = svg.append("g")
.selectAll("a")
.data(root.descendants())
.join("a")
.on("click", (e, d) => {
if (d.data.first && d.data.last) {
  codeEditor.setSelection(d.data.first.index, d.data.last.index - d.data.first.index);
}
})
.attr("transform", d => `translate(${d.y},${d.x})`);

node.append("circle")
.attr("fill", d => d.children ? stroke : fill)
.attr("r", r);

if (L) node.append("text")
.attr("dy", "0.32em")
.attr("x", d => d.children ? -10 : 10)
.attr("text-anchor", d => d.children ? "end" : "start")
.attr("paint-order", "stroke")
.attr("stroke", halo)
.attr("stroke-width", haloWidth)
.text((d, i) => L[i]);

return svg.node();
}

document.addEventListener('DOMContentLoaded', init);

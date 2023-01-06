import { tree, curveBumpX, hierarchy, create, link } from 'd3';

function getHierarchyDimensions(root) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;

  root.each(d => {
    x0 = Math.min(x0, d.x);
    y0 = Math.min(y0, d.y);

    x1 = Math.max(x1, d.x);
    y1 = Math.max(y1, d.y);
  });

  return [ x0, x1, y0, y1 ];
}

export function createSVGFromTree(data, { label, click, width = 640 }) {
  const r = 6;
  const padding = 1;
  const fill = '#999';
  const stroke = '#555';
  const strokeWidth = 1.5;
  const strokeOpacity = 0.4;
  const halo = '#fff';
  const haloWidth = 3;

  const root = hierarchy(data);
  
  // Compute labels and titles.
  const descendants = root.descendants();
  const L = label == null ? null : descendants.map(d => label(d.data, d));
  
  // Compute the layout.
  const dx = 20;
  const dy = width / (root.height + padding);
  tree().nodeSize([dx, dy])(root);
  
  // Compute size of tree.
  const [ x0, x1 ] = getHierarchyDimensions(root);
  
  // Compute the default height.
  const height = x1 - x0 + dx * 2;
  
  const svg = create('svg')
    .attr('viewBox', [-dy * padding / 2, x0 - dx, width, height])
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10);
  
  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', stroke)
    .attr('stroke-opacity', strokeOpacity)
    .attr('stroke-width', strokeWidth)
    .selectAll('path')
    .data(root.links())
    .join('path')
      .attr('d', link(curveBumpX)
          .x(d => d.y)
          .y(d => d.x));
  
  const node = svg.append('g')
    .selectAll('a')
    .data(root.descendants())
    .join('a')
    .attr('transform', d => `translate(${d.y},${d.x})`);

  if (click) {
    node.on('click', (_e, d) => {
      click(d.data);
    });
  }
  
  node.append('circle')
    .attr('fill', d => d.children ? stroke : fill)
    .attr('r', r);

  if (L) {
    node.append('text')
      .attr('dy', '0.32em')
      .attr('x', d => d.children ? -10 : 10)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .attr('paint-order', 'stroke')
      .attr('stroke', halo)
      .attr('stroke-width', haloWidth)
      .text((d, i) => L[i]);
  }

  return svg.node();
}

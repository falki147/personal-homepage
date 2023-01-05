const arrayOperators = {
  'Array': '[]',
  'Grid': '[#]',
  'List': '[|]',
  'Map': '[?]',
  'Reference': '[@]'
};

const asssignOperators = {
  'Assign': '=',
  'Add': '+=',
  'BitAnd': '&=',
  'BitOr': '|=',
  'BitXor': '^=',
  'Div': '/=',
  'Mod': '%=',
  'Mul': '*=',
  'Sub': '-='
};

const binaryOperators = {
  'Add': '+',
  'BitwiseAnd': '&',
  'BitwiseLeft': '<<',
  'BitwiseOr': '|',
  'BitwiseRight': '>>',
  'BitwiseXor': '^',
  'CompareEqual': '==',
  'CompareGreater': '>',
  'CompareGreaterEqual': '>=',
  'CompareLess': '<',
  'CompareLessEqual': '<=',
  'CompareNotEqual': '!=',
  'Divide': '/',
  'IntDivide': 'idiv',
  'LogicalAnd': '&&',
  'LogicalOr': '||',
  'LogicalXor': '^^',
  'Modulo': '%',
  'Multiply': '*',
  'Subtract': '-'
};

const unuaryOperators = {
  'BitwiseNot': '~',
  'LogicalNot': '!',
  'PostfixDecrement': '--',
  'PostfixIncrement': '++',
  'PrefixDecrement': '--',
  'PrefixIncrement': '++',
  'Minus': '-',
  'Plus': '+'
};

export class ASTConverter {
  constructor(root) {
    this._root = root;
  }

  toSimplifiedTree() {
    function inner(astNode) {
      const node = {
        name: astNode.name || astNode.nodeType,
        first: astNode.first,
        last: astNode.last,
        children: []
      };
      
      switch (astNode.nodeType) {
      case 'ArrayOperator':
        node.name = arrayOperators[astNode.type] || astNode.type;
        break;
      case 'AssignStatement':
        node.name = asssignOperators[astNode.type] || astNode.type;
        break;
      case 'BinaryOperator':
        node.name = binaryOperators[astNode.type] || astNode.type;
        break;
      case 'UnuaryOperator':
        node.name = unuaryOperators[astNode.type] || astNode.type;
        break;
      case 'IntConstant':
      case 'DoubleConstant':
      case 'StringConstant':
        node.name = astNode.value;
        break;
      }
    
      for (const key in astNode) {
        if (astNode[key].nodeType) {
          node.children.push(inner(astNode[key]));
        }
        else if (Array.isArray(astNode[key])) {
          node.children = node.children.concat(astNode[key].map(inner));
        }
      }
      
      return node;
    }

    return inner(this._root);
  }
};

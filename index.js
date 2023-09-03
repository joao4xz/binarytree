function sort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[0];

  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (pivot > arr[i]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...sort(left), pivot, ...sort(right)];
}

class Node {
  constructor(value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  setLeft(value) {
    this.left = value;
  }

  setRight(value) {
    this.right = value;
  }
}

class Tree {
  constructor(arr) {
    const filteredArr = this.filterArr(arr);
    this.root = this.buildTree(filteredArr, 0, filteredArr.length - 1);
  }

  buildTree(arr, start, end) {
    if (start > end) return null;

    const mid = parseInt((start + end) / 2);
    const node = new Node(arr[mid], null, null);

    node.setLeft(this.buildTree(arr, start, mid - 1));
    node.setRight(this.buildTree(arr, mid + 1, end));

    return node;
  }

  filterArr(arr) {
    return [...new Set(sort(arr))];
  }

  insertNode(value) {
    const node = new Node(value, null, null);
    if (node === null) {
      this.root = node;
      return;
    }

    let previous = null;
    let current = this.root;

    while (current !== null) {
      if (value > current.value) {
        previous = current;
        current = current.right;
      } else {
        previous = current;
        current = current.left;
      }
    }
    if (previous.value > value) previous.left = node;
    else previous.right = node;
  }

  deleteNode(node, value) {
    if (node === null) {
      return node;
    }

    if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
      return node;
    } else if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
      return node;
    }

    if (node.left === null) {
      const temp = node.right;
      return temp;
    } else if (node.right === null) {
      const temp = node.left;
      return temp;
    } else {
      let succParent = node;

      let succ = node.right;
      while (succ.left !== null) {
        succParent = succ;
        succ = succ.left;
      }

      if (succParent !== node) {
        succParent.left = succ.right;
      } else {
        succParent.right = succ.right;
      }

      node.value = succ.value;

      return node;
    }
  }

  find(value) {
    let current = this.root;
    while (current !== null) {
      if (value > current.value) {
        current = current.right;
        continue;
      } else if (value < current.value) {
        current = current.left;
        continue;
      }
      break;
    }
    return current;
  }

  levelOrder(node) {
    const currentArr = [];
    const queue = [];

    queue[0] = node;
    while (queue.length !== 0) {
      currentArr.push(queue[0].value);
      if (queue[0].left !== null) {
        queue.push(queue[0].left);
      }
      if (queue[0].right !== null) {
        queue.push(queue[0].right);
      }
      queue.shift();
    }

    return currentArr;
  }

  inOrder(node, result = []) {
    if (node === null) return result;

    result = this.inOrder(node.left, result);
    result.push(node.value);
    result = this.inOrder(node.right, result);

    return result;
  }

  preOrder(node, result = []) {
    if (node === null) return result;

    result.push(node.value);
    result = this.preOrder(node.left, result);
    result = this.preOrder(node.right, result);

    return result;
  }

  postOrder(node, result = []) {
    if (node === null) return result;

    result = this.postOrder(node.left, result);
    result = this.postOrder(node.right, result);
    result.push(node.value);

    return result;
  }

  height(node) {
    if (node === null) {
      return -1;
    }

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node, currentDepth = 0) {
    if (node === null) {
      return -1;
    }

    const leftDepth = this.depth(node.left, currentDepth + 1);
    const rightDepth = this.depth(node.right, currentDepth + 1);

    return Math.max(leftDepth, rightDepth) + 1;
  }

  isBalanced(node) {
    if (node === null) {
      return true;
    }

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    if (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    ) {
      return true;
    }

    return false;
  }

  rebalance(node) {
    const sortedTree = this.inOrder(node);
    return this.buildTree([...new Set(sortedTree)], 0, sortedTree.length - 1);
  }

  prettyPrint(node, prefix = '', isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }
}

function createRandomTree() {
  const arr = [];
  for (let i = 0; i < 100; i++) {
    arr.push(Math.floor(Math.random() * 100000));
  }
  const tree = new Tree(arr);

  console.log(`Level Order: [${tree.levelOrder(tree.root)}]\n`);
  console.log(`In order: [${tree.inOrder(tree.root)}]\n`);
  console.log(`Pre order: [${tree.preOrder(tree.root)}]\n`);
  console.log(`Post order: [${tree.postOrder(tree.root)}]\n`);
  console.log(`Height: ${tree.height(tree.root)}`);
  console.log(`Depth: ${tree.depth(tree.root)}`);
  console.log(`Is balanced: ${tree.isBalanced(tree.root)}`);
  console.log('First Tree:\n\n');
  tree.prettyPrint(tree.root);

  console.log('\nInserting elements to unbalance tree.');
  for (let i = 0; i < 100; i++) {
    tree.insertNode(Math.floor(Math.random() * 100000));
  }

  console.log(`Is balanced: ${tree.isBalanced(tree.root)}\n\n`);
  tree.prettyPrint(tree.root);

  console.log('\nRebalancing tree\n');
  tree.root = tree.rebalance(tree.root);
  tree.prettyPrint(tree.root);
  console.log(`Is balanced: ${tree.isBalanced(tree.root)}\n`);
  console.log(`Level Order: [${tree.levelOrder(tree.root)}]\n`);
  console.log(`In order: [${tree.inOrder(tree.root)}]\n`);
  console.log(`Pre order: [${tree.preOrder(tree.root)}]\n`);
  console.log(`Post order: [${tree.postOrder(tree.root)}]\n`);
  console.log(`Height: ${tree.height(tree.root)}`);
  console.log(`Depth: ${tree.depth(tree.root)}`);
}

createRandomTree();

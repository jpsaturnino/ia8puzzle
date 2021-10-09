class Node {
  constructor(data) {
    this.data = data
    this.child = [];
    this.fa = 0
    this.fc = 0
    this.father = null
  }

  getFather() {
    return this.father;
  }

  setFather(father) {
    return this.father = father;
  }

  getFc() {
    return this.fc;
  }

  setFc(fc) {
    this.fc = fc;
  }

  getFa() {
    return this.fa;
  }

  setFa(fa) {
    this.fa = fa;
  }

  isLeaf() {
    if (this.child.length !== 0)
      return true
    return false;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  getChild() {
    return this.child;
  }

  setChild(child) {
    this.child = child;
  }
}

module.exports = Node;
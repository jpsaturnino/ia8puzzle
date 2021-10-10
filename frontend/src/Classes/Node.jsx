class Node {
  constructor(data) {
    this.data = data
    this.child = [];
    this.fa = 0
    this.fc = 0//quanto gasto para vir do meu pai para mim
    this.father = null
  }

  getFather() {
    return this.father;
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

export default Node;
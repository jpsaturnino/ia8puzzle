/* function neighbors(x, y) {
  var nb = []
  if (x !== 2) //se nao e a ultima linha, tem vizinho pra baixo
      nb.push(x + 1, y)
  if (x !== 0) //se nao e a primeira linha, tem vizinho pra cima
      nb.push(x - 1, y)
  if (y !== 2) //se nao e a ultima coluna, tem vizinho para o lado direito
      nb.push(x, y + 1)
  if (y !== 0)//se nao e a primeira coluna, tem vizinho para o lado esquerdo
      nb.push(x, y - 1)
  return nb;
}

function shuffle(rows) {
  const min = 2, max = 8;
  var rand = 5//parseInt(min + Math.random() * (max - min));
  var x, y; //coordenas da posição livre
  var found = false

  //encontrar posição vazia
  for (let r = 0; r < rows.length && !found; r++) {
      for (let c = 0; c < rows[r].length && !found; c++)
          if (rows[r][c] === 0) {
              found = true
              x = r; y = c
          }
  }

  let i;
  var nb;
  //quantidade de movimentos do embaralho
  while (rand > 0) {
      nb = neighbors(x, y); //acha os vizinhos do lugar vazio
      i = parseInt(Math.random() * (nb.length - 1));
      if (i % 2 !== 0)
          i++;
      rows[x][y] = rows[nb[i]][nb[i + 1]];
      rows[nb[i]][nb[i + 1]] = 0;
      x = nb[i];
      y = nb[i + 1];
      rand = rand - 1;
  }
  setMatStart(rows)
}

function posEmpty(mat) {
  var found = false
  var x, y
  //encontrar posição vazia
  for (let r = 0; r < mat.length && !found; r++) {
      for (let c = 0; c < mat[r].length && !found; c++)
          if (mat[r][c] === 0) {
              found = true
              x = r; y = c
          }
  }
  return [x, y]
}

function copyMat(mat) {
  var matCopy = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
  ]
  for (let r = 0; r < mat.length; r++)
      for (let c = 0; c < mat[r].length; c++)
          matCopy[r][c] = mat[r][c]

  return matCopy
}

function sumManhattan(mat1, mat2) {//mat1 = matriz atual, mat2 = matriz de estado possivel
  var sum = 0
  var found
  let r, c, x, y
  for (r = 0; r < mat1.length; r++)
      for (c = 0; c < mat1[0].length; c++) {
          found = false
          for (x = 0; x < mat2.length && !found; x++)
              for (y = 0; y < mat2[0].length && !found; y++)
                  if (mat1[r][c] === mat2[x][y]) {
                      found = true
                      sum = sum + Math.abs(x - r) + Math.abs(y - c)
                  }
      }
  return sum
}
function equalsMat(mat1, mat2) {
  var diff = false;
  for (let i = 0; i < mat1.length && !diff; i++)
      for (let k = 0; k < mat1[i].length && !diff; k++)
          if (mat1[i][k] !== mat2[i][k])
              diff = true
  return !diff
}
function AStar() {
  var matrix = [
      [1, 2, 3],
      [4, 0, 5],
      [6, 7, 8]
  ];
  var path = []
  var matTemp
  var xy, nb, root, posRoot
  var arrayLeaf = []
  setMatEnd(copyMat(matrix))
  //shuffle(matrix)
  setMatStart([[1, 2, 3], [6, 4, 5], [7, 0, 8]])

  root = new Node(matStart);
  var root_ = root
  root.setFa(sumManhattan(root.getData(), matEnd))
  root.setFc(0)
  path.push(root)
  while (!equalsMat(root.getData(), matEnd)) {
      xy = posEmpty(root.getData())
      nb = neighbors(xy[0], xy[1])
      //definir os possiveis estados seguintes
      arrayLeaf.push(root)
      for (let i = 0; i < nb.length; i += 2) {
          matTemp = new Node(copyMat(root.getData()))
          matTemp.getData()[xy[0]][xy[1]] = matTemp.getData()[nb[i]][nb[i + 1]]
          matTemp.getData()[nb[i]][nb[i + 1]] = 0
          matTemp.setFa(sumManhattan(matTemp.getData(), matEnd))
          matTemp.setFc(root.getFc() + 2)
          root.getChild().push(matTemp)
          arrayLeaf.push(matTemp)
      }
      if (nb.length > 0) {
          //remover root da lista de folhas
          posRoot = arrayLeaf.indexOf(root)
          //remove 1 elemento a partir do índice posRoot
          arrayLeaf.splice(posRoot, 1);
      }

      //selecionar filho de menor custo
      let k
      var pos, cost, lowestCost
      if (arrayLeaf.length > 0) {
          lowestCost = arrayLeaf[0].getFa() + arrayLeaf[0].getFc()
          pos = 0
          for (k = 1; k < arrayLeaf.length; k++) {
              cost = arrayLeaf[k].getFa() + arrayLeaf[k].getFc()
              if (cost < lowestCost) {
                  lowestCost = cost
                  pos = k
              }
          }
          //filho selecionado
          root = arrayLeaf[pos]
          path.push(root)
      }
  }
  show(root_)

  //for (let i = 0; i < path.length; i++) {
  //    console.log(path[i].data)
  //    console.log(path[i].fa + path[i].fc)
  //}
}

function hillClimbing() {
  var matrix = [
      [1, 2, 3],
      [4, 0, 5],
      [6, 7, 8]
  ];

  var xy, nb, matTemp;
  var done = false;
  var path = [];
  setMatEnd(copyMat(matrix));
  setMatStart([
      [1, 2, 3],
      [6, 5, 4],
      [0, 7, 8]]
  );

  var root = new Node(matStart);
  var root_ = root
  root.setFa(sumManhattan(root.getData(), matEnd))
  path.push(root);
  while (!done) {
      xy = posEmpty(root.getData());
      nb = neighbors(xy[0], xy[1]);
      //definir estados seguintes possiveis

      for (let i = 0; i < nb.length; i += 2) {
          matTemp = new Node(copyMat(root.getData()))
          matTemp.getData()[xy[0]][xy[1]] = matTemp.getData()[nb[i]][nb[i + 1]]
          matTemp.getData()[nb[i]][nb[i + 1]] = 0
          matTemp.setFa(sumManhattan(matTemp.getData(), matEnd))
          root.getChild().push(matTemp)
      }
      let k
      var pos, cost, lowestCost
      if (root.getChild().length > 0) {
          lowestCost = root.getChild()[0].getFa()
          pos = 0
          for (k = 1; k < root.getChild().length; k++) {
              cost = root.getChild()[k].getFa()
              if (cost < lowestCost) {
                  lowestCost = cost
                  pos = k
              }
          }
          //filho selecionado
          if (root.getChild()[pos].getFa() < root.getFa()) {
              root = root.getChild()[pos]
              path.push(root)
          }
          else {
              console.log("algoritmo interrompido!")//só continua enquanto ocorre melhora
              done = true
          }
      }
      else
          done = true
  }
  show(root_)
}

function show(root) {
  var queue = []
  if (root != null) {
      var aux = root
      queue.push(aux)
      while (queue.length > 0) {
          aux = queue.shift()
          console.log(aux.getData())
          for (let i of aux.getChild()) {
              console.log(i.getData())
              queue.push(i)
          }
          console.log("--")
      }
  }
} */
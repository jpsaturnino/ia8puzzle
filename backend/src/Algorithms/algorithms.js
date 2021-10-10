const Node = require('../Classes/Node');
var str = '{';


module.exports = {
    async AStar(request, response) {
        const { matEnd, n } = request.body;

        var matTemp;
        var xy, nb, posRoot;
        var arrayLeaf = [], arrayAux;
        var root
        var path = [];
        const matStart = shuffle(copyMat(matEnd));
        root = new Node(matStart);
        var root_ = root;
        root.setFa(sumManhattan(root.getData(), matEnd));
        root.setFc(0);
        path.push(root);
        arrayLeaf.push(root);
        while (!equalsMat(root.getData(), matEnd)) {
            xy = posEmpty(root.getData());
            nb = neighbors(xy[0], xy[1]);
            //definir os possiveis estados seguintes 
            for (let i = 0; i < nb.length; i += 2) {
                matTemp = new Node(copyMat(root.getData()));
                matTemp.getData()[xy[0]][xy[1]] = matTemp.getData()[nb[i]][nb[i + 1]];
                matTemp.getData()[nb[i]][nb[i + 1]] = 0;
                matTemp.setFa(sumManhattan(matTemp.getData(), matEnd));
                matTemp.setFc(root.getFc() + 2);
                matTemp.setFather(root)
                root.getChild().push(matTemp);
                arrayLeaf.push(matTemp);
            }
            if (nb.length > 0) {
                //remover root da lista de folhas
                posRoot = arrayLeaf.indexOf(root);
                //remove 1 elemento a partir do índice posRoot
                arrayLeaf.splice(posRoot, 1);
            }
            //selecionar filho de menor custo
            let k;
            var pos, cost, lowestCost;
            if (arrayLeaf.length > 0) {
                lowestCost = arrayLeaf[0].getFa() + arrayLeaf[0].getFc();
                pos = 0;
                for (k = 1; k < arrayLeaf.length; k++) {
                    cost = arrayLeaf[k].getFa() + arrayLeaf[k].getFc();
                    if (cost < lowestCost) {
                        lowestCost = cost;
                        pos = k;
                    }
                }
                //filho selecionado
                root = arrayLeaf[pos];
                path.push(root);
            }
        }
        //
        str = "{"
        convertToGraph(root_)
        str = str + "}"
        response.send(str)
    },

    async AStar_Jump(request, response) {
        const { matEnd, n } = request.body;
        var path = [];
        var matTemp;
        var xy, nb, root, posRoot;
        var arrayLeaf = [];

        const matStart = shuffle(copyMat(matEnd));
        //matStart = [[1, 2, 3], [4, 7, 0], [6, 8, 5]]
        root = new Node(matStart);
        var root_ = root;
        root.setFa(sumManhattan(root.getData(), matEnd));
        root.setFc(0);
        path.push(root);
        arrayLeaf.push(root);
        var it = 0
        while (!equalsMat(root.getData(), matEnd)) {
            var arrayAux = []
            //definir os possiveis estados seguintes para todas as folhas
            for (let k = 0; k < arrayLeaf.length; k++) {
                xy = posEmpty(arrayLeaf[k].getData());
                nb = neighbors(xy[0], xy[1]);

                for (let i = 0; i < nb.length; i += 2) {
                    matTemp = new Node(copyMat(arrayLeaf[k].getData()));
                    matTemp.getData()[xy[0]][xy[1]] = matTemp.getData()[nb[i]][nb[i + 1]];
                    matTemp.getData()[nb[i]][nb[i + 1]] = 0;
                    matTemp.setFa(sumManhattan(matTemp.getData(), matEnd));
                    matTemp.setFc(arrayLeaf[k].getFc() + 2);
                    matTemp.setFather(arrayLeaf[k])
                    arrayLeaf[k].getChild().push(matTemp);
                    arrayAux.push(matTemp);
                }
            }
            if (arrayAux.length > 0) {
                arrayLeaf = arrayAux.slice();
            }
            arrayAux = []
            for (let i = 0; i < arrayLeaf.length; i++)
                findChild(arrayLeaf[i], matEnd, arrayAux)
            arrayLeaf = arrayAux
            //selecionar filho de menor custo
            let k;
            var pos, cost, lowestCost;
            if (arrayLeaf.length > 0) {
                lowestCost = arrayLeaf[0].getFa() + arrayLeaf[0].getFc();
                pos = 0;
                for (k = 1; k < arrayLeaf.length; k++) {
                    cost = arrayLeaf[k].getFa() + arrayLeaf[k].getFc();
                    if (cost < lowestCost) {
                        lowestCost = cost;
                        pos = k;
                    }
                }
                //filho selecionado
                if (equalsMat(arrayLeaf[pos].getData(), matEnd))
                    root = arrayLeaf[pos]
                else
                    root = arrayLeaf[pos].getFather();
                path.push(root);
            }
            it++
        }
        show(root_);
        return response.json(root_)
    },

    async hillClimbing(request, response) {
        const { matEnd } = request.body
        const matStart = shuffle(copyMat(matEnd));
        var root = new Node(matStart);
        var root_ = root
        var xy, nb, matTemp;
        var done = false;
        var path = [];

        root.setFa(sumManhattan(root.getData(), matEnd))
        path.push(root);
        while (!done && !equalsMat(root.getData(), matEnd)) {
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
        str = "{"
        convertToGraph(root_)
        str = str + "}"
        response.send(str)
    }
}
function show(root) {
    var queue = [];
    if (root != null) {
        var aux = root;
        queue.push(aux);
        while (queue.length > 0) {
            aux = queue.shift();
            console.log("pai");
            console.log(aux.getData());
            console.log("filhos:");
            for (let i of aux.getChild()) {
                console.log(i.getData());
                queue.push(i);
            }
            console.log("--");
        }
    }
}

function convertToGraph(root) {
    if (root != null) {
        str = str + "\"attributes\":{" +
            "\"Row 1\": \"" + root.getData()[0] + "\"," +
            "\"Row 2\": \"" + root.getData()[1] + "\"," +
            "\"Row 3\": \"" + root.getData()[2] + "\"," +
            "\"F.A.\": \"" + root.getFa() + "\"," +
            "\"F.C.\": \"" + root.getFc() + "\""
            + "}"
        if (root.getChild().length > 0) {
            str = str + ",\"children\":["
            for (let i = 0; i < root.getChild().length; i++) {
                str = str + "{"
                convertToGraph(root.getChild()[i]);//1
                str = str + "}"
                if (i != root.getChild().length - 1)
                    str += ","
            }
            str += "]"
        }
    }

}

function equalsMat(mat1, mat2) {
    var diff = false;
    for (let i = 0; i < mat1.length && !diff; i++)
        for (let k = 0; k < mat1[i].length && !diff; k++)
            if (mat1[i][k] !== mat2[i][k])
                diff = true;
    return !diff
}
function copyVet(vet) {
    var vetCopy = []
    for (let i = 0; i < vet.length; i++)
        vetCopy[i] = vet[i]
    return vetCopy
}

function copyMat(mat) {
    var matCopy = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    for (let r = 0; r < mat.length; r++)
        for (let c = 0; c < mat[r].length; c++)
            matCopy[r][c] = mat[r][c];

    return matCopy;
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

function neighbors(x, y) {
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
function findChild(matrix, matEnd, arrayAux) {
    var xy = posEmpty(matrix.getData());
    var nb = neighbors(xy[0], xy[1]);
    if (equalsMat(matrix.getData(), matEnd))
        arrayAux.push(matrix);
    else {
        //definir os possiveis estados seguintes 
        for (let i = 0; i < nb.length; i += 2) {
            matTemp = new Node(copyMat(matrix.getData()));
            matTemp.getData()[xy[0]][xy[1]] = matTemp.getData()[nb[i]][nb[i + 1]];
            matTemp.getData()[nb[i]][nb[i + 1]] = 0;
            matTemp.setFa(sumManhattan(matTemp.getData(), matEnd));
            matTemp.setFc(matrix.getFc() + 2);
            matTemp.setFather(matrix)
            matrix.getChild().push(matTemp);
            arrayAux.push(matTemp);
        }
    }
}
function shuffle(matrix) {
    const min = 10, max = 20;
    var rand = parseInt(min + Math.random() * (max - min));
    var x, y; //coordenas da posição livre
    var found = false
    //encontrar posição vazia
    for (let r = 0; r < matrix.length && !found; r++) {
        for (let c = 0; c < matrix[r].length && !found; c++)
            if (matrix[r][c] === 0) {
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
        matrix[x][y] = matrix[nb[i]][nb[i + 1]];
        matrix[nb[i]][nb[i + 1]] = 0;
        x = nb[i];
        y = nb[i + 1];
        rand = rand - 1;
    }

    return matrix;
}
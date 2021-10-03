import React, {useState} from "react";

export default function Home() {
    const [matStart, setMatStart] = useState([[]])
    const [matEnd, setMatEnd] = useState([[]])
    //const [matTest, setMatTest] = useState([[]])
    function neighbors(x,y){
        var nb = []
        if(x!=2) //se nao e a ultima linha, tem vizinho pra baixo
            nb.push(x+1,y)
        if(x!=0) //se nao e a primeira linha, tem vizinho pra cima
            nb.push(x-1,y)    
        if(y!=2) //se nao e a ultima coluna, tem vizinho para o lado direito
            nb.push(x,y+1)
        if(y!=0)//se nao e a primeira coluna, tem vizinho para o lado esquerdo
            nb.push(x,y-1)
        return nb;
    }

    function shuffle(rows){
        const min=2, max=5;
        var rand=parseInt(min + Math.random() * (max - min));
        var x, y; //coordenas da posição livre
        var found = false

        //encontrar posição vazia
        for(let r=0; r<rows.length && !found; r++){
            for(let c=0; c<rows[r].length && !found; c++)
                if(rows[r][c] == 0){
                    found = true
                    x=r; y=c
                }
        }

        let i;
        var nb;
        //quantidade de movimentos do embaralho        
        while(rand>0){
            nb=neighbors(x,y); //acha os vizinhos do lugar vazio
            i=parseInt(Math.random() * (nb.length-1));
            if(i%2 != 0)
                i++;
            rows[x][y] = rows[nb[i]][nb[i+1]];
            rows[nb[i]][nb[i+1]] = 0;
            x = nb[i];
            y = nb[i+1];
            rand=rand-1;
        }
        setMatStart(rows)
    }

    function posEmpty(mat){
        var found = false
        var x, y
        //encontrar posição vazia
        for(let r=0; r<mat.length && !found; r++){
            for(let c=0; c<mat[r].length && !found; c++)
                if(mat[r][c] == 0){
                    found = true
                    x=r; y=c
                }           
            }
        return [x,y]
    }
    function copyMat(mat){
        var matCopy = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
        for(let r=0; r<mat.length; r++)
            for(let c=0; c<mat[r].length; c++)
                matCopy[r][c] = mat[r][c]
            
        return matCopy           
    }
    function sumManhattan(mat1, mat2){//mat1 = matriz atual, mat2 = matriz de estado possivel
        var sum = 0
        var found
        let r,c,x,y
        for(r=0; r<mat1.length; r++)
            for(c=0; c<mat1[0].length; c++){
                found = false
                for(x=0; x<mat2.length && !found; x++)
                    for(y=0; y<mat2[0].length && !found; y++)
                        if(mat1[r][c]==mat2[x][y])
                            found = true
                sum = sum + Math.abs(x-r) + Math.abs(y-c)
            }
    }
    function AStar(){
        var aux, xy, nb
        //tem que criar tipo uma lista encadeada
        //uma classe (sei q não vai ser classe mesmo) que tem um matriz (atual) e uma lista dessa mesma classe(pra guardar as possiveis matrizes seguintes)
        var mat=[[[]]]
        var matrix = [
            [1,2,3],
            [4,0,5],
            [6,7,8]
        ];
        setMatEnd(copyMat(matrix))
        shuffle(matrix)


        xy = posEmpty(matStart)
        nb = neighbors(xy[0],xy[1])
        //definindo possibilidades
        /*for(let i=0; i<nb.length; i+=2){
            mat.push(matCopy(matStart))
            aux = matStart[xy[0]][xy[1]] 
        }
        mat.push([[1,2,3],[10,11,12]])
        console.log(mat)*/
    }

    function bestFirst() {
        
    }
    
    return (
        <div>
            <h1>8Puzzle</h1>
            <div>
                <div>
                    <select name="algoritmo" id="agoritmo">
                        <option value="A*">A*</option>
                        <option value="BestFirst">BestFirst</option>
                    </select>
                </div>
                <button onClick={()=>AStar()}>Iniciar</button>
                <button>Embaralhar</button>
            </div>
        </div>
    );
}
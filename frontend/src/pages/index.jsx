import React, { useState } from "react";
import api from "../services/api"
//import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import Tree from 'react-d3-tree';
import './tree.css'

export default function Home() {
    const [matEnd, setMatEnd] = useState([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ])
    const [option, setOption] = useState('A*');
    const [orgChart, setOrgChart] = useState(null);
    const [row1, setRow1] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    function convertToMat(row) {
        var arr = [];
        arr.push(row.slice(0, 3))
        arr.push(row.slice(3, 6))
        arr.push(row.slice(6, 9))
        console.log(arr);
        setMatEnd(arr)
    }

    async function AStar() {
        var n = 2
        console.log(matEnd);
        const resp = await api.post('/astar', { matEnd, n });
        setOrgChart(resp.data);
    }

    async function HillClimbing() {
        const resp = await api.post('/hillclimbing', { matEnd });
        setOrgChart(resp.data);
    }

    const handle = () => {
        if (option === 'A*')
            AStar()
        else
            HillClimbing()
    }


    function findIndex(elem) {
        for (var i in row1)
            if ([...row1][i] === elem)
                return i
    }

    function checkInput(value, pos) {
        value = parseInt(value[1])
        if (value != null && value < 9) {
            var row = [...row1]
            var i = findIndex(value)
            row[i] = [...row1][pos]
            row[pos] = value
            setRow1(row)
            convertToMat(row)
        }
    }

    return (
        <>
            <div className="App">
                <div>
                    <h1 className='text-center'>8Puzzle</h1>
                    <table className='board'>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        onChange={e => checkInput(e.target.value, 0)}
                                        className='tile' type='number' maxLength='1'
                                        value={[...row1][0]}
                                    />
                                </td>
                                <td><input
                                    onChange={e => checkInput(e.target.value, 1)}
                                    className='tile' type='number' maxLength='1'
                                    value={[...row1][1]}
                                /></td>
                                <td><input
                                    onChange={e => checkInput(e.target.value, 2)}
                                    className='tile' type='number'
                                    value={[...row1][2]}
                                /></td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        onChange={e => checkInput(e.target.value, 3)}
                                        className='tile' type='number' maxLength='1'
                                        value={[...row1][3]}
                                    />
                                </td>
                                <td><input
                                    onChange={e => checkInput(e.target.value, 4)}
                                    className='tile' type='number' maxLength='1'
                                    value={[...row1][4]}
                                /></td>
                                <td><input
                                    onChange={e => checkInput(e.target.value, 5)}
                                    className='tile' type='number'
                                    value={[...row1][5]}
                                /></td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        onChange={e => checkInput(e.target.value, 6)}
                                        className='tile' type='number' maxLength='1'
                                        value={[...row1][6]}
                                    />
                                </td>
                                <td><input
                                    onChange={e => checkInput(e.target.value, 7)}
                                    className='tile' type='number' maxLength='1'
                                    value={[...row1][7]}
                                /></td>
                                <td><input
                                    onChange={e => checkInput(e.target.value, 8)}
                                    className='tile' type='number'
                                    value={[...row1][8]}
                                /></td>
                            </tr>
                        </tbody>
                    </table>
                    <select
                        onChange={e => setOption(e.target.value)}
                        name="algoritmo" id="agoritmo"
                        className='select'
                    >
                        <option value="A*">A*</option>
                        <option value="HillClimbing">HillClimbing</option>
                    </select>
                    <button className="btn-primary" onClick={handle}>Iniciar</button>

                </div>
            </div>

            {
                orgChart !== null
                    ? <>
                        <h1 className='text-center'>Arvore Gerada</h1>
                        <div className='table-info'>
                            <p>Tempo: </p>
                            <p>Nós visitados: </p>
                            <p>Tamanho do caminho da solução: </p>
                        </div>
                        <div id="treeWrapper" style={{ width: '100%', height: '25em' }}>
                            <Tree
                                data={orgChart}
                                orientation='vertical' pathFunc='straight'
                                rootNodeClassName="node__root"
                                branchNodeClassName="node__branch"
                                leafNodeClassName="node__leaf"
                            />
                        </div>
                    </> : null
            }
        </>
    );
}
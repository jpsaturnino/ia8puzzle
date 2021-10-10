import React, { useState } from "react";
import api from "../services/api"
//import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import { Canvas } from 'reaflow';
import Tree from 'react-d3-tree';
import './tree.css'

export default function Home() {
    //const [matEnd, setMatEnd] = useState([[]])
    const [option, setOption] = useState('A*');
    var available = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const orgChart = {};

    const [teste, setTeste] = useState({});

    async function AStar() {
        var n = 2
        const matEnd = [[1, 2, 3], [4, 0, 5], [6, 7, 8]]
        const resp = await api.post('/astar', { matEnd, n });
        setTeste(resp);

    }

    async function HillClimbing() {
        const matEnd = [[1, 2, 3], [4, 0, 5], [6, 7, 8]]
        const resp = await api.post('/hillclimbing', { matEnd });
        console.log(resp);
    }

    const handle = () => {
        if (option === 'A*')
            AStar()
        else
            HillClimbing()
    }

    const [row1, setRow1] = useState([]);
    const [row2, setRow2] = useState([]);
    const [row3, setRow3] = useState([]);

    function checkInput(value) {
        if (available.includes(parseInt(value)))
            available = available.filter(item => item !== parseInt(value))

    }

    return (
        <>
            <div className="App">
                <div>
                    <h1 className='text-center'>8Puzzle</h1>
                    <table className='board'>
                        <tr>
                            <td>
                                <input
                                    onChange={e => checkInput(e.target.value)}
                                    className='tile' type='number' maxLength='1' />
                            </td>
                            <td><input className='tile' type='number' maxLength='1' /></td>
                            <td><input className='tile' type='number' maxLength='1' /></td>
                        </tr>
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
            <div id="treeWrapper" style={{ width: '50em', height: '20em' }}>
                <Tree
                    data={orgChart}
                    orientation='vertical' pathFunc='straight'
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                />
            </div>
            {/* <div className='display-linebreak' style={{ top: 0, bottom: 0, left: 0, right: 0 }}>

                <Canvas
                    fit={true}
                    nodes={nodes}
                    edges={edges}
                    zoomable={true}
                    readonly={true}
                />

            </div> */}
            {/* <div className='App'>
                <div className='mt-5'>
                    <h1 className='text-center'>8Puzzle</h1>
                    <div className='board'>
                        <div className='mt-2'>
                            <select onChange={e => setOption(e.target.value)} name="algoritmo" id="agoritmo">
                                <option value="A*">A*</option>
                                <option value="HillClimbing">HillClimbing</option>
                            </select>
                            <input type='text' placeholder='' />
                        </div>
                        <div className='mt-2'>
                            <button className="btn-primary" onClick={handle}>Iniciar</button>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
}
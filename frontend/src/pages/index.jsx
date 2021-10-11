import React, { useRef, useState } from "react";
import { Link } from 'react-router-dom'
import api from "../services/api"
import './style.css'
import Tree from 'react-d3-tree';
import './tree.css'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#111',
    border: '2px solid #222',
    boxShadow: 24,
    p: 4,
    height: 500,
    overflow: 'scroll'
};

export default function Home() {
    const graphSection = useRef(null);
    const [matEnd, setMatEnd] = useState([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ])
    const [option, setOption] = useState('A*');
    const [tree, setTree] = useState(null);
    const [treeSolution, setTreeSolution] = useState(null);
    const [row1, setRow1] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const [pathLen, setPathLen] = useState('-');
    const [executionTime, setExcecutionTime] = useState('-');
    const [visitedLen, setVisitedLen] = useState('-')
    const [fullTree, setFullTree] = useState(false);
    const [fullTreeSolution, setfullTreeSolution] = useState(false);
    const [mode, setMode] = useState('normal');
    const [report, setReport] = useState([]);
    const [finalReport, setFinalReport] = useState([
        ["A*", 0, 0],
        ["Best First", 0, 0],
        ["Branch and Bound", 0, 0],
        ["Hill Climbing", 0, 0],
    ]);

    function gotoGraph() {
        window.scrollTo({ top: graphSection.current.scrollIntoView() })
    }

    function convertToMat(row) {
        var arr = [];
        arr.push(row.slice(0, 3))
        arr.push(row.slice(3, 6))
        arr.push(row.slice(6, 9))
        setMatEnd(arr)
    }

    function selectAStarMode() {
        if (mode === 'normal')
            AStar();
        else
            AStar2();
    }

    async function setTreeInfo(resp, algorithm) {
        setTree(resp);
        const pl = await api.get('/pathlen');
        setPathLen(pl.data);
        const pls = await api.get('/pathlensolution');
        setVisitedLen(pls.data);
        const et = await api.get('/executiontime');
        setExcecutionTime(et.data);
        const vt = await api.get('/treesolution');
        setTreeSolution(vt.data);
        var arr = [...report]
        if (algorithm === "AStar")
            algorithm = "A*"
        arr.push([
            "Algoritmo: " + algorithm,
            "Tempo execução: " + et.data + " ms",
            "Tamanho do caminho total: " + pl.data,
            "Tamanho do caminho da solução:" + pls.data
        ])
        FinalReport(algorithm, et.data)
        setReport(arr);
    }
    function FinalReport(algorithm, exectime) {
        var smexec = 0;
        var c = 0;
        var arr = [];
        if (algorithm === 'AStar') {
            smexec = [...finalReport][0][1]
            console.log([...finalReport][0][1]);
            smexec += exectime;
            c = [...finalReport][0][2]
            console.log([...finalReport][0][2]);
            c++;
            arr = [];
            arr.push(["A*", smexec, c])
            arr.push([...finalReport][1])
            arr.push([...finalReport][2])
            arr.push([...finalReport][3])
            setFinalReport(arr);
        } else if (algorithm === 'Best First') {
            smexec = [...finalReport][1][1]
            smexec += exectime;
            c = [...finalReport][1][2]
            c++;
            arr = [];
            arr.push([...finalReport][0])
            arr.push([algorithm, smexec, c])
            arr.push([...finalReport][2])
            arr.push([...finalReport][3])
            setFinalReport(arr);
        } else if (algorithm === 'Branch and Bound') {
            smexec = [...finalReport][2][1]
            smexec += exectime;
            c = [...finalReport][2][2]
            c++;
            arr = [];
            arr.push([...finalReport][0])
            arr.push([...finalReport][1])
            arr.push([algorithm, smexec, c])
            arr.push([...finalReport][3])
            setFinalReport(arr);
        } else {
            smexec = [...finalReport][3][1]
            smexec += exectime;
            c = [...finalReport][3][2]
            c++;
            arr = [];
            arr.push([...finalReport][0])
            arr.push([...finalReport][1])
            arr.push([...finalReport][2])
            arr.push([algorithm, smexec, c])
            setFinalReport(arr);
        }
    }

    async function AStar2() {
        const resp = await api.post('/astarjump', { matEnd });
        setTreeInfo(resp.data, "AStar2");
    }

    async function AStar() {
        const resp = await api.post('/astar', { matEnd });
        setTreeInfo(resp.data, "AStar");
    }

    async function HillClimbing() {
        const resp = await api.post('/hillclimbing', { matEnd });
        setTreeInfo(resp.data, "Hill Climbimg");
    }

    async function BestFirst() {
        const resp = await api.post('/bestfirst', { matEnd })
        setTreeInfo(resp.data, "Best First")
    }

    async function BranchAndBound() {
        const resp = await api.post('/branchbound', { matEnd })
        setTreeInfo(resp.data, "Branch and Bound")
    }

    const handle = () => {
        if (option === 'A*')
            selectAStarMode();
        else if (option === 'BestFirst')
            BestFirst()
        else if (option === 'BranchAndBound')
            BranchAndBound()
        else
            HillClimbing()
    }

    function findIndex(elem) {
        for (var i in row1)
            if ([...row1][i] === elem)
                return i
    }

    const [open, setOpen] = useState(false);
    const [openHelp, setOpenHelp] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenHelp = () => setOpenHelp(true);
    const handleCloseHelp = () => setOpenHelp(false);

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
                    <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                        <h1 className='text-center'>8Puzzle</h1>
                        <button onClick={handleOpenHelp} style={{ marginLeft: '5px', height: '20px', paddingTop: '0px', paddingBottom: '0px', width: 'fit-content', margin: '0px', }}>?</button>
                    </div>
                    <div style={{ display: 'flex' }}>
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
                    </div>
                    <select
                        onChange={e => setOption(e.target.value)}
                        name="algoritmo" id="agoritmo"
                        className='select'
                    >
                        <option value="A*">A*</option>
                        <option value="BestFirst">Best First</option>
                        <option value="BranchAndBound">Branch and Bound</option>
                        <option value="HillClimbing">Hill Climbing</option>
                    </select>
                    {
                        option === "A*"
                            ? <>
                                <div className='input-radio'>
                                    <input checked type="radio"
                                        name="A*Mode" id="normal-mode"
                                        onChange={() => setMode('normal')}
                                    />
                                    <label htmlFor="normal-mode">Normal</label>
                                    <input type="radio" name="A*Mode"
                                        id="burst-mode" value="Enabled"
                                        onChange={() => setMode('burst')}
                                    />
                                    <label htmlFor="burst-mode">Modo Curioso</label>
                                </div>
                            </>
                            : null
                    }
                    <button onClick={handle}>Iniciar</button>
                </div>
                {
                    tree !== null
                        ?
                        <>
                            <div style={{ width: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                                <button style={{ width: '45%' }}
                                    onClick={() => {
                                        setFullTree(true);
                                        setfullTreeSolution(false);
                                        gotoGraph();
                                    }}>
                                    Mostrar Árvore Completa
                                </button>
                                <button style={{ width: '45%' }}
                                    onClick={() => {
                                        setfullTreeSolution(true);
                                        setFullTree(false);
                                        gotoGraph();
                                    }}>Mostrar Árvore da Solução
                                </button>
                            </div>

                        </>
                        : null
                }

            </div>
            <div ref={graphSection}>
                {tree != null
                    ?
                    <>
                        <div className='table-info'>
                            <p><b>Tempo:</b> {executionTime}ms</p>
                            <p><b>Tamanho do caminho da solução:</b> {visitedLen}</p>
                            <p><b>Nós visitados:</b> {pathLen}</p>
                            <button onClick={handleOpen}>Relatório</button>
                        </div>
                    </>
                    : null
                }
                {
                    fullTree && tree != null
                        ? <>
                            <h1 className='text-center'>Árvore Completa</h1>
                            <div className='center'>
                                <div id="treeWrapper" style={{ margin: '30px 0px 30px 0px', width: '90%', height: '32em', border: '2px solid #7a66ec' }}>
                                    <Tree
                                        data={tree}
                                        orientation='vertical' pathFunc='straight'
                                        rootNodeClassName="node__root"
                                        branchNodeClassName="node__branch"
                                        leafNodeClassName="node__leaf"
                                    />
                                </div>
                            </div>
                        </> :
                        null
                }
                {
                    fullTreeSolution && treeSolution != null
                        ? <>
                            <h1 className='text-center'>Árvore da Solução</h1>
                            <div className='center'>
                                <div id="treeWrapper" style={{ margin: '0px 10px 0px 10px', width: '90%', height: '32em', border: '2px solid #7a66ec' }}>
                                    <Tree
                                        data={treeSolution}
                                        orientation='vertical' pathFunc='straight'
                                        rootNodeClassName="node__root"
                                        branchNodeClassName="node__branch"
                                        leafNodeClassName="node__leaf"
                                    />
                                </div>
                            </div>
                        </>
                        : null
                }
            </div>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ color: '#7a66ec' }} id="modal-modal-title" variant="h6" component="h2">
                            Relatório Geral
                        </Typography>

                        {
                            finalReport?.map((al, i) => {
                                return (
                                    al[2] != 0
                                        ?
                                        <div key={i}>
                                            <p>Algoritmo: {al[0]}</p>
                                            <p>Tempo Médio de Execução: {(al[1] / al[2]).toFixed(2)} ms</p>
                                            <p>-----</p>
                                        </div>
                                        : null
                                )
                            })
                        }
                        <Typography sx={{ mt: 4, color: '#7a66ec' }} id="modal-modal-title" variant="h6" component="h2">
                            Relatório
                        </Typography>
                        {
                            report?.map((rel, i) => {
                                return (
                                    <div key={i}>
                                        {
                                            rel.map((elem, j) => {
                                                return (
                                                    <div key={j}>
                                                        <p>{elem}</p>
                                                    </div>
                                                )
                                            })}
                                        <p>-----</p>
                                    </div>
                                )
                            })
                        }
                    </Box>
                </Modal>
            </div>
            <div>
                <Modal
                    open={openHelp}
                    onClose={handleCloseHelp}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ color: '#7a66ec' }} id="modal-modal-title" variant="h6" component="h2">
                            Sobre
                        </Typography>
                        <Typography id="modal-modal-description" variant="p" component="p">
                            Esta aplicação permite a vizualização grafica, de diferentes algoritmos de busca informada
                            utilizando:
                        </Typography>
                        <Typography sx={{ mt: 1 }} id="modal-modal-description" variant="p" component="p">
                            - F.A (Função de Avaliação): a soma das distâncias manhattan de cada peça da matriz atual em relação ao estado final.
                        </Typography>
                        <Typography sx={{ mt: 1 }} id="modal-modal-description" variant="p" component="p">
                            - F.C (Função de Custo): a soma das distâncias manhattan de cada peça da matriz atual em relação à matriz pai.
                        </Typography>
                        <Typography sx={{ mt: 3, color: '#7a66ec' }} id="modal-modal-title" variant="h6" component="h2">
                            Instruções
                        </Typography>
                        <Typography id="modal-modal-description" variant="p" component="p">
                            Você deve preencher a matriz com o estado final desejado.
                        </Typography>
                        <Typography sx={{ mt: 1 }} id="modal-modal-description" variant="p" component="p">
                            Ao clicar em iniciar, serão realizadas suscessivas movimentações no estado final, a fim de determinar o estado inicial.
                        </Typography>
                        <Typography sx={{ mt: 1 }} id="modal-modal-description" variant="p" component="p">
                            A partir disso é possível escolher entre vizualizar a árvore de desenvolvimento completa ou apenas a árvore do caminho solução.
                        </Typography>
                        <Typography sx={{ mt: 3, color: '#7a66ec' }} id="modal-modal-title" variant="h6" component="h2">
                            Relatório
                        </Typography>
                        <Typography id="modal-modal-description" variant="p" component="p">
                            Os relatórios são gerados em consequência das buscas executadas e podem ser vizualizados clicando em "Relatório" no canto superior direito à árvore.
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </>
    );
}
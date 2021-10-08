import React, { useState } from "react";
import api from "../services/api"
//import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const [matEnd, setMatEnd] = useState([[]])
    const [option, setOption] = useState('A*');

    async function AStar() {
        const resp = await api.post('/astar', { matEnd });
        console.log(resp);
    }

    async function HillClimbing() {
        const resp = await api.post('/hillclimbing', { matEnd });
        console.log(resp);
    }

    const handle = () => {
        if (option != 'A*')
            AStar()
        else
            HillClimbing()
    }

    return (
        <div classsName='container'>
            <div className='row justify-content-center'>
                <h1>8Puzzle</h1>
                <div className='col'>
                    <div>
                        <select onChange={e => setOption(e.target.value)} name="algoritmo" id="agoritmo">
                            <option value="A*">A*</option>
                            <option value="HillClimbing">HillClimbing</option>
                        </select>
                    </div>
                    <button onClick={handle}>Iniciar</button>

                    <button>Embaralhar</button>

                </div>
            </div>
        </div>
    );
}
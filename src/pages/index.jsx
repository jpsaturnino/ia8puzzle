import React from "react";

export default function Home() {
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
                <button>Iniciar</button>
                <button>Embaralhar</button>
            </div>
        </div>
    );
}
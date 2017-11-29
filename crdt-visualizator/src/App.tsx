import * as React from 'react';
import './App.css';
import {Stage} from 'react-konva';
import Graph from './components/Graph';
import UpdateLayer from "./components/UpdateLayer";

class App extends React.Component {
    render() {
        return (
            <Stage x={0} y={0}  height={400} width={800} >
               <UpdateLayer/>
                <Graph/>

            </Stage>);
    }
}

export default App;

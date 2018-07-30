import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Set_aw } from './classes/crdts/set_aw'
import { Counter } from "./classes/crdts/counter";
import { Integer } from "./classes/crdts/integer";


ReactDOM.render(
    <App crdt={new Counter()} />,
    document.getElementById('counter') as HTMLElement,

);

ReactDOM.render(
    <App crdt={new Set_aw()} />,
    document.getElementById('addWinSet') as HTMLElement,

);

ReactDOM.render(
    <App crdt={new Integer()} />,
    document.getElementById('integer') as HTMLElement,

);
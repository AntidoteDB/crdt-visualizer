import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
    <App crdt_Type_enum={1}  />,
    document.getElementById('counter') as HTMLElement,

);

ReactDOM.render(
    <App crdt_Type_enum={2} />,
    document.getElementById('addWinSet') as HTMLElement,

);

import * as React from 'react';
import Tool from "./components/Tool";
import { CRDT_type } from './classes/CRDT_type';

interface Props{
    crdt: CRDT_type;
}

class App extends React.Component  <Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    render() {
        return (
              <Tool crdt={this.props.crdt}/>

            );
    }
}

export default App;

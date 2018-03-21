import * as React from 'react';
import Tool from "./components/Tool";

interface Props{
    crdt_Type_enum:number;
}

class App extends React.Component  <Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    render() {
        return (
              <Tool crdt_Type_enum={this.props.crdt_Type_enum}/>

            );
    }
}

export default App;

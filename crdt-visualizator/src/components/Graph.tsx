import * as React from 'react';
import {Group, Layer} from 'react-konva';
import Replica from './Replica';
import CrdtName from "./CrdtName";
import Operation from "./Operation";

interface States {

}

interface Props {
    onOperationClick: (e: any, operation_name: string, operation: Operation) => void;
}

class Graph extends React.Component <Props, States> {

    constructor(props: Props) {
        super(props);

    }


    render() {

        return (
            <Layer>
                <Group>
                    <CrdtName x={300} y={10} name={'CRDT'}/>
                    <Replica points={[100, 100, 700, 100]} name={'R1'} onOperationClick={this.props.onOperationClick}/>
                    <Replica points={[100, 200, 700, 200]} name={'R2'} onOperationClick={this.props.onOperationClick}/>
                    <Replica points={[100, 300, 700, 300]} name={'R3'} onOperationClick={this.props.onOperationClick}/>
                </Group>
            </Layer>
        )

    }

}

export default Graph;

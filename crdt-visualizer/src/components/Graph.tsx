import * as React from 'react';
import {Group, Layer, Stage, Rect} from 'react-konva';
import Replica from './Replica';
import CrdtName from "./CrdtName";
import Operation from "./Operation";
import visualizer from "../classes/visualizer";
import Update from "./Update";




interface States {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    fromReplica: number | string;
    toReplica: number | string;
    isDrawing: boolean;
    updates: Update[];
}


interface Props {
    onOperationClick: (e: any, operation_name: string, operation: Operation) => void;
    visualizer: visualizer;
}

class Graph extends React.Component <Props, States> {

    constructor(props: Props) {
        super(props);
        this.state = {
            fromX: 0,
            fromY: 0,
            toX: 0,
            toY: 0,
            fromReplica: "no replica",
            toReplica: "no replica",
            isDrawing: false,
            updates: []
        }

    }


    render() {

        return (
            <Stage x={0} y={0} height={window.innerHeight} width={window.innerWidth} onMouseDown={this.onMouseDown}
                   onMouseUp={this.onmouseup}>
                <Layer x={0} y={0} height={window.innerHeight} width={window.innerWidth} onMouseMove={this.onmousemove}>
                    <Rect x={0} y={0} width={window.innerWidth} height={window.innerHeight}></Rect>
                    <Group>
                        {this.state.isDrawing ?
                            <Update
                                fromX={this.state.fromX}
                                fromY={this.state.fromY}
                                toX={this.state.toX}
                                toY={this.state.toY}


                            /> : null
                        }

                    </Group>
                    {this.state.updates.map((update, index) =>
                        <Group key={index}>
                            {update.render()}
                        </Group>
                    )}


                </Layer>
                <Layer>
                    <CrdtName x={300} y={10} name={this.props.visualizer.get_DataType_Name()}/>
                </Layer>
                <Layer>
                    <Group>
                        <Replica points={[100, 100, 700, 100]} name={'R1'}
                                 onOperationClick={this.props.onOperationClick}
                                 visualizer={this.props.visualizer}
                                 onMouseDown={() => {
                                     this.setState({fromReplica: 0})
                                 }}
                                 onMouseUp={() => {
                                     this.setState({toReplica: 0});
                                     setTimeout(() => {
                                         this.setState({fromReplica: "no replica", toReplica: "no replica"});
                                     }, 1000);
                                 }}/>
                        <Replica points={[100, 200, 700, 200]} name={'R2'}
                                 onOperationClick={this.props.onOperationClick}
                                 visualizer={this.props.visualizer}
                                 onMouseDown={() => {
                                     this.setState({fromReplica: 1})
                                 }}
                                 onMouseUp={() => {
                                     this.setState({toReplica: 1});
                                     setTimeout(() => {
                                         this.setState({fromReplica: "no replica", toReplica: "no replica"});
                                     }, 1000);
                                 }}/>
                        <Replica points={[100, 300, 700, 300]} name={'R3'}
                                 onOperationClick={this.props.onOperationClick}
                                 visualizer={this.props.visualizer}
                                 onMouseDown={() => {
                                     this.setState({fromReplica: 2})
                                 }}
                                 onMouseUp={() => {
                                     this.setState({toReplica: 2})
                                     ;
                                     setTimeout(() => {
                                         this.setState({fromReplica: "no replica", toReplica: "no replica"});
                                     }, 1000);
                                 }}/>
                    </Group>
                </Layer>
            </Stage>
        )

    }

    onMouseDown = (e: any) => {
        if (this.state.fromReplica === "no replica") {
            return;
        }
        this.setState({
            isDrawing: true, fromX: e.evt.clientX,
            fromY: e.evt.clientY, toX: e.evt.clientX, toY: e.evt.clientY
        });


    }
    onmouseup = () => {
        if (this.state.toReplica === "no replica") {
            this.setState({isDrawing: false});
            return
        }
        let a = {
            fromX: this.state.fromX, fromY: this.state.fromY,
            toX: this.state.toX, toY: this.state.toY
        };
        let x = this.state.updates;
        if (this.state.fromReplica != this.state.toReplica &&
            this.state.toX>this.state.fromX&&
            typeof this.state.fromReplica == 'number' &&
            typeof this.state.toReplica == 'number') {
            this.setState({isDrawing: false, updates: x.concat(new Update(a))});
            this.props.visualizer.add_update(this.state.fromReplica, this.state.fromX, this.state.toReplica, this.state.toX)
        }
        else {
            this.setState({isDrawing: false});
        }
    }

    onmousemove = (e: any) => {
        if (this.state.isDrawing) {
            this.setState({toX: e.evt.clientX, toY: e.evt.clientY});
        }
    }
}

export default Graph;

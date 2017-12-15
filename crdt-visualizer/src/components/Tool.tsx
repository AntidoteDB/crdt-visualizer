import * as React from 'react';
import {Stage} from 'react-konva';
import Graph from './Graph';
import UpdateLayer from "./UpdateLayer";
import Operation from "./Operation";
import visualizer from "../classes/visualizer";
import {operation} from "../classes/operation";


interface States {

    textEditVisible: boolean,
    textX: number,
    textY: number,
    textValue: string,
    op?: Operation,
    visualizer: visualizer;
}

interface Props {
}


class Tool extends React.Component <Props, States> {

    constructor(props: Props) {
        super(props)
        this.state = {
            textEditVisible: false,
            textX: 0,
            textY: 0,
            textValue: '',
            visualizer: new visualizer()
        };

    }

    render() {

        return (
            <div>
                <Stage x={0} y={0} height={window.innerHeight} width={window.innerWidth}>
                    <UpdateLayer onOperationClick={this.handleTextDblClick}/>
                    <Graph onOperationClick={this.handleTextDblClick} visualizer={this.state.visualizer}/>

                </Stage>
                <textarea
                    value={this.state.textValue}
                    style={{
                        display: this.state.textEditVisible ? 'block' : 'none',
                        position: 'absolute',
                        top: this.state.textY + 'px',
                        left: this.state.textX + 'px'
                    }}
                    onChange={this.handleTextEdit}
                    onKeyDown={this.handleTextareaKeyDown}
                />
            </div>
        );
    }

    handleTextDblClick = (e: any, operation_name: string, operation: Operation) => {
        const absPos = e.target.getAbsolutePosition();
        this.setState({
            textEditVisible: true,
            textX: absPos.x,
            textY: absPos.y,
            textValue: operation_name,
            op: operation
        });
    };
    handleTextEdit = (e: any) => {
        this.setState({
            textValue: e.target.value
        });
    };
    handleTextareaKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            this.setState({
                textEditVisible: false
            });
            if (this.state.op == null || this.state.op == undefined) return;
            this.state.op.setState({operation: this.state.textValue});

            var x = this.state.op.props.replica.props.name;
            var y = 0;
            switch (x) {
                case "R1": {
                    y = 0;
                    break;
                }
                case "R2": {
                    y = 1;
                    break;
                }
                case "R3": {
                    y = 2;
                    break;
                }
            }
            let opName = this.state.op.state.operation;
            if (this.state.visualizer.variable_list[y].getOp(this.state.op.state.x) === null ||
                ( this.state.visualizer.variable_list[y].getOp(this.state.op.state.x)!.time_stamp === this.state.op.state.x
                    && this.state.visualizer.variable_list[y].getOp(this.state.op.state.x)!.operation != opName)) {
                this.state.visualizer.remove_operation(y, this.state.op.state.x);
                this.state.visualizer.add_operation(y, new operation(opName, this.state.op.state.x))
                this.state.visualizer.execute_updates();
            }
        }
    };

}

export default Tool;

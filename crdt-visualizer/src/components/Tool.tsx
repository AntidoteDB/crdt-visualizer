import * as React from 'react';
import Graph from './Graph';
import Operation from "./Operation";
import visualizer from "../classes/visualizer";
import {operation} from "../classes/operation";


interface States {

    textEditVisible: boolean,
    ErrorVisible: boolean,
    errorMessage?: string,
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
            ErrorVisible: false,
            textX: 0,
            textY: 0,
            textValue: '',
            visualizer: new visualizer()
        };

    }

    render() {

        return (
            <div>


                <Graph onOperationClick={this.handleTextDblClick} visualizer={this.state.visualizer}/>


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
                <div>
                    <div style={{
                        display: this.state.ErrorVisible ? 'block' : 'none',
                        position: 'absolute',
                        top: this.state.textY + 20 + 'px',
                        left: this.state.textX + 20 + 'px',
                        background: '#f44336',
                        color: 'white',
                        padding: 20 + 'px',
                        cursor: 'wait',
                        opacity: 0.7,
                        borderRadius: 25 + 'px',
                    }}><b>{this.state.errorMessage}</b> is not a valid Operation.
                    </div>
                </div>

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
                    && this.state.visualizer.variable_list[y].getOp(this.state.op.state.x)!.operation != opName)
            ) {
                let newOp = new operation(opName, this.state.op.state.x);
                if (newOp.is_valid_operation(newOp.operation)) {
                    this.state.op.setState({fill: '#3CB371'});
                    this.setState({errorMessage: ""});
                } else {
                    setTimeout(() => {
                        this.setState({ErrorVisible: false});
                    }, 3000);
                    this.state.op!.setState({fill: '#207192', operation: this.state.visualizer.default_Operation()});
                    this.setState({ErrorVisible: true});
                    this.setState({errorMessage: newOp.operation});
                }
                this.state.visualizer.remove_operation(y, this.state.op.state.x);
                this.state.visualizer.add_operation(y, newOp)
            }
        }
    };

}

export default Tool;

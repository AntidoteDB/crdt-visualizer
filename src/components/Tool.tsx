import * as React from 'react';
import Graph from './Graph';
import Operation from './Operation';
import visualizer from '../classes/visualizer';
import {CRDT_type} from '../classes/CRDT_type';


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
    crdt: CRDT_type
}

class Tool extends React.Component <Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            textEditVisible: false,
            ErrorVisible: false,
            textX: 0,
            textY: 0,
            textValue: '',
            visualizer: new visualizer(this.props.crdt),
        };

    }

    render() {

        return (
            <div>
                <Graph onOperationClick={this.handleTextDblClick} visualizer={this.state.visualizer}/>
                <input list={this.props.crdt.toString()}
                    value={this.state.textValue}
                    style={{
                        display: this.state.textEditVisible ? 'block' : 'none',
                        position: 'absolute',
                        top: this.state.textY + 'px',
                        left: this.state.textX + 'px',
                        borderBottom:'2px solid red',
                        width:'auto',
                        padding: '20px  ',
                        fontSize:'20px',
                        margin:'30px 0'

                    }}
                    onChange={this.handleTextEdit}
                    onKeyDown={this.handleTextareaKeyDown}

                />
                <datalist id={this.props.crdt.toString()}>
                    {this.state.visualizer.getValidOperations().map((value:string)=>
                        <option value={value} ></option>)}
                </datalist>

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
        const absPos = e.evt;
        this.setState({
            textEditVisible: true,
            textX: absPos.clientX - document!.documentElement!.offsetLeft + document.body.scrollLeft   + document!.documentElement!.scrollLeft,
            textY: absPos.clientY - document!.documentElement!.offsetTop+ document.body.scrollTop + document!.documentElement!.scrollTop,
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
                case 'R1': {
                    y = 0;
                    break;
                }
                case 'R2': {
                    y = 1;
                    break;
                }
                case 'R3': {
                    y = 2;
                    break;
                }
            }
            let opName = this.state.op.state.operation;
            if (this.state.visualizer.getOp(y, this.state.op.state.x) === null ||
                ( this.state.visualizer.getOp(y, this.state.op.state.x)!.timestamp === this.state.op.state.x
                    && this.state.visualizer.getOp(y, this.state.op.state.x)!.operation.name != opName)
            ) {
                let err = this.state.visualizer.is_valid_operation(opName);
                if (err == null) {
                    this.state.op.setState({fill: '#3CB371'});
                    this.setState({errorMessage: ''});
                } else {
                    setTimeout(() => {
                        this.setState({ErrorVisible: false});
                    }, 3000);
                    this.state.op!.setState({operation: this.state.visualizer.default_Operation()});
                    this.setState({ErrorVisible: true});
                    this.setState({errorMessage: opName});
                }
                this.state.visualizer.remove_operation(y, this.state.op.state.x);
                this.state.visualizer.add_operationStr(y, this.state.op.state.x, opName);
            }
        }
    };

}

export default Tool;

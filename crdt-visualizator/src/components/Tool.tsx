import * as React from 'react';
import {Stage} from 'react-konva';
import Graph from './Graph';
import UpdateLayer from "./UpdateLayer";
import Operation from "./Operation";

interface States {

    textEditVisible: boolean,
    textX: number,
    textY: number,
    textValue: string
    op?: Operation
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
            textValue: ''
        };


    }

    render() {

        return (
            <div>
                <Stage x={0} y={0} height={400} width={800}>
                    <UpdateLayer onOperationClick={this.handleTextDblClick}/>
                    <Graph onOperationClick={this.handleTextDblClick}/>

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
        console.log('click');
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
        }
    };
}

export default Tool;

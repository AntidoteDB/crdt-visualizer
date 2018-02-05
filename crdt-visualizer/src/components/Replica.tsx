import * as React from 'react';
import {Arrow, Group, Rect, Text} from 'react-konva';
import Operation from "./Operation";
import TooltipForState from "./ToolTipForState";
import visualizer from "../classes/visualizer";
import {operation} from "../classes/operation";
import Remove from './Remove';


interface States {
    posX: number;
    posY: number;
    radius: number;
    fill: string;
    show: boolean;
    operations: Operation[];
    isMouseOver: boolean;
    MouseX: number;
    MouseY: number;
    RemVisible:boolean
}

interface Props {
    points: number[];
    name: string;
    onOperationClick: (e: any, operation_name: string, operation: Operation) => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
    visualizer: visualizer;
}

class Replica extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            posX: 0,
            posY: 0,
            radius: 20,
            fill: 'yellow',
            show: false,
            operations: [],
            isMouseOver: false,
            MouseX: 0,
            MouseY: 0,
            RemVisible:false
        }
    }
    render() {

        return <Group>
           <Arrow
                fill={'black'} stroke={'black'} strokeWidth={4}
                pointerLength={10} pointerWidth={10}
                points={this.props.points} onClick={(e)=>this.addOp(e)}
                onMouseOver={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onMouseDown={this.props.onMouseDown}
                onMouseUp={this.props.onMouseUp}
            />
            <Rect x={this.props.points[0] - 30} y={this.props.points[1] - 15}
                  height={30} width={30} fill={'Tomato'} stroke={'black'}
            />

            <Text text={this.props.name} fill={'black'}
                  x={this.props.points[0] - 30} y={this.props.points[1] - 15}
                  fontSize={15} fontFamily={'Calibri'}
                  padding={5} align={'center'} height={30} width={30}
            />
            <Remove x={this.props.points[2]} y={this.props.points[3]-25} visible={this.state.RemVisible} />


            {   this.state.operations.length>0?
                this.state.operations.map((operation:Operation) =>
                <Operation
                    replica={this} x={operation.state.x} y={operation.state.y}
                    radius={operation.state.radius}
                    fill={operation.state.fill}
                    key={operation.props.x} onOperationClick={this.props.onOperationClick}
                    visualizer={this.props.visualizer}
                />):null}
            <TooltipForState
                x={this.state.MouseX}
                y={this.state.MouseY}
                text={'Timestamp:  ' + (this.state.MouseX - this.props.points[0]).toString()}
                state={'State:  ' + this.props.visualizer!.value(this.getReplicaId(), this.state.MouseX)}
                visible={this.state.isMouseOver ? true : false}
            />

        </Group>


    }

    addOp = (e: any) => {

        var op = {
            replica: this,
            x: e.evt.clientX,
            y: e.evt.clientY,
            radius: 20,
            fill: '#3CB371',
            onOperationClick: this.props.onOperationClick,
            visualizer: this.props.visualizer
        }
        var op1 = new Operation(op);
        var act = this.state.operations;

        act.push(op1);
        this.setState({operations: act});
        var y = 0;
        switch (this.props.name) {
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
        let newOp = new operation(op1.state.operation, op1.props.x);
        this.props.visualizer.add_operation(y, newOp)

    }



    removeOp(item:number){
        var newState = this.state.operations;
        newState = newState.filter( (el)=> {
            return el.props.x !== item;
        });

            this.setState({operations: newState})
    }

    onMouseEnter = (e: any) => {
        this.setState({isMouseOver: true, MouseX: e.evt.clientX, MouseY: e.evt.clientY});
    }
    onMouseLeave = () => {
        this.setState({isMouseOver: false})
    }

    getReplicaId() {
        var x = this.props.name
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
        ;
        return y;
    }
}

export default Replica;

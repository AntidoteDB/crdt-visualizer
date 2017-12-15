import * as React from 'react';
import {Arrow, Group, Rect, Text} from 'react-konva';
import Operation from "./Operation";
import TooltipForState from "./ToolTipForState";
import visualizer from "../classes/visualizer";


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
}

interface Props {
    points: number[];
    name: string;
    onOperationClick: (e: any, operation_name: string, operation: Operation) => void;
    visualizer?: visualizer;
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
            MouseY: 0
        }
    }

    render() {
        if (this.state.operations.length > 0) {
            return <Group>
                <Arrow
                    fill={'black'} stroke={'black'} strokeWidth={4}
                    pointerLength={10} pointerWidth={10}
                    points={this.props.points} onClick={this.addOp}
                    onMouseOver={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                />
                <Rect x={this.props.points[0] - 30} y={this.props.points[1] - 15}
                      height={30} width={30} fill={'Tomato'} stroke={'black'}
                />
                <Text text={this.props.name} fill={'black'}
                      x={this.props.points[0] - 30} y={this.props.points[1] - 15}
                      fontSize={15} fontFamily={'Calibri'}
                      padding={5} align={'center'} height={30} width={30}
                />


                {this.state.operations.map((operation, index) =>
                    <Operation
                        replica={this} x={operation.state.posX} y={operation.state.posY}
                        radius={operation.state.radius}
                        fill={operation.state.fill}
                        key={index} onOperationClick={this.props.onOperationClick}
                        visualizer={this.props.visualizer}
                    />)}
                <TooltipForState
                    x={this.state.MouseX}
                    y={this.state.MouseY}
                    text={'Timestamp:' + (this.state.MouseX - this.props.points[0]).toString()}
                    state={'State:' + this.props.visualizer!.execute_update_query(this.getReplicaId(), this.state.MouseX)}
                    visible={this.state.isMouseOver ? true : false}
                />

            </Group>
        }
        else {
            return <Group>
                <Arrow
                    fill={'black'} stroke={'black'} strokeWidth={4}
                    pointerLength={10} pointerWidth={10}
                    points={this.props.points} onClick={this.addOp}
                    onMouseOver={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                />
                <Rect x={this.props.points[0] - 30} y={this.props.points[1] - 15}
                      height={30} width={30} fill={'Tomato'} stroke={'black'}
                />
                <Text text={this.props.name} fill={'black'}
                      x={this.props.points[0] - 30} y={this.props.points[1] - 15}
                      fontSize={15} fontFamily={'Calibri'}
                      padding={5} align={'center'} height={30} width={30}
                /></Group>

        }

    }

    addOp = (e: any) => {
        let op = {
            replica: this,
            x: e.evt.clientX,
            y: e.evt.clientY,
            radius: 20,
            fill: '#207192',
            onOperationClick: this.props.onOperationClick
        }
        let op1 = new Operation(op);
        let act = this.state.operations;
        let newState = act.concat(op1);
        this.setState({operations: newState});


    }

    removeOp(o: Operation) {
        let Ops_state = this.state.operations;
        let i = 0;
        for (i; i < Ops_state.length; i++) {
            if (Ops_state[i].props.x == o.props.x && Ops_state[i].props.y == o.props.y)
                Ops_state.splice(i, 1);
        }
        this.setState({operations: Ops_state});
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

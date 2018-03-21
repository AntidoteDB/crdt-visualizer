import * as React from 'react';
import {Circle, Group, Text} from 'react-konva';
import Tooltip from "./Tooltip";
import Replica from "./Replica";
import visualizer from "../classes/visualizer";


interface States {
    isMouseOver: boolean;
    operation: string;
    radius: number;
    fill: string;
    replica: Replica;
    x: number;
    y: number;
    isDragging: boolean;
    currentX: number;
    currentY: number;
}

interface Props {
    x: number;
    y: number;
    radius: number;
    fill: string;
    replica: Replica;
    onOperationClick: (e: any, operation_name: string, operation: Operation) => void;
    visualizer: visualizer;
}

class Operation extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isMouseOver: false, operation: this.props.visualizer!.default_Operation(),
            replica: this.props.replica,
            radius: this.props.radius, fill: this.props.fill,
            x: this.props.x,
            y: this.props.y,
            isDragging: false,
            currentX: 0,
            currentY: 0
        }
    }
    render() {
        return (
            <Group draggable={true} onClick={(e) => this.onClickHandel(e, this.state.operation, this)}
                   dragBoundFunc={() => this.dragBound({x: 0, y: 0})}
                   onDragMove={(e) => this.dragMove(e)}
                   onDragStart={(e) => this.onDragStart()}
                   onDragEnd={() => this.onDragEnd()}
            >
                <Group onMouseEnter={this.onMouseEnter}
                       onMouseLeave={this.onMouseLeave}>
                    <Circle x={this.state.x} y={this.props.y}
                            radius={this.props.radius}
                            fill={this.state.fill}
                            strokeWidth={this.state.isMouseOver ? 5 : 1}
                            stroke={'black'}
                            shadowBlur={5}
                    />
                    <Text text={this.state.operation} fill={'black'}
                          x={this.state.x - this.props.radius + 4} y={this.props.y}
                          fontSize={8} fontFamily={'Calibri'}
                          padding={-3} align={'center'} height={30} width={30}/>

                </Group>
                <Tooltip x={this.state.x - this.props.radius - 40}
                         y={this.props.y - this.props.radius - 40} text={this.state.operation}
                         visible={this.state.isMouseOver ? true : false}/>
            </Group>);
    }

    onMouseEnter = () => {
        this.setState({isMouseOver: true})
    }
    onMouseLeave = () => {
        this.setState({isMouseOver: false})
    }
    onClickHandel = (e: any, op: string, operation: Operation) => {
        this.props.onOperationClick(e, op, operation);
    }
    dragBound = (pos: any) => {
        let x = pos.x;
        let y = 0;
        return {x, y};

    }
    onDragStart = () => {
        this.setState({isDragging: true, currentX: this.state.x, currentY: this.state.y});
        this.state.replica.setState({RemVisible:true});
        this.state.replica.props.graph.setState({Operation_dragging:true})
    }
    dragMove = (e: any) => {
        if (this.state.isDragging) {
            if (this.state.x < 100) {
                this.setState({x: this.state.currentX, y: this.state.currentY, isDragging: false});
            }
            else if (this.state.x >= 700) {
                this.setState({x: this.state.currentX, y: this.state.currentY, isDragging: false});
                this.state.replica.removeOp(this.props.x);
                this.state.replica.props.visualizer.remove_operation(this.props.replica.getReplicaId(),this.state.x);
            }
            else {
                this.setState({x: e.target.getStage().getPointerPosition().x});
            }
        }
    }
    onDragEnd = () => {
        this.setState({isDragging:false});
        this.props.visualizer!.move_operation(this.state.replica.getReplicaId(), this.state.currentX, this.state.x);
        this.state.replica.setState({RemVisible:false});
        this.state.replica.props.graph.setState({Operation_dragging:false})
    }
}

export default Operation;
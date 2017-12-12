import * as React from 'react';
import {Circle, Group, Text} from 'react-konva';
import Tooltip from "./Tooltip";
import Remove from "./Remove";
import Replica from "./Replica";


interface States {
    isMouseOver: boolean;
    operation: string;
    posX: number;
    posY: number;
    radius: number;
    fill: string;
    replica: Replica;
    x: number;
    isDragging: boolean;
    currentX: number;
}

interface Props {
    x: number;
    y: number;
    radius: number;
    fill: string;
    replica: Replica;
    onOperationClick: (e: any, operation_name: string, operation: Operation) => void;
}

class Operation extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isMouseOver: false, operation: 'Operation',
            posX: this.props.x, posY: this.props.y, replica: this.props.replica,
            radius: this.props.radius, fill: this.props.fill,
            x: this.props.x,
            isDragging: false,
            currentX: 0
        }
    }

    render() {
        return (
            <Group draggable={true} onClick={(e) => this.onClickHandel(e, this.state.operation, this)}
                   dragBoundFunc={() => this.dragBound({x: 0, y: 0})}
                   onDragMove={(e) => this.dragMove(e)}
                   onDragStart={(e) => this.onDragStart(e)}
            >
                <Group onMouseEnter={this.onMouseEnter}
                       onMouseLeave={this.onMouseLeave}>
                    <Circle x={this.state.x} y={this.props.y}
                            radius={this.props.radius}
                            fill={this.props.fill}
                            strokeWidth={this.state.isMouseOver ? 5 : 1}
                            stroke={'black'}
                            shadowBlur={5}
                    />
                    <Text text={this.state.operation} fill={'black'}
                          x={this.state.x - this.props.radius + 4} y={this.props.y}
                          fontSize={8} fontFamily={'Calibri'}
                          padding={-3} align={'center'} height={30} width={30}/>

                </Group>
                <Remove operation={this}
                        x={this.state.x + this.props.radius}
                        y={this.props.y - this.props.radius}
                        radius={this.props.radius / 2.5}/>
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

    remove() {
        this.state.replica.removeOp(this)
    }

    onClickHandel = (e: any, op: string, operation: Operation) => {
        this.props.onOperationClick(e, op, operation);

    }
    dragBound = (pos: any) => {
        let x = pos.x;
        let y = 0;
        return {x, y};

    }
    onDragStart = (e: any) => {
        this.setState({isDragging: true, currentX: e.evt.clientX})
    }
    dragMove = (e: any) => {
        if (this.state.isDragging) {
            if (this.state.x > 700 || this.state.x < 100) {
                this.setState({x: this.state.currentX, isDragging: false});
            }
            else {
                this.setState({x: e.evt.clientX});
            }
        }
        console.log(this.state.x)
    }
}

export default Operation;
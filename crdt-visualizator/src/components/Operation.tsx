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
}

interface Props {
    x: number;
    y: number;
    radius: number;
    fill: string;
    replica: Replica;
}

class Operation extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isMouseOver: false, operation: 'Operation ',
            posX: this.props.x, posY: this.props.y, replica: this.props.replica,
            radius: this.props.radius, fill: this.props.fill
        }
    }

    render() {
        return (
            <Group draggable={true}>
                <Group onMouseEnter={this.onMouseEnter}
                       onMouseLeave={this.onMouseLeave}>
                    <Circle x={this.props.x} y={this.props.y}
                            radius={this.props.radius}
                            fill={this.props.fill}
                            strokeWidth={this.state.isMouseOver ? 5 : 1}
                            stroke={'black'}
                            shadowBlur={5}/>
                    <Text text={this.state.operation} fill={'black'}
                          x={this.props.x - this.props.radius + 4} y={this.props.y}
                          fontSize={8} fontFamily={'Calibri'}
                          padding={-3} align={'center'} height={30} width={30}/>

                </Group>
                <Remove operation={this}
                        x={this.props.x + this.props.radius}
                        y={this.props.y - this.props.radius}
                        radius={this.props.radius / 2.5}/>
                <Tooltip x={this.props.x - this.props.radius - 40}
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
}

export default Operation;
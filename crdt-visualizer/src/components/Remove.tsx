import * as React from 'react';
import {Circle, Group, Text} from 'react-konva';
import Operation from './Operation';

interface States {
    mouseOver: boolean;
}

interface Props {
    x: number;
    y: number;
    radius: number
    operation: Operation;
}

class Remove extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {mouseOver: false};
    }

    render() {
        return (
            <Group>
                <Circle
                    x={this.props.x} y={this.props.y}
                    radius={this.props.radius}
                    fill={'red'}
                    shadowColor={'red'} shadowBlur={10} shadowOpacity={0.2}
                    opacity={this.state.mouseOver ? 1 : 0.4}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    onClick={this.removeMe}
                />
                <Text
                    text={'X'} fill={'white'}
                    x={this.props.x} y={this.props.y}
                    fontSize={8} fontFamily={'Calibri'}
                    padding={-3} align={'center'}
                />
            </Group>);
    }

    onMouseEnter = () => {
        this.setState({mouseOver: true})
    }
    onMouseLeave = () => {
        this.setState({mouseOver: false})
    }
    removeMe = () => {
        this.props.operation.remove()
    }
}

export default Remove;
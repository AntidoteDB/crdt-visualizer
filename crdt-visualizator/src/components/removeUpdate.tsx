import * as React from 'react';
import {Circle, Group, Text} from 'react-konva';
import Update from "./Update";


interface States {
    mouseOver: boolean;
}

interface Props {
    x: number;
    y: number;
    radius: number;
    update: Update;

}

class RemoveUpdate extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {mouseOver: false};
    }

    render() {
        return (
            <Group onClick={this.removeMe}>
                <Circle
                    x={this.props.x} y={this.props.y}
                    radius={this.props.radius}
                    fill={'red'}
                    shadowColor={'red'} shadowBlur={10} shadowOpacity={0.2}
                    opacity={this.state.mouseOver ? 1 : 0.1}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
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
        this.props.update.remove();
    }
}

export default RemoveUpdate;
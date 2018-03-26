import * as React from 'react';
import {Text, Rect, Group} from 'react-konva';

interface Props {
    x: number;
    y: number;
    text: string
}

class Tooltip extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Group>
                <Rect x={this.props.x} y={this.props.y} stroke={'transparent'} height={30}
                      fill={'transparent'} width={150} shadowColor={'black'} shadowBlur={10} shadowOpacity={0.2}
                      cornerRadius={20}/>
                <Text text={this.props.text} fill={'#555'}
                      x={this.props.x+10} y={this.props.y}
                      fontSize={10} fontFamily={'Calibri'}
                      padding={20} align={'left'} height={30} width={150}/>
            </Group>);
    }
}

export default Tooltip;
import * as React from 'react';
import {Text, Rect, Group} from 'react-konva';

interface Props {
    x: number;
    y: number;
    text: string
    visible: boolean;
}

class Tooltip extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Group visible={this.props.visible}>
                <Rect x={this.props.x} y={this.props.y} stroke={'#555'} height={30}
                      fill={'#ddd'} width={150} shadowColor={'black'} shadowBlur={10} shadowOpacity={0.2}
                      cornerRadius={20}/>
                <Text text={this.props.text} fill={'#555'}
                      x={this.props.x} y={this.props.y}
                      fontSize={18} fontFamily={'Calibri'}
                      padding={5} align={'center'} height={30} width={150}/>
            </Group>);
    }
}

export default Tooltip;
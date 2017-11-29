import * as React from 'react';
import {Text, Rect, Group} from 'react-konva';

interface Props {
    x: number;
    y: number;
    text: string;
    state: string;
    visible: boolean;
}

class TooltipForState extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Group visible={this.props.visible}>
                <Rect x={this.props.x - 60} y={this.props.y + 20} stroke={'#555'} height={60}
                      fill={'#ddd'} width={150} shadowColor={'black'} shadowBlur={10} shadowOpacity={0.2}
                      cornerRadius={5}/>
                <Text text={this.props.text} fill={'purple'}
                      x={this.props.x - 60} y={this.props.y + 20}
                      fontSize={18} fontFamily={'Calibri'}
                      padding={5} align={'center'} height={60} width={150}/>
                <Text text={this.props.state} fill={'purple'}
                      x={this.props.x - 60} y={this.props.y + 40}
                      fontSize={18} fontFamily={'Calibri'}
                      padding={5} align={'center'} height={60} width={150}/>
            </Group>);
    }
}

export default TooltipForState;
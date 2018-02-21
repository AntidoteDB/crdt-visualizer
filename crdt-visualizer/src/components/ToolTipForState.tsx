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
                <Rect x={this.props.x - 60} y={this.props.y + 20} stroke={'#555'}
                      fill={'#ddd'}  height={60} width={150}/>
                <Text text={this.props.text} fill={'purple'}
                      x={this.props.x - 60} y={this.props.y + 20}
                      fontSize={12} fontFamily={'Calibri'}
                      padding={5} align={'center'} width={150}  height={60}/>
                <Text text={this.props.state} fill={'purple'}
                      x={this.props.x - 60} y={this.props.y + 40}
                      fontSize={12} fontFamily={'Calibri'}
                      padding={5} align={'center'}  width={150}  height={60}/>
            </Group>);
    }
}

export default TooltipForState;
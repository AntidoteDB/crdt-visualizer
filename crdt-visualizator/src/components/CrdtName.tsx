import * as React from 'react';
import {Text, Rect, Group} from 'react-konva';

interface States {

}

interface Props {
    x: number;
    y: number;
    name: string;
}

class CrdtName extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Group>
                <Rect x={this.props.x} y={this.props.y} stroke={'DodgerBlue'} height={30}
                      fill={'DodgerBlue'} width={150} shadowColor={'black'} shadowBlur={20}
                      shadowOpacity={0.2}/>
                <Text text={this.props.name} fill={'white'}
                      x={this.props.x} y={this.props.y}
                      fontSize={18} fontFamily={'Calibri'}
                      padding={5} align={'center'} height={30} width={150}/>


            </Group>);
    }


}

export default CrdtName;
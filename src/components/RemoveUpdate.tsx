import * as React from 'react';
import {Rect, Text, Group} from 'react-konva';


interface States {
}

interface Props {
    x: number;
    y: number;
    visible: boolean;
}

class RemoveUpdate extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);

    }

    render() {
        return (
            <Group visible={this.props.visible}>
                <Rect
                    x={this.props.x} y={this.props.y}
                    stroke={'#555'}
                    strokeWidth={2}
                    fill={'#ddd06d'}
                    width={150}
                    height={220}
                    shadowColor={'black'}
                    shadowBlur={10}
                    shadowOpacity={0.2}
                    cornerRadius={10}

                />
                <Text text={'Move here to remove the object'} fill={'#555'}
                      x={this.props.x} y={this.props.y} fontSize={13} width={150} padding={20} align={'center'}
                      fontFamily={'Calibri'}/>
            </Group>);
    }


}


export default RemoveUpdate;
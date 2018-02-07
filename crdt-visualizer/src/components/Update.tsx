import * as React from 'react';
import {Arrow, Group} from 'react-konva';


interface State {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}

interface Props {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}

class Update extends React.Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            fromX: this.props.fromX,
            fromY: this.props.fromY,
            toX: this.props.toX,
            toY: this.props.toY,
        }
    }

    render() {
        return (
            <Group>
                <Arrow points={[this.props.fromX, this.props.fromY, this.props.toX, this.props.toY]}
                       stroke={'blue'} strokeWidth={2} lineJoin={'round'} dash={[10, 10]}
                       draggable={true}
               />

            </Group>

        )
    }


}

export default Update;

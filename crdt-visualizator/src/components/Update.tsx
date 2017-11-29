import * as React from 'react';
import {Arrow, Group} from 'react-konva';
import RemoveUpdate from "./removeUpdate";
import UpdateLayer from "./UpdateLayer";


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
    updateLayer: UpdateLayer;
}

class Update extends React.Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            fromX: this.props.fromX,
            fromY: this.props.fromY,
            toX: this.props.toX,
            toY: this.props.toY
        }
    }

    render() {
        return (
            <Group>
                <Arrow points={[this.props.fromX, this.props.fromY, this.props.toX, this.props.toY]}
                       stroke={'green'} strokeWidth={2} lineJoin={'round'} dash={[10, 10]}/>
                <RemoveUpdate x={(this.props.toX + this.props.fromX) / 2}
                              y={(this.props.toY + this.props.fromY) / 2} radius={10} update={this}/>
            </Group>
        )
    }

    remove = () => {
        this.props.updateLayer.remove(this)
    }
}

export default Update;

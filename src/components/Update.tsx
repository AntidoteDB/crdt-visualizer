import * as React from 'react';
import {Arrow, Group} from 'react-konva';
import Graph from './Graph';
import visualizer from '../classes/visualizer';


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
    graph: Graph;
    visualizer: visualizer;
    fromReplica: number | string;
    toReplica: number | string;
}

class Update extends React.Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            fromX: this.props.fromX,
            fromY: this.props.fromY,
            toX: this.props.toX,
            toY: this.props.toY,
        };
    }

    render() {
        return (
            <Group>
                <Arrow points={[this.props.fromX, this.props.fromY, this.props.toX, this.props.toY]}
                       stroke={'Grey'} strokeWidth={3} lineJoin={'round'}
                       draggable={true}
                       onDragStart={() => this.handleDragStart()}
                       onDragEnd={(e) => this.handleDragEnd(e)}
                />

            </Group>

        );
    }

    handleDragStart = () => {
        this.props.graph.setState({isDragging: true});
    };
    handleDragEnd = (e: any) => {
        this.props.graph.setState({isDragging: false});
        if (e.target.getStage().getPointerPosition().x > 700) {
            var Position = this.props.graph.state.updates.indexOf(this);
            this.props.graph.state.updates.splice(Position, 1);
            this.props.graph.setState({});
            if (typeof  this.props.fromReplica === 'number' && typeof  this.props.toReplica === 'number')
                this.props.visualizer.remove_merge(this.props.fromReplica, this.props.fromX, this.props.toReplica, this.props.toX);
        }
        else {
            console.log(this.props.graph.state.updates.indexOf(this));
        }
        ;
    };

}

export default Update;

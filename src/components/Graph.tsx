import * as React from 'react';
import {Group, Layer, Stage, Rect} from 'react-konva';
import Replica from './Replica';
import Operation from './Operation';
import visualizer from '../classes/visualizer';
import Update from './Update';
import RemoveUpdate from './RemoveUpdate';
import TooltipForState from './ToolTipForState';


interface States {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    fromReplica: number | string;
    toReplica: number | string;
    isDrawing: boolean;
    updates: Update[];
    isDragging: boolean;
    Operation_dragging: boolean;
}


interface Props {
    onOperationClick: (e: any, operation_name: string, operation: Operation) => void;
    visualizer: visualizer;
}

class Graph extends React.Component <Props, States> {
    r1_Points = [100, 100, 700, 100];
    r2_Points = [100, 200, 700, 200];
    r3_Points = [100, 300, 700, 300];
    replicas_y_positions = [100,200,300]
    replica_start_point_x = 100;
    replica_End_point_x = 700;

    constructor(props: Props) {
        super(props);
        this.state = {
            fromX: 0,
            fromY: 0,
            toX: 0,
            toY: 0,
            fromReplica: 'no replica',
            toReplica: 'no replica',
            isDrawing: false,
            updates: [],
            isDragging: false,
            Operation_dragging: false
        };

    }


    render() {

        return (
            <Stage x={0} y={0} height={window.innerHeight} width={window.innerWidth} onMouseDown={this.onMouseDown}
                   onMouseUp={this.onmouseup} >
                <Layer x={0} y={0} height={400} width={1000} onMouseMove={this.onmousemove}>
                    <Rect x={0} y={0} width={window.innerWidth} height={window.innerHeight}></Rect>
                    <RemoveUpdate x={710} y={90} visible={this.state.isDragging}/>
                    <Group>
                        {this.state.isDrawing ?
                            <Update
                                fromX={this.state.fromX}
                                fromY={this.state.fromY}
                                toX={this.state.toX}
                                toY={this.state.toY}
                                graph={this}
                                visualizer={this.props.visualizer}
                                fromReplica={this.state.fromReplica}
                                toReplica={this.state.toReplica}


                            /> : null
                        }

                    </Group>
                    {this.state.updates.map((update, index) =>
                        <Group key={update.props.fromX}>
                            {update.render()}
                        </Group>
                    )}


                </Layer>
                <Layer>
                    <Group>
                        <Replica points={this.r1_Points} name={'R1'}
                                 onOperationClick={this.props.onOperationClick}
                                 visualizer={this.props.visualizer}
                                 onMouseDown={() => {
                                     this.setState({fromReplica: 0});
                                 }}
                                 onMouseUp={() => {
                                     this.setState({toReplica: 0});
                                 }} graph={this}/>
                        <Replica points={this.r2_Points} name={'R2'}
                                 onOperationClick={this.props.onOperationClick}
                                 visualizer={this.props.visualizer}
                                 onMouseDown={() => {
                                     this.setState({fromReplica: 1});
                                 }}
                                 onMouseUp={() => {
                                     this.setState({toReplica: 1});
                                 }} graph={this}/>
                        <Replica points={this.r3_Points} name={'R3'}
                                 onOperationClick={this.props.onOperationClick}
                                 visualizer={this.props.visualizer}
                                 onMouseDown={() => {
                                     this.setState({fromReplica: 2});
                                 }}
                                 onMouseUp={() => {
                                     this.setState({toReplica: 2})
                                     ;

                                 }} graph={this}/>
                    </Group>

                    <TooltipForState x={800} y={50}
                                     state={this.props.visualizer.new_value(0, 700)}
                                     text={'State:'}
                                     visible={(this.state.isDragging || this.state.Operation_dragging) ? false : true}/>
                    <TooltipForState x={800} y={150}
                                     state={this.props.visualizer.new_value(1, 700)}
                                     text={'State:'}
                                     visible={(this.state.isDragging || this.state.Operation_dragging) ? false : true}/>
                    <TooltipForState x={800} y={250}
                                     state={this.props.visualizer.new_value(2, 700)}
                                     text={'State:'}
                                     visible={(this.state.isDragging || this.state.Operation_dragging) ? false : true}/>
                </Layer>
            </Stage>
        );

    }

    onMouseDown = (e: any) => {
        this.setfromReplica(e);
        if (this.state.fromReplica === 'no replica') {
             this.setState({isDrawing: false});
            return;
        }
        this.setState({
            isDrawing: true, fromX:e.target.getStage().getPointerPosition().x,
          toX: e.target.getStage().getPointerPosition().x,
            toY: e.target.getStage().getPointerPosition().y
        });

    };
    onmouseup = (e: any) => {
        this.setToReplica(e);
        if (this.state.toReplica === 'no replica') {
            this.setState({isDrawing: false});
            return;
        }
        let a = {
            fromX: this.state.fromX, fromY: this.state.fromY,
            toX: this.state.toX, toY: this.state.toY,
            graph: this,
            visualizer: this.props.visualizer,
            fromReplica: this.state.fromReplica,
            toReplica: this.state.toReplica
        };
        let x = this.state.updates;
        if (this.state.fromReplica != this.state.toReplica &&
            this.state.toX > this.state.fromX &&
            typeof this.state.fromReplica == 'number' &&
            typeof this.state.toReplica == 'number') {
            this.setState({isDrawing: false, updates: x.concat(new Update(a))});
            this.props.visualizer.add_merge(this.state.fromReplica, this.state.fromX, this.state.toReplica, this.state.toX);
        }
        else {
            this.setState({isDrawing: false});
        }
    };

    onmousemove = (e: any) => {
        if (this.state.isDrawing) {
            this.setState({toX: e.target.getStage().getPointerPosition().x, toY: e.target.getStage().getPointerPosition().y});
        }
    };

    setToReplica(e: any) {
        var variance=25;

        if (e.target.getStage().getPointerPosition().x < this.replica_start_point_x) {return;}
        for (var i=0;i<this.replicas_y_positions.length;i++) {
        if (Math.abs(e.target.getStage().getPointerPosition().y - this.replicas_y_positions[i]) < variance 
            && e.target.getStage().getPointerPosition().x < this.replica_End_point_x) {
            this.setState({toReplica:i, toY: this.replicas_y_positions[i]});
        }}
      }


    setfromReplica(e: any) {
        var variance=25;

        if (e.target.getStage().getPointerPosition().x < this.replica_start_point_x) {return;}

        for (var i=0;i<this.replicas_y_positions.length;i++) {
        if (Math.abs(e.target.getStage().getPointerPosition().y - (this.replicas_y_positions[i])) < variance 
            && e.target.getStage().getPointerPosition().x <  this.replica_End_point_x) {
            this.setState({fromReplica: i, toReplica:'no replica' ,fromY: (this.replicas_y_positions[i])});
        }
      
      }}

}

export default Graph;

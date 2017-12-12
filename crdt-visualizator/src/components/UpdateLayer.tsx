import * as React from 'react';
import {Layer, Group, Rect} from 'react-konva';
import Update from './Update';
import Replica from "./Replica";
import Operation from "./Operation";

interface State {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    isDrawing: boolean;
    updates: Update[];

    Replica_1_x: number;
    Replica_1_y: number;
    Replica_1_width: number;
    Replica_1_height: number;

    Replica_2o_x: number;
    Replica_2o_y: number;
    Replica_2o_width: number;
    Replica_2o_height: number;

    Replica_2u_x: number;
    Replica_2u_y: number;
    Replica_2u_width: number;
    Replica_2u_height: number;

    Replica_3_x: number;
    Replica_3_y: number;
    Replica_3_width: number;
    Replica_3_height: number;
}

interface Props {

    onOperationClick: (e: any, operation_name: string, operation: Operation) => void
}

class UpdateLayer extends React.Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            fromX: 0,
            fromY: 0,
            toX: 0,
            toY: 0, isDrawing: false,
            updates: [],
            Replica_1_x: 100,
            Replica_1_y: 100,
            Replica_1_width: 590,
            Replica_1_height: 10,

            Replica_2o_x: 100,
            Replica_2o_y: 190,
            Replica_2o_width: 590,
            Replica_2o_height: 10,

            Replica_2u_x: 100,
            Replica_2u_y: 200,
            Replica_2u_width: 590,
            Replica_2u_height: 10,

            Replica_3_x: 100,
            Replica_3_y: 290,
            Replica_3_width: 590,
            Replica_3_height: 10
        }

    }

    render() {
        return (

            <Layer x={0} y={0} height={400} width={800} onMouseDown={this.onMouseDown}
                   onMouseUp={this.onmouseup} onMouseMove={this.onmousemove}>
                <Group>
                    <Rect width={800} height={400} x={0} y={0} fill={'white'}/>
                    <Rect width={this.state.Replica_1_width} height={this.state.Replica_1_height}
                          x={this.state.Replica_1_x} y={this.state.Replica_1_y}
                          fill={'LightGray'} cornerRadius={20} opacity={0.5}/>
                    <Rect width={this.state.Replica_2o_width} height={this.state.Replica_2o_height}
                          x={this.state.Replica_2o_x} y={this.state.Replica_2o_y}
                          fill={'LightGray'} cornerRadius={20} opacity={0.5}/>
                    <Rect width={this.state.Replica_2u_width} height={this.state.Replica_2u_height}
                          x={this.state.Replica_2u_x} y={this.state.Replica_2u_y}
                          fill={'LightGray'} cornerRadius={20} opacity={0.5}/>
                    <Rect width={this.state.Replica_3_width} height={this.state.Replica_3_height}
                          x={this.state.Replica_3_x} y={this.state.Replica_3_y}
                          fill={'LightGray'} cornerRadius={20} opacity={0.5}/>

                    {this.state.isDrawing ?
                        <Update updateLayer={this}
                                fromX={this.state.fromX}
                                fromY={this.state.fromY}
                                toX={this.state.toX}
                                toY={this.state.toY}

                        /> : null
                    }

                </Group>
                {this.state.updates.map((update, index) =>
                    <Group key={index}>
                        {update.render()}
                    </Group>
                )}

            </Layer>)
    }

    onMouseDown = (e: any) => {
        if (this.get_Replica(e.evt.clientX, e.evt.clientY) === null) {
            return;
        }
        else this.setState({
            isDrawing: true, fromX: e.evt.clientX,
            fromY: e.evt.clientY, toX: e.evt.clientX, toY: e.evt.clientY
        });


    }
    onmouseup = (e: any) => {
        if (this.get_Replica(e.evt.clientX, e.evt.clientY) === null) {
            this.setState({isDrawing: false});
            return
        }
        let a = {
            fromX: this.state.fromX, fromY: this.state.fromY,
            toX: this.state.toX, toY: this.state.toY, updateLayer: this
        };
        let x = this.state.updates;
        if (this.get_Replica(this.state.fromX, this.state.fromY) != null
            && this.get_Replica(this.state.toX, this.state.toY) != null
            && (this.get_Replica(this.state.toX, this.state.toY)!.props.name !=
                this.get_Replica(this.state.fromX, this.state.fromY)!.props.name)) {
            this.setState({isDrawing: false, updates: x.concat(new Update(a))});
        }
        else {
            this.setState({isDrawing: false});
        }
    }

    onmousemove = (e: any) => {
        if (this.state.isDrawing) {
            this.setState({toX: e.evt.clientX, toY: e.evt.clientY});
        }
    }

    get_Replica(pointX: number, pointY: number) {
        if (pointX >= this.state.Replica_1_x && pointY >= this.state.Replica_1_y
            && pointX <= (this.state.Replica_1_x + this.state.Replica_1_width)
            && pointY <= (this.state.Replica_1_y + this.state.Replica_1_height)) {
            return new Replica({
                points: [100, 100, 700, 100],
                name: 'R1',
                onOperationClick: this.props.onOperationClick
            })
        }
        else if (pointX >= this.state.Replica_2o_x && pointY >= this.state.Replica_2o_y
            && pointX <= (this.state.Replica_2o_x + this.state.Replica_2o_width)
            && pointY <= (this.state.Replica_2o_y + this.state.Replica_2o_height)) {
            return new Replica({
                points: [100, 200, 700, 200],
                name: 'R2',
                onOperationClick: this.props.onOperationClick
            })
        }
        else if (pointX >= this.state.Replica_2u_x && pointY >= this.state.Replica_2u_y
            && pointX <= (this.state.Replica_2u_x + this.state.Replica_2u_width)
            && pointY <= (this.state.Replica_2u_y + this.state.Replica_2u_height)) {
            return new Replica({
                points: [100, 200, 700, 200],
                name: 'R2',
                onOperationClick: this.props.onOperationClick
            })
        }
        else if (pointX >= this.state.Replica_3_x && pointY >= this.state.Replica_3_y
            && pointX <= (this.state.Replica_3_x + this.state.Replica_3_width)
            && pointY <= (this.state.Replica_3_y + this.state.Replica_3_height)) {
            return new Replica({
                points: [100, 300, 700, 300],
                name: 'R3',
                onOperationClick: this.props.onOperationClick
            })
        }

        else return null


    }

    remove(update: Update) {
        let Upd_state = this.state.updates.slice();
        let i = 0;
        for (i; i < Upd_state.length; i++) {
            if (Upd_state[i].props.fromX == update.props.fromX
                && Upd_state[i].props.fromY == update.props.fromY
                && Upd_state[i].props.toX == update.props.toX
                && Upd_state[i].props.toY == update.props.toY)
                Upd_state.splice(i, 1);
        }
        this.setState({updates: Upd_state});
    }
}

export default UpdateLayer;

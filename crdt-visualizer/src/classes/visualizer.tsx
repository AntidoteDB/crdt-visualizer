import {replica} from './replica';
import {operation} from './operation';
import {update} from './update';
import {counter} from './counter';
import {CRDT_type} from './CRDT_type';
export default class visualizer {

//---------- Properties---------------------
    public variable_list: CRDT_type [] = [];
    public replica_list: replica [] = [];
    public update_list: update [] = [];
    public execution_matrix: number [][];

//----------Metods--------------------------
    constructor() {
        //???????? should we read the replica_num and var_num here from the json file or pass them as input for the constrictor???????????????ß
        var replica_num: number = 3;
        var CRDT_TYPE_ENUMERATION : number = 1; // counter
        //initializing replicas and variables

       //initializing replicas and variables
        switch (CRDT_TYPE_ENUMERATION) {
    	            case 1: //counter
                    for (var i = 0; i < replica_num; i++) {
                    this.add_replica(i);
                    this.variable_list.push(new counter(i));
                }
               case 2://set
    	
        	
        }

        //initializing execution matrix
        this.execution_matrix = [];
        for (var i = 0; i < replica_num; i++) {
            this.execution_matrix[i] = [];
            for (var j = 0; j < replica_num; j++) {
                this.execution_matrix[i][j] = 0;
            }
        }

    }

//------------------------------------------
    add_replica(id: number) {
        this.replica_list.push(new replica(id));
    }


//-------------------------------------------
    add_operation(replica_id: number, op: operation) {
        if (op.is_valid_operation(op.operation)) {
            this.variable_list[replica_id].operation_list.push(op);
        }
    }

//-------------------------------------------
    move_operation(replica_id: number, op_Current_time: number, op_New_time: number) {
        if (this.variable_list[replica_id].getOp(op_Current_time) != null) {
            let opName = this.variable_list[replica_id].getOp(op_Current_time)!.operation;
            this.remove_operation(replica_id, op_Current_time);
            this.add_operation(replica_id, new operation(opName, op_New_time));
        }

    }


//-------------------------------------------
    remove_operation(replica_id: number, op_time: number) {
        this.variable_list[replica_id].remove_op(op_time);
    }

//-------------------------------------------
    add_update(from_replica: number, from_time: number, to_replica: number, to_time: number) {
        // add the new update to the list
        var u: update;
        u = new update(this.update_list.length + 1, from_replica, from_time, to_replica, to_time);
        this.update_list.push(u);
    }

//----------------------------------------------------
    remove_update_by_id(u_id: number) {
        var index: number = 0;
        for (var i = 0; i < this.update_list.length; i++) {
            if (u_id == this.update_list[i].update_id) {
                index = i;
            }
        }
        this.update_list.splice(index, 1);
    }

//---------------------------------------------------
    remove_update(from_replica: number, from_time: number, to_replica: number, to_time: number) {
        var index: number = -1;
        for (var i = 0; i < this.update_list.length; i++) {
            if ((this.update_list[i].from_replica == from_replica) && (this.update_list[i].to_replica == to_replica) && (this.update_list[i].to_time_stamp == to_time) && (this.update_list[i].from_time_stamp == from_time)) {
                index = i;
            }
        }
        this.update_list.splice(index, 1);
    }

//---------------------------------------------------
    execute_updates() {
        // initializing variables inner values
        for (var i = 0; i < this.variable_list.length; i++) {
            this.variable_list[i].inner_value = 0;
        }

        //initializing execution matrix
        this.execution_matrix = [];
        for (var i = 0; i < this.replica_list.length; i++) {
            this.execution_matrix[i] = [];
            for (var j = 0; j < this.replica_list.length; j++) {
                this.execution_matrix[i][j] = 0;
            }
        }

        // execute  updates list
        this.execute_update_List();
    }


//-------------------------------------------
    execute_update_List() {
        var max_from: number = 0;
        var max_to: number = 0;
        for (var i = 0; i < this.replica_list.length; i++) {//from replica loop
            for (var j = 0; j < this.replica_list.length; j++) {//to replica loop
                if (i != j) {// we don't have updates on the same replica

                    //we search in the update list for the last time stamp an update has occured
                    for (var k = 0; k < this.update_list.length; k++) {// update list loop
                        if ((this.update_list[k].from_replica == this.replica_list[i].id) && (this.update_list[k].to_replica == this.replica_list[j].id)) {
                            if (this.update_list[k].from_time_stamp > max_from) {
                                max_from = this.update_list[k].from_time_stamp;
                            }
                            if (this.update_list[k].to_time_stamp > max_to) {
                                max_to = this.update_list[k].to_time_stamp;
                            }
                        }

                    }

                    // perform the last update -if exists- from replica i to replica j
                    if ((max_from != 0 ) || (max_to != 0)) {
                        //1. perform the operation list from i on i till max from
                        this.variable_list[i].at_source(this.execution_matrix[i][i], max_from);
                        this.execution_matrix[i][i] = max_from;

                        //2. perform the operation list from j on j till max to
                        this.variable_list[j].at_source(this.execution_matrix[j][j], max_to);
                        this.execution_matrix[j][j] = max_to;

                        //3. perform the operation list from i on j till max from
                        this.variable_list[i].downstream(this.variable_list[j], this.execution_matrix[i][j], max_from);
                        this.execution_matrix[i][j] = max_from;
                    }

                    max_from = 0;
                    max_to = 0;
                }
            }
        }

    }

//----------------------------------------------------------------------------------------




//---------------Query--------------------
//----------------------------------------
    value(replica_id: number, time_stamp: number): number {
        var temp_update_list: update [] = [];

        // initializing variables inner values
        for (var i = 0; i < this.variable_list.length; i++) {
            this.variable_list[i].inner_value = 0;
        }

        //initializing execution matrix
        this.execution_matrix = [];
        for (var i = 0; i < this.replica_list.length; i++) {
            this.execution_matrix[i] = [];
            for (var j = 0; j < this.replica_list.length; j++) {
                this.execution_matrix[i][j] = 0;
            }
        }


        for (var k = 0; k < this.update_list.length; k++) {// update list loop
            if ((this.update_list[k].to_time_stamp <= time_stamp) && (this.update_list[k].to_replica == replica_id)) {
                temp_update_list.push(this.update_list[k]);
            }//if
        }// k for

        // we sort the comming updates to the desired replica so we can execute them in the right order
        temp_update_list = this.sort_update_list(temp_update_list);

        if (temp_update_list.length == 0) {
            this.variable_list[replica_id].at_source(this.execution_matrix[replica_id][replica_id], time_stamp);	202.	            this.variable_list[replica_id].at_source(this.execution_matrix[replica_id][replica_id], time_stamp);
        } else {
            //performing all the updates on the replica
	        for (var j = 0; j < temp_update_list.length; j++) {	                       
                this.variable_list[temp_update_list[j].from_replica].downstream(this.variable_list[replica_id], this.execution_matrix[temp_update_list[j].from_replica][replica_id], temp_update_list[j].from_time_stamp);	207.	                this.variable_list[replica_id].at_source(this.execution_matrix[replica_id][replica_id], temp_update_list[j].to_time_stamp);
    	        this.execution_matrix[temp_update_list[j].from_replica][replica_id] = temp_update_list[j].from_time_stamp;	208.	                this.variable_list[temp_update_list[j].from_replica].downstream(this.variable_list[replica_id], this.execution_matrix[temp_update_list[j].from_replica][replica_id], temp_update_list[j].from_time_stamp);
    	        this.execution_matrix[temp_update_list[j].from_replica][replica_id] = temp_update_list[j].from_time_stamp;
    	        this.execution_matrix[replica_id][replica_id] = temp_update_list[j].to_time_stamp;
    	           
    	    }
    	            this.variable_list[replica_id].at_source(this.execution_matrix[replica_id][replica_id], time_stamp);
        }	                

        return this.variable_list[replica_id].inner_value;

    }

    sort_update_list(list: update[]): update[] {
        var temp: update;
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                if (list[i].to_time_stamp > list[j].to_time_stamp) {
                    temp = list[i];
                    list[i] = list[j];
                    list[j] = temp;
                }
            }
        }
        return (list);
    }


////// rasha can you put this method in the right position in the code please.
///// it's the default operation

    default_Operation(): string {
        return "increment";
    }


}

















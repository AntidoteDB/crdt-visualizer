import {replica} from './replica';
import {operation} from './operation';
import {merge} from './merge';
import {counter} from './counter';
import {Addwinn_Set} from './Addwinn_Set';
import {CRDT_type} from './CRDT_type';
import {CRDT_downstream} from './CRDT_type';
//import {CRDT_state} from './CRDT_type';
export default class visualizer {

//---------- Properties---------------------
    public variable_list: CRDT_type [] = [];
    public replica_list: replica [] = [];
    public merge_list: merge [] = [];
    public operation_list: operation [][] ;
    public execution_matrix: number [][];
    CRDT_TYPE_ENUMERATION : number;

//----------Metods--------------------------
    constructor(CRDT_TYPE_ENUMERATION: number) {
        //???????? should we read the replica_num and var_num here from the json file or pass them as input for the constrictor???????????????ß
        var replica_num: number = 3;
        //var CRDT_TYPE_ENUMERATION : number = 1; // counter
        //initializing replicas and variables
        this.CRDT_TYPE_ENUMERATION = CRDT_TYPE_ENUMERATION;
       //initializing replicas and variables
        switch (this.CRDT_TYPE_ENUMERATION) {
    	            case 1: //counter
                    for (var i = 0; i < replica_num; i++) {
                        this.add_replica(i);
                        this.variable_list.push(new counter());
                    }
                    case 2://set
                    for (var i = 0; i < replica_num; i++) {
                            this.add_replica(i);
                            this.variable_list.push(new Addwinn_Set());
                    }
    	
        	
        }

        //initializing operation list
        this.operation_list = [];
        for (var i = 0; i < replica_num; i++) {
            this.operation_list[i] = [];
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
       if (op.is_valid_operation(op.operation,this.CRDT_TYPE_ENUMERATION)){
            op.is_executed= false;
            this.operation_list[replica_id].push(op);
       }
        
    }

//-------------------------------------------
    move_operation(replica_id: number, op_Current_time: number, op_New_time: number) {
        let op = this.getOp(replica_id,op_Current_time)
        if (op != null) {
            //let opName = this.variable_list[replica_id].getOp(op_Current_time)!.operation;
            this.remove_operation(replica_id, op_Current_time);
            op.time_stamp = op_New_time;
            this.add_operation(replica_id, op);
        }

    }

    //-----------------------------------------
    getOp(replica_id:number,op_time: number) : operation|null {
        var index: number = -1;
        for (var i = 0; i < this.operation_list[replica_id].length; i++) {
            if (op_time == this.operation_list[replica_id][i].time_stamp) {
                index = i;
                return this.operation_list[replica_id][index];
            }
        }
        console.log('get op : '+ index);
        return null;
    }



//-------------------------------------------
    
    remove_operation(replica_id: number,op_time: number) {
        var index: number = -1;
        
        for (var i = 0; i < this.operation_list[replica_id].length; i++) {
            if (op_time == this.operation_list[replica_id][i].time_stamp) {
                index = i;
            }
        }
        if (index != -1) {
            this.operation_list[replica_id].splice(index, 1);
        }
    }

//-------------------------------------------
    add_merge(from_replica: number, from_time: number, to_replica: number, to_time: number) {
        // add the new merge to the list
        var u: merge;
        u = new merge(this.merge_list.length + 1, from_replica, from_time, to_replica, to_time);
        this.merge_list.push(u);
    }

//----------------------------------------------------
    remove_merge_by_id(u_id: number) {
        var index: number = 0;
        for (var i = 0; i < this.merge_list.length; i++) {
            if (u_id == this.merge_list[i].merge_id) {
                index = i;
            }
        }
        this.merge_list.splice(index, 1);
    }

//---------------------------------------------------
    remove_merge(from_replica: number, from_time: number, to_replica: number, to_time: number) {
        var index: number = -1;
        for (var i = 0; i < this.merge_list.length; i++) {
            if ((this.merge_list[i].from_replica == from_replica) && (this.merge_list[i].to_replica == to_replica) && (this.merge_list[i].to_time_stamp == to_time) && (this.merge_list[i].from_time_stamp == from_time)) {
                index = i;
            }
        }
        this.merge_list.splice(index, 1);
    }




    //  operation_sort sorts the operations before performing downstream function, so that the operation are executed with respect of their timestamp    
    operation_sort(replica_id: number) {
        var temp_op: operation;
        for (var i = 0; i < this.operation_list[replica_id].length; i++) {
            for (var j = i + 1; j < this.operation_list[replica_id].length; j++) {
                if (this.operation_list[replica_id][i].time_stamp > this.operation_list[replica_id][j].time_stamp) {
                    temp_op = this.operation_list[replica_id][i];
                    this.operation_list[replica_id][i] = this.operation_list[replica_id][j];
                    this.operation_list[replica_id][j] = temp_op;
                }
            }
        }
    }



    new_value(replica_id: number, time_stamp: number): string{
        var ds: CRDT_downstream[]=[];
        // initializing variables state
        for (var i = 0; i < this.variable_list.length; i++) {
            this.variable_list[i].init();
        }
        for (var i = 0; i < this.operation_list.length; i++) {
            for (var j = 0; j< this.operation_list[i].length; j++) {
                this.operation_list[i][j].is_executed=false;
            }
        
        }
        console.log('---------------------VALUE--------------------------------');
        ds = this.get_downstream_effect(replica_id,time_stamp);
        
        
        for(var i = 0; i < ds.length; i++){
            this.variable_list[replica_id].new_downstream(ds[i]);
            }
            
        //console.log(this.variable_list[replica_id].state);
        console.log('dispay result : '+this.variable_list[replica_id].display());
        return this.variable_list[replica_id].display();

    }

    //----------------------------------------
    get_downstream_effect(replica_id: number, time_stamp: number): CRDT_downstream []{
        var temp_merge_list: merge [] = [];
        var ds: CRDT_downstream[]=[];
        //console.log('function call : Replica id '+ replica_id + ' at time ' + time_stamp);

        

        // temp merge list conatins all the merge operations comming to the desired replica
        for (var k = 0; k < this.merge_list.length; k++) {// merge list loop
            if ((this.merge_list[k].to_time_stamp <= time_stamp) && (this.merge_list[k].to_replica == replica_id)) {
                temp_merge_list.push(this.merge_list[k]);
                
            }//if
        }//
        //console.log(temp_merge_list);
        // we sort the comming merges to the desired replica so we can execute them in the right order
        temp_merge_list = this.sort_merge_list(temp_merge_list);
        this.operation_sort(replica_id);
        if (temp_merge_list.length == 0) {
            console.log(this.operation_list);
            //console.log( this.operation_list[replica_id]);
            for (var i=0; i< this.operation_list[replica_id].length;i++){               
                if (( this.operation_list[replica_id][i].time_stamp <= time_stamp)&&(! this.operation_list[replica_id][i].is_executed)){
                    ds.push( this.variable_list[replica_id].new_at_source(this.operation_list[replica_id][i].operation,this.operation_list[replica_id][i].parameter));
                    this.operation_list[replica_id][i].is_executed= true;
                    // console.log('Adding executing operations ' + this.operation_list[replica_id][i]);
                }
            }	
          //  console.log('empty merge list add operations from replica ' + replica_id+ ' at time '+ time_stamp);
           // console.log(ds);
             return ds;
        } else {
            
                var n: number=temp_merge_list.length;
                //the down stream effect is the same as the down stream effects before the last merge + the merge effect

                // recursive call: the downstream effect  before the last merge
                ds = this.get_downstream_effect(replica_id,temp_merge_list[n-1].to_time_stamp-1);       
            //    console.log('values comming from replica ' +  ds.length);       
                //recursive call: the down stream effect of the last merg operation              
                var dds: CRDT_downstream[]  = this.get_downstream_effect(temp_merge_list[n-1].from_replica,temp_merge_list[n-1].from_time_stamp);
            //    console.log('comming values from merges '  + dds.length); 
                for (var j=0; j< dds.length;j++){
                    ds.push( dds[j]);
                }	
                
                
                // the operations left between the last merg operations and the requierd time
                for (var j=0; j< this.operation_list[replica_id].length;j++){
                    if ( (this.operation_list[replica_id][j].time_stamp > temp_merge_list[n-1].to_time_stamp) && (this.operation_list[replica_id][j].time_stamp<=time_stamp)&&(! this.operation_list[replica_id][j].is_executed)){
                       this.operation_list[replica_id][j].is_executed=true;
                        ds.push( this.variable_list[replica_id].new_at_source(this.operation_list[replica_id][j].operation,this.operation_list[replica_id][j].parameter));
                    }
                }	
    	    
        }	                

        return ds;

    }

    sort_merge_list(list: merge[]): merge[] {
        var temp: merge;
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
        switch (this.CRDT_TYPE_ENUMERATION){
            case 1 :
            return "increment";
            case 2 : 
            return "add ( 1 ) ";
            default : return "";
        }
        }
    get_DataType_Name(): string {
        switch (this.CRDT_TYPE_ENUMERATION){
            case 1 :
                return "counter";
            case 2 :
                return "Addwinn_Set ";
            default : return "";
        }
    }

    getValidOperations():[string]{
        switch (this.CRDT_TYPE_ENUMERATION){
            case 1 :
                return ["increment","decrement"];
            case 2 :
                return ["add(any)","remove(any)"];
            default : return [""];
        }
    }

}

















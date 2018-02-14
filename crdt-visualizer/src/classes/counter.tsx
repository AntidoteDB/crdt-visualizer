import {operation} from './operation';
import {CRDT_type} from './CRDT_type';
export type counter_downstream = number;
export type counter_state = number;

export class counter extends CRDT_type {

//---------- Properties---------------------    

    state: counter_state;    
    public operation_list: operation [] = [];


//----------Metods--------------------------

//////////CONSTRUCTOR///////////////////////
    constructor() {
        super();
        this.state = 0;
        
    }

    init(){
        this.state=0;
    }
    new_downstream(downstream_effect: counter_downstream):number{
       // console.log('operation execute ' + this.state+ downstream_effect);
       var r : number;
       r= this.state + downstream_effect;
       //console.log('the inner valie ' + r);
       this.state= r;
        return r;

    }
    new_at_source(operation_name: string): counter_downstream {
        let x: counter_downstream;
       if (operation_name=="increment")
       {    x= 1;
           return x;
        }
       else
       { x= -1;
        return x;}
    }

//executes the operations in the operation arry and change the inner_state of the object -downstream-
   

//-----------------------------------------------------------
    remove_op(op_time: number) {
        var index: number = -1;
        for (var i = 0; i < this.operation_list.length; i++) {
            if (op_time == this.operation_list[i].time_stamp) {
                index = i;
            }
        }
        if (index != -1) {
            this.operation_list.splice(index, 1);
        }
    }

//-----------------------------------------------------------
    getOp(op_time: number) : operation|null {
        var index: number = -1;
        for (var i = 0; i < this.operation_list.length; i++) {
            if (op_time == this.operation_list[i].time_stamp) {
                index = i;
                return this.operation_list[index];
            }
        }
        return null;
    }

//----------------------------------------------------------

//  operation_sort sorts the operations before performing downstream function, so that the operation are executed with respect of their timestamp    
    operation_sort() {
        var temp_op: operation;
        for (var i = 0; i < this.operation_list.length; i++) {
            for (var j = i + 1; j < this.operation_list.length; j++) {
                if (this.operation_list[i].time_stamp > this.operation_list[j].time_stamp) {
                    temp_op = this.operation_list[i];
                    this.operation_list[i] = this.operation_list[j];
                    this.operation_list[j] = temp_op;
                }
            }
        }
    }

    display(): string {
		let result : string = '{ ';
		result = ''+this.state;
		return result;
	}



}


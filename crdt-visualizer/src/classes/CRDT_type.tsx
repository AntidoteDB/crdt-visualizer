import {operation} from './operation';
import {AddWinsSet_Downstream} from './Addwinn_Set';
import {counter_downstream} from './counter';
import {AddWinsSet_state} from './Addwinn_Set';
import {counter_state} from './counter';

export type CRDT_state = counter_state|AddWinsSet_state;
export type CRDT_downstream = counter_downstream|AddWinsSet_Downstream;

export class CRDT_type {
    state:CRDT_state;
    id: number;
    
    init(){}

    new_at_source(operation_name: string,element?:any): CRDT_downstream{return 0;};

    new_downstream(downstream:CRDT_downstream){};

    display():string{return '';};

    getOp(op_time: number): operation|null   {return null;}
    remove_op(op_time: number) {}
    
    at_source(lower_time: number, upper_time: number) :number {return 0;}
    downstream(c: CRDT_type, lower_time: number, upper_time: number){}
    default_operation():string{return '';}
}
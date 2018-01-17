import {operation} from './operation';

export class CRDT_type {
    inner_value: number;
    id: number;
    public operation_list: operation [] = [];


    getOp(op_time: number): operation|null   {return null;}
    remove_op(op_time: number) {}
    at_source(lower_time: number, upper_time: number) {}
    downstream(c: CRDT_type, lower_time: number, upper_time: number){}
    default_operation():string{return '';}
}
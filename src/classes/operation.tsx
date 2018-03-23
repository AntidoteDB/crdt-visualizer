export class operation {
    time_stamp: number;
    operation: string;
    parameters: any[];

    constructor(operation: string, time_stamp: number) {
        this.time_stamp = time_stamp;
        this.operation = operation;
        this.parameters= [];
    }

    parse_parameter(fun_sign: string){
        let open_paranthese :number = fun_sign.indexOf('(');
        let close_paranthese: number = fun_sign.indexOf(')');
        this.operation =  fun_sign.substr(0,open_paranthese).trim();
        this.parameters =  [fun_sign.substr(open_paranthese+1,close_paranthese-open_paranthese-1).trim()];        
    }
}



export class operation {
    time_stamp: number;
    is_executed: boolean = false;
    operation: string;
    parameter: string='';

    constructor(operation: string, time_stamp: number) {
        this.time_stamp = time_stamp;
        this.operation = operation;
        this.parameter= '';
    }


    is_valid_operation(operation: string, CRDT_Type_enum: number): boolean {
        switch (CRDT_Type_enum)  {
            case 1 :// counter
            {
                return (operation == "increment" || operation == "decrement"); 
            }
            case 2: //set
            {
                if (operation == "add" || operation == "remove") {
                    return true;
                } else {
                    this.parse_parameter(operation);
                    return (this.operation == "add" || this.operation == "remove")
                } 
            }
            default : return false;    
        }
    }

    parse_parameter(fun_sign: string){
        let open_paranthese :number = fun_sign.indexOf('(');
        let close_paranthese: number = fun_sign.indexOf(')');
        this.operation =  fun_sign.substr(0,open_paranthese).trim();
        this.parameter =  fun_sign.substr(open_paranthese+1,close_paranthese-open_paranthese-1).trim();
        //console.log('Result : -'+this.operation+ '- ' + this.parameter);
    }
}



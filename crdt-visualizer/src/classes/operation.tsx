export class operation {
    time_stamp: number;
    is_executed_locally: boolean = false;
    operation: string;

    constructor(operation: string, time_stamp: number) {
        this.time_stamp = time_stamp;
        this.operation = operation;
    }

    apply(obj: any) {
        switch (this.operation) {
            case "increment": {
                obj.increment();
                break;
            }
            case "decrement": {
                obj.decrement();
                break;
            }
        }
    }

    is_valid_operation(operation: string): boolean {
        return (operation == "increment" || operation == "decrement");
    }
}



import { CRDT_type, Operation } from '../CRDT_type';

export type counter_downstream = number;
export type counter_state = number;

export class Counter implements CRDT_type<counter_downstream, counter_state> {


    initialState(): number {
        return 0;
    }

    downstream(operation: Operation, uid: string, state: number): number {
        if (operation.name === "increment") {
            return 1;
        } else {
            return -1;
        }
    }
    update(downstream: number, state: number): number {
        return state + downstream;
    }
    value(state: number): string {
        return state.toString();
    }
    defaultOperation(): string {
        return "increment";
    }
    operationSuggestions(): string[] {
        return ["increment", "decrement"];
    }
    checkOperation(operation: Operation): string | null {
        if (operation.name != "increment" && operation.name != "decrement") {
            return "Unsupported operation: " + operation.name;
        }
        if (operation.args.length != 0) {
            return "No arguments expected";
        }
        return null;
    }
    stateToString(state: number): string {
        return state.toString();
    }
    downstreamToString(downstream: number): string {
        return downstream.toString();
    }


}


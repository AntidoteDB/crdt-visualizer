import {CRDT_type, Operation} from '../CRDT_type';

export type counter_downstream = number;
export type counter_state = number;

interface Downstream_entry {
	value: number;
	valueType: string;
}

type Downstream = Downstream_entry[];

export class Integer implements CRDT_type<counter_downstream, Downstream> {

	initialState(): number {
        return 0;
    }
	downstream(operation: Operation, uid: string, state: number): Downstream {
		if (operation.name === "increment") {
			let elem = operation.args[0];		 
			return [{value: elem, valueType: operation.name}];
		} else if (operation.name === "decrement") {
			let elem = operation.args[0];		 
			return [{value: elem, valueType: operation.name}];
		}else if(operation.name === "set"){
			let elem = operation.args[0];	
			return [{value: elem, valueType: operation.name}];
		}else if(operation.name === "reset"){
			return [{value: 0, valueType: operation.name}];	
		}
		throw new Error();
	}
	update(downstream: Downstream, state: number): number {
		var val = 0;
		for (let e of downstream) {
			if(e.valueType === "increment"){
				val = state + Number(e.value);
			}else if(e.valueType === "decrement"){
				val = state - Number(e.value);
			}else if(e.valueType === "set"){
				val = Number(e.value);
			}else{
				val = Number(e.value);
			}
		}

       return val;
    }
	value(state: number): string {
        return state.toString();
    }
	defaultOperation(): string {
		return "increment(x)";
	}
	operationSuggestions(): string[] {
		return ["increment", "decrement","set","reset"];
	}

	checkOperation(operation: Operation): string|null {
		if (operation.name === "increment") {
			if (operation.args.length != 1) {
				return "add only takes one argument"
			}
		} else if (operation.name === "decrement") {
			if (operation.args.length != 1) {
				return "remove only takes one argument"
			}
		} else if (operation.name === "set") {
			if (operation.args.length != 1) {
				return "set only takes one argument"
			}
		}else if (operation.name === "reset") {
			if (operation.args.length != 0) {
				return "No arguments expected"
			}
		}else {
			return "Unsupported operation: " + operation.name;
		}
		return null;
	}

	stateToString(state: number): string {
        return state.toString();
    }
	downstreamToString(downstream: Downstream): string {
		var down_Stream = "";
		for (let e of downstream) {
			down_Stream =  e.valueType;
		}
        return down_Stream;
    }
}


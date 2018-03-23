import {CRDT_type, Operation} from '../CRDT_type';

type State = Map<string, string[]>;

interface Downstream_entry {
	element: string;
	addedTokens: string[];
	removedTokens: string[];
}

type Downstream = Downstream_entry[];


export class Set_aw implements CRDT_type<State, Downstream> {

	initialState(): State {
		return new Map();
	}
	downstream(operation: Operation, uid: string, state: State): Downstream {
		if (operation.name === "add") {
			let elem = operation.args[0];
			let tokens = state.get(elem);
			if (!tokens) {
				tokens = [];
			}
			return [{element: elem, addedTokens: [uid], removedTokens: tokens}];
		} else if (operation.name === "remove") {
			let elem = operation.args[0];
			let tokens = state.get(elem);
			if (!tokens) {
				tokens = [];
			}
			return [{element: elem, addedTokens: [], removedTokens: tokens}];
		}
		throw new Error();
	}
	update(downstream: Downstream, state: State): State {
		let newState = new Map(state);
		for (let e of downstream) {
			let tokens = state.get(e.element);
			if (tokens) {
				tokens = tokens.filter(x => !e.removedTokens.includes(x)).concat(e.addedTokens)
			} else {
				tokens = e.addedTokens;
			}
			if (tokens.length == 0) {
			    newState.delete(e.element);
            } else {
                newState.set(e.element, tokens);
            }
		}
		return newState;
	}
	value(state: State): string {
		let res = "{";
		state.forEach((val, key) => {
			if (res.length > 1) {
				res += ", ";
			}
			res += key;
		});
		res += "}";
		return res;
	}
	defaultOperation(): string {
		return "add(x)";
	}
	operationSuggestions(): string[] {
		return ["add", "remove"];
	}

	checkOperation(operation: Operation): string|null {
		if (operation.name === "add") {
			if (operation.args.length != 1) {
				return "add only takes one argument"
			}
		} else if (operation.name === "remove") {
			if (operation.args.length != 1) {
				return "remove only takes one argument"
			}
		} else {
			return "Unsupported operation: " + operation.name;
		}
		return null;
	}

	stateToString(state: State): string {
		let res = "{";
		state.forEach((val, key) => {
			if (res.length > 1) {
				res += ", ";
			}
			res += key + " " + val.toString()
		});
		res += "}";
		return res;
	}
	downstreamToString(downstream: Downstream): string {
		let res = "{";
		for (let e of downstream) {
			if (res.length > 1) {
				res += ", ";
			}
			res += "(" + e.element + ", " + e.addedTokens + ", " + e.removedTokens + ")"
		}
		res += "}";
		return res;
	}
}


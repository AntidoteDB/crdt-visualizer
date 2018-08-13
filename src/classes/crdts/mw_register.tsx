import { CRDT_type, Operation } from "../CRDT_type";

type State = Map<string, string[]>;

interface Downstream_entry {
  element: string;
  addedTokens: string[];
  removedTokens: string[];
}

type Downstream = Downstream_entry[];

export class Mw_register implements CRDT_type<State, Downstream> {
  initialState(): State {
    return new Map();
  }
  downstream(operation: Operation, uid: string, state: State): Downstream {
    debugger;
    if (operation.name === "assign") {
      let elem = operation.args[0];
      let tokens = [state.keys().next().value];
      if (!tokens) {
        tokens = [];
      }
      return [{ element: elem, addedTokens: [uid], removedTokens: tokens }];
    } else if (operation.name === "reset") {
      debugger;
      let tokens = [];
      let size = state.size;
      if (size > 0) {
        let iterator = state.values();

        while (size--) {
          tokens.push(iterator.next().value[0]);
        }
      }

      return [{ element: "", addedTokens: [], removedTokens: tokens }];
    }
    throw new Error();
  }
  update(downstream: Downstream, state: State): State {
    debugger;
    let newState = new Map(state);

    for (let e of downstream) {
      debugger;
      if (e.element === "") {
        /*         e.removedTokens.forEach(element => {
          let size = newState.size;
          if (size > 0) {
            let iterator = state.keys();

            while (size--) {
              let key = iterator.next().value[0];
              let keyValue = newState.get(key);
              if (keyValue && element === keyValue[0]) {
                newState.delete(key);
              }
            }
          }

          newState.delete(element);
        }); */

        newState.clear();
      } else {
        let tokens = state.get(e.element);

        if (!tokens) {
          newState.delete(e.removedTokens[0]);
          newState.set(e.element, e.addedTokens);
        }
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
    return "assign(x)";
  }
  operationSuggestions(): string[] {
    return ["assign", "reset"];
  }

  checkOperation(operation: Operation): string | null {
    if (operation.name === "assign") {
      if (operation.args.length != 1) {
        return "assign only takes one argument";
      }
    } else if (operation.name === "reset") {
      if (operation.args.length > 0) {
        return "remove does not take arguments";
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
      res += key + " " + val.toString();
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
      res +=
        "(" + e.element + ", " + e.addedTokens + ", " + e.removedTokens + ")";
    }
    res += "}";
    return res;
  }
}

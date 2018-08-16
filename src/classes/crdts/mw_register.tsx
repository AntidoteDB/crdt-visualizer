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
    let tokensArray: string[] = [];

    state.forEach(tokens => {
      tokensArray = tokensArray.concat(tokens);
    });

    if (operation.name === "assign") {
      let elem = operation.args[0];
      return [
        { element: elem, addedTokens: [uid], removedTokens: tokensArray }
      ];
    } else if (operation.name === "reset") {
      return [{ element: "", addedTokens: [], removedTokens: tokensArray }];
    }

    throw new Error();
  }

  update(downstream: Downstream, state: State): State {
    let newState = new Map(state);

    for (let e of downstream) {
      newState.forEach(function(tokens, key) {
        e.removedTokens.forEach(removedToken => {
          tokens.forEach(element => {
            if (element === removedToken) {
              tokens = tokens.filter(item => item !== removedToken);
              newState.set(key, tokens);
            }
          });
        });

        if (tokens.length === 0) {
          newState.delete(key);
        }
      });

      if (e.element !== "") {
        let tokens = newState.get(e.element);
        if (tokens) {
          newState.set(e.element, e.addedTokens.concat(tokens));
        } else {
          newState.set(e.element, e.addedTokens);
        }
      }
    }

    return newState;
  }

  value(state: State): string {
    let keys: string[] = [];

    state.forEach(function(elements, key) {
      keys.push(key);
    });

    keys = keys.sort();

    let res = "{";

    keys.forEach(key => {
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

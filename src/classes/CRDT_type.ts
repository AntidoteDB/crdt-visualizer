

export interface Operation {
    name: string;
    args: any[];
}

export type Arg = Operation | string | number;

export interface CRDT_type<State=any,Downstream=any> {

    /** initial state of the CRDT*/
    initialState(): State;

    /**
     * Downstream message generated for each operation.
     *
     * The unique identifier "uid" can be used as a unique token.
     */
    downstream(operation: Operation, uid: string, state: State): Downstream;

    /**
     * Updates the state by applying a downstream message
     */
    update(downstream: Downstream, state: State): State;

    /**
     * Displays the value of a given state as string.
     * Does not include meta data.
     */
    value(state: State): string;

    /**
     * The default operation, when adding a new operation to the interface.
     */
    defaultOperation(): string;

    /**
     * Suggestions for auto-completion the text-box
     */
    operationSuggestions(): string[];

    /**
     * Checks whether an operation is valid
     */
    checkOperation(operation: Operation): string | null;

    /**
     * Displays the state (including meta data)
     */
    stateToString(state: State): string;

    /**
     * Displays a downstream message
     */
    downstreamToString(downstream: Downstream): string;

}
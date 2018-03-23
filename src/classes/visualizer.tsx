import { CRDT_type, Operation } from './CRDT_type';
import {parseOperation} from './parser';

class Vectorclock {
    private v: number[] = [];

    constructor(size: number) {
        for (let i=0 ; i<size; i++) {
            this.v.push(0);
        }
    }

    get(r: number): number {
        return this.v[r];
    }

    with(r: number, n: number) {
        let res = new Vectorclock(this.v.length);
        for (let i=0 ; i<this.v.length; i++) {
            res.v[i] = this.v[i];
        }
        res.v[r] = n;
        return res;
    }

    leq(v: Vectorclock): boolean {
        for (let i=0; i<this.v.length; i++) {
            if (this.v[i] > v.get(i)) {
                return false;
            }
        }
        return true;
    }

    merge(v: Vectorclock): Vectorclock {
        let res = new Vectorclock(this.v.length);
        for (let i=0; i<this.v.length; i++) {
            res.v[i] = Math.max(this.get(i), v.get(i))
        }
        return res;
    }

    toString() {
        return "VC" + this.v.toString();
    }

}

interface operation_event<State=any, Downstream=any> {
    type: 'operation';
    vc?: Vectorclock;
    timestamp: number;
    preState?: State;
    postState?: State;
    downstream?: Downstream;
    operation: Operation;

}

interface merge_event<State=any> {
    type: 'merge';
    vc?: Vectorclock;
    timestamp: number;
    from_replica: number;
    from_time_stamp: number;
    preState?: State;
    postState?: State;
}

type event<State=any, Downstream=any> = merge_event<State> | operation_event<State, Downstream>;

//import {CRDT_state} from './CRDT_type';
export default class visualizer<State=any, Downstream=any> {


    //---------- Properties---------------------
    crdt: CRDT_type<State, Downstream>;
    // variable_list: State[] = [];
    // replica_list: replica[] = [];
    numberOfReplicas: number;
    event_list: event<State, Downstream>[][];
    resultsCalculated: boolean = false;

    //----------Metods--------------------------
    constructor(crdt: CRDT_type<State, Downstream>, numberOfReplicas: number = 3) {
        this.crdt = crdt;
        // //initializing replicas and variables
        // for (var i = 0; i < numberOfReplicas; i++) {
        //     this.add_replica(i);
        //     this.variable_list.push(crdt.initialState());
        // }

        //initializing operation list
        this.numberOfReplicas = numberOfReplicas;
        this.event_list = [];
        for (let i = 0; i < numberOfReplicas; i++) {
            this.event_list[i] = [];
        }
    }

    public new_value(replica_id: number, time_stamp: number): string {
        this.runSimulation(); // TODO cache result
        let vc = this.getVectorclock(replica_id, time_stamp);
        let state: State;
        if (vc.get(replica_id) > 0) {
            state = this.event_list[replica_id][vc.get(replica_id) - 1].postState!;
        } else {
            state = this.crdt.initialState();
        }
        return this.crdt.value(state);
    }

    public default_Operation(): string {
        return this.crdt.defaultOperation()
    }

    public remove_operation(replica_id: number, op_time: number) {
        this.resultsCalculated = false;
        this.event_list[replica_id] = this.event_list[replica_id].filter(o => !(o.type == "operation" &&  o.timestamp == op_time))
    }

    public move_operation(replica_id: number, op_Current_time: number, op_New_time: number) {
        this.resultsCalculated = false;
        for (let op of this.event_list[replica_id]) {
            if (op.type == "operation" && op.timestamp === op_Current_time) {
                op.timestamp = op_New_time;
            }
        }
    }

    public add_operationStr(replica_id: number, timestamp: number, opStr: string) {
        let op: Operation
        try {
            op = parseOperation(opStr)
        } catch (e) {
            // ignore parse error
            return
        }
        this.add_operation(replica_id, timestamp, op);
    }

    public add_operation(replica_id: number, timestamp: number, op: Operation) {
        if (this.crdt.checkOperation(op) !== null) {
            // invalid operation: ignore
            return;
        }

        this.insertEvent(replica_id, {
            type: "operation",
            timestamp: timestamp,
            operation: op
        });
    }

    private insertEvent(replica_id: number, event: event) {
        this.resultsCalculated = false;
        let toInsert = event;
        for (let i=0; i<this.event_list[replica_id].length; i++) {
            let current =this.event_list[replica_id][i];
            if (toInsert.timestamp < current.timestamp) {
                this.event_list[replica_id][i] = toInsert;
                toInsert = current;
            }
        }
        this.event_list[replica_id].push(toInsert);

    }


    public getValidOperations(): string[] {
        return this.crdt.operationSuggestions();
    }

    public getOp(replica_id: number, op_time: number): operation_event | null {
        for (let op of this.event_list[replica_id]) {
            if (op.type == "operation" && op.timestamp === op_time) {
                return op;
            }
        }
        return null;
    }

    public is_valid_operation(op: string): string|null {
        try {
            return this.crdt.checkOperation(parseOperation(op))
        } catch (e) {
            return e.toString()
        }
    }

    public add_merge(from_replica: number, from_time: number, to_replica: number, to_time: number) {
        this.insertEvent(to_replica, {
            type: "merge",
            timestamp: to_time,
            from_replica: from_replica,
            from_time_stamp: from_time
        })
    }

    public remove_merge(from_replica: number, from_time: number, to_replica: number, to_time: number) {
        this.resultsCalculated = false;
        this.event_list[to_replica] = this.event_list[to_replica].filter(m => {
            if (m.type == "merge") {
                return m.from_replica != from_replica
                    || m.from_time_stamp != from_time
                    || m.timestamp != to_time;
            }
            return true;
        });
    }

    private newVc(): Vectorclock {
        return new Vectorclock(this.event_list.length);
    }


    /**
     * Recursively calculates the vector clock for a given replica and time
     */
    private getVectorclock(replica: number, time: number): Vectorclock {
        let vc = new Vectorclock(this.event_list.length);

        for (let i=0; i< this.event_list[replica].length; i++) {
            let e = this.event_list[replica][i];
            if (e.timestamp > time) {
                return vc;
            }
            if (e.type == "merge") {
                vc = vc.with(replica, i+1).merge(this.getVectorclock(e.from_replica, e.from_time_stamp));
            } else {
                vc = vc.with(replica, i+1);
            }
        }
        return vc;
    }

    /**
     * Calculate vector clocks for all events
     */
    private calculateVectorClocks() {
        for (let r=0; r<this.numberOfReplicas; r++) {
            for (let e of this.event_list[r]) {
                e.vc = this.getVectorclock(r, e.timestamp);
            }
        }
    }

    /**
     * Simulate an execution of the given scenario
     * Stores results in the event-objects
     */
    private runSimulation() {
        if (this.resultsCalculated) {
            return;
        }
        this.calculateVectorClocks();

        let r = 0;
        let vc = this.event_list.map(x => this.newVc())
        let vc_wall = this.event_list.map(x => this.newVc())
        let state = vc.map(x => this.crdt.initialState())
        let active = vc.map((x,i) => i)

        while (true) {
            let eIndex = vc[r].get(r);

            if (eIndex >= this.event_list[r].length) {
                // no more events on this replica
                active = active.filter(x => x != r);
                vc_wall[r] = vc_wall[r].with(r, Number.POSITIVE_INFINITY);
                if (active.length == 0) {
                    break;
                }
                r = active[0];
                continue;
            }
            let e = this.event_list[r][eIndex];

            if (e.type == "operation") {
                e.preState = state[r];
                let uid = r + "." + vc[r].get(r);
                e.downstream = this.crdt.downstream(e.operation, uid, e.preState)
                e.postState = this.crdt.update(e.downstream, e.preState);
                state[r] = e.postState;
                vc[r] = vc[r].with(r, vc[r].get(r) + 1);
                vc_wall[r] = vc_wall[r].with(r, e.timestamp);
            } else if (e.type == "merge") {
                if (vc_wall[e.from_replica].get(e.from_replica) < e.from_time_stamp) {
                    // from-replica has not completed yet
                    // continue there
                    vc_wall[r] = vc_wall[r].with(r, e.timestamp - 1);
                    r = e.from_replica;
                    continue;
                }
                // execute all downstream operations, which are not yet executed
                e.preState = state[r];
                let fromVc = this.getVectorclock(e.from_replica, e.from_time_stamp);
                e.postState = this.executeDownstreams(e.preState, vc[r], fromVc);
                state[r] = e.postState;
                vc[r] = vc[r].with(r, vc[r].get(r) + 1).merge(fromVc);
                vc_wall[r] = vc_wall[r].with(r, e.timestamp);
            }

        }
        this.resultsCalculated = true;
    }

    /**
     * Executes all downstream operations, which are included in "toAdd" and not included in "done"
     */
    private executeDownstreams(state: State, done: Vectorclock, toAdd: Vectorclock): State {
        let ops: operation_event[] = []
        for (let es of this.event_list) {
            for (let e of es) {
                if (e.type == "operation" && e.vc!.leq(toAdd) && !e.vc!.leq(done)) {
                    ops.push(e);
                }
            }
        }
        while (ops.length > 0) {
            // find minimal event:
            let min = ops[0];
            let minPos = 0;
            for (let i = 1; i<ops.length; i++) {
                if (ops[i].vc!.leq(min.vc!)) {
                    min = ops[i];
                    minPos = i;
                }
            }
            // execute event and remove it from list of pos:
            ops.splice(minPos, 1);
            state = this.crdt.update(min.downstream!, state);
        }
        return state;
    }



}

















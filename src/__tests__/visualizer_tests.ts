import visualizer from '../classes/visualizer'
import {Counter} from '../classes/crdts/counter'
import {Set_aw} from "../classes/crdts/set_aw";

describe("visualizer", () => {

    it("should work with sequential counters", () => {
        let vis = new visualizer(new Counter());
        vis.add_operationStr(0, 10, "increment()")
        vis.add_operationStr(0, 20, "increment()")
        vis.add_operationStr(0, 30, "increment()")
        expect(vis.new_value(0, 9, true)).toBe("0")
        expect(vis.new_value(0, 10, false)).toBe("1")
        expect(vis.new_value(0, 20, false)).toBe("2")
        expect(vis.new_value(0, 30, false)).toBe("3")
        expect(vis.new_value(0, 100, false)).toBe("3")
    })

    it("simple merge", () => {
        let vis = new visualizer(new Counter());
        vis.add_operationStr(0, 10, "increment()")
        vis.add_merge(0, 15, 1, 20);
        expect(vis.new_value(0, 10, false)).toBe("1")
        expect(vis.new_value(1, 19, false)).toBe("0")
        expect(vis.new_value(0, 20, false)).toBe("1")
    })

    it("Set_aw, sequential", () => {
        let vis = new visualizer(new Set_aw());
        vis.add_operationStr(0, 10, "add(x)")
        vis.add_operationStr(0, 20, "remove(x)")
        expect(vis.new_value(0, 10, false)).toBe("{x}")
        expect(vis.new_value(0, 20, false)).toBe("{}")
    })

    it("Set_aw, merge", () => {
        let vis = new visualizer(new Set_aw());
        vis.add_operationStr(0, 10, "add(x)")
        vis.add_operationStr(1, 20, "remove(x)")
        vis.add_merge(0, 11, 1, 12);
        vis.add_merge(1, 21, 0, 22);
        expect(vis.new_value(0, 10, false)).toBe("{x}")
        expect(vis.new_value(1, 11, false)).toBe("{}")
        expect(vis.new_value(1, 12, false)).toBe("{x}")
        expect(vis.new_value(1, 20, false)).toBe("{}")
        expect(vis.new_value(0, 22, false)).toBe("{}")
    })


})
import visualizer from '../classes/visualizer'
import {Counter} from '../classes/crdts/counter'
import {Set_aw} from "../classes/crdts/set_aw";

describe("visualizer", () => {

    it("should work with sequential counters", () => {
        let vis = new visualizer(new Counter());
        vis.add_operationStr(0, 10, "increment()")
        vis.add_operationStr(0, 20, "increment()")
        vis.add_operationStr(0, 30, "increment()")
        expect(vis.new_value(0, 9)).toBe("0")
        expect(vis.new_value(0, 10)).toBe("1")
        expect(vis.new_value(0, 20)).toBe("2")
        expect(vis.new_value(0, 30)).toBe("3")
        expect(vis.new_value(0, 100)).toBe("3")
    })

    it("simple merge", () => {
        let vis = new visualizer(new Counter());
        vis.add_operationStr(0, 10, "increment()")
        vis.add_merge(0, 15, 1, 20);
        expect(vis.new_value(0, 10)).toBe("1")
        expect(vis.new_value(1, 19)).toBe("0")
        expect(vis.new_value(0, 20)).toBe("1")
    })

    it("Set_aw, sequential", () => {
        let vis = new visualizer(new Set_aw());
        vis.add_operationStr(0, 10, "add(x)")
        vis.add_operationStr(0, 20, "remove(x)")
        expect(vis.new_value(0, 10)).toBe("{x}")
        expect(vis.new_value(0, 20)).toBe("{}")
    })

    it("Set_aw, merge", () => {
        let vis = new visualizer(new Set_aw());
        vis.add_operationStr(0, 10, "add(x)")
        vis.add_operationStr(1, 20, "remove(x)")
        vis.add_merge(0, 11, 1, 12);
        vis.add_merge(1, 21, 0, 22);
        expect(vis.new_value(0, 10)).toBe("{x}")
        expect(vis.new_value(1, 11)).toBe("{}")
        expect(vis.new_value(1, 12)).toBe("{x}")
        expect(vis.new_value(1, 20)).toBe("{}")
        expect(vis.new_value(0, 22)).toBe("{}")
    })


})
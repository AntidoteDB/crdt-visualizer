import {parseOperation} from '../classes/parser'

describe("Parser", ()=> {
	it("Parses operations", () => {
		let p = parseOperation("add(x)")
		expect(p.name).toBe("add")
		expect(p.args).toMatchObject(["x"])
	})
})


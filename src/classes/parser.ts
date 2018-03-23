import { Operation, Arg } from './CRDT_type';

/**
 * Parses a string into an operation.
 *
 * Throws Errors when there are parse errors
 */
export function parseOperation(op: string): Operation {
	let res = parseOperationH(new Reader(op));
	if (typeof res === "string") {
		return {
			name: res,
			args: []
		};
	}
	return res;
}

class Reader {

	s: string;
	pos: number = 0;
	constructor(s: string) {
		this.s = s;
	}

	next(): string {
		let c = this.lookahead();
		this.pos++;
		return c;
	}

	lookahead(): string {
		if (this.pos >= this.s.length) {
			return "end";
		}
		return this.s.charAt(this.pos);
	}

	skipWhitespace() {
		while (this.pos < this.s.length && isWhitespace(this.lookahead())) {
			this.pos++;
		}
	}

	expect(c: string) {
		let x = this.next();
		if (x !== c) {
			throw new Error("Error at position " + (this.pos-1) + " in '" + this.s + "':\nExpected '" + c + "', but found '" + x + "'.");
		}
	}
}



function parseOperationH(r: Reader): Operation|string {
	r.skipWhitespace();
	let name = parseIdentifier(r);
	r.skipWhitespace();
	let args = parseParams(r);
	if (!args) {
		return name;
	}
	r.skipWhitespace();
	return {
		name: name,
		args: args
	}
}

function parseParams(r: Reader): Arg[]|null {
	if (r.lookahead() != "(") {
		return null;
	}
	let args: Arg[] = []
	r.expect("(");
	r.skipWhitespace();
	while (r.lookahead() != ")") {
		args.push(parseArg(r));
		if (r.lookahead() != ")") {
			r.expect(",");
			r.skipWhitespace();
		}
	}
	r.expect(")");
	r.skipWhitespace();
	return args;
}

function parseArg(r: Reader): Arg {
	let l = r.lookahead();
	if (isLetter(l)) {
		return parseOperationH(r);
	} else if (isNumber(l)) {
		return parseNumber(r);
	}
	throw new Error("Expected argument");
}

function parseIdentifier(r: Reader): string {
	let res = "";
	while (isLetter(r.lookahead())) {
		res += r.next();
	}
	return res;
}

function parseNumber(r: Reader): number {
	let res = "";
	while (isNumber(r.lookahead())) {
		res += r.next();
	}
	return parseInt(res);
}

function isLetter(str: string): boolean {
	return str.length == 1 && !!str.match(/[a-z]/i);
}

function isNumber(str: string): boolean {
	return str.length == 1 && !!str.match(/[0-9]/i);
}

function isWhitespace(str: string): boolean {
	return str.length == 1 && !!str.match(/[ \t]/i);
}
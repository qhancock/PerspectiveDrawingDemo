class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	distanceTo(other: Point): number {
		let xDiff = Math.abs(this.x - other.x);
		let yDiff = Math.abs(this.y - other.y);

		return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
	}
}

class LineSegment {
	start: Point;
	end: Point;

	constructor(start: Point, end: Point) {
		this.start = start;
		this.end = end;
	}

	length(): number {
		return this.start.distanceTo(this.end);
	}
}
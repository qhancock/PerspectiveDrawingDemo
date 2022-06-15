class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static distanceBetween(a: Point, b: Point): number {
		let xDiff = Math.abs(a.x - b.x);
		let yDiff = Math.abs(a.y - b.y);

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
		return Point.distanceBetween(this.start, this.end);
	}
}

class Quad {
	points: Point[];

	constructor(points: Point[]) {
		this.points = points;
	}
}
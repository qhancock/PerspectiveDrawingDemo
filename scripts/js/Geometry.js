export class Point {
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equals(other) {
		return this.x == other.x && this.y == other.y;
	}

	static dx(a, b) {
		return b.x - a.x;
	}

	static dy(a, b) {
		return b.y - a.y;
	}

	static distSq(a, b) {
		let dx = Math.abs(Point.dx(a, b));
		let dy = Math.abs(Point.dy(a, b));

		return Math.pow(dx, 2) + Math.pow(dy, 2);
	}

	static distance(a, b) {
		return Math.sqrt(this.distSq(a, b));
	}
}

export class LineSegment {
	start;
	end;

	constructor(start, end) {
		this.start = start;
		this.end = end;
	}

	slope() {
		return (this.end.y - this.start.y) / (this.end.x - this.start.x);
	}

	contains(point) {
		let segSqStart = Point.distSq(this.start, point);
		let segSqEnd = Point.distSq(this.end, point);


		let segSq = this.segSq();

		return segSqStart + segSqEnd == segSq;
	}

	segSq() {
		return Point.distSq(this.start, this.end);
	}

	length() {
		return Point.distance(this.start, this.end);
	}

	x() {
		return Point.dx(this.start, this.end);
	}

	y() {
		return Point.dy(this.start, this.end);
	}

	equals(other) {
		return (this.start.equals(other.start) && this.end.equals(other.end)) || (this.start.equals(other.end) && this.end.equals(other.start));
	}

	static intersect(a, b) {

		if (a.equals(b)) {
			return;
		}

		let s = (a.x() * (a.start.y - b.start.y) - a.y() * (a.start.x - b.start.x)) / (a.x() * b.y() + -b.x() * a.y());
		let t = (b.x() * (a.start.y - b.start.y) - b.y() * (a.start.x - b.start.x)) / (a.x() * b.y() + -b.x() * a.y());

		let intersect = 0 <= s && s <= 1 && 0 <= t && t <= 1;

		if (intersect) {
			let intersectX = a.start.x + t * a.x();
			let intersectY = a.start.y + t * a.y();

			return new Point(intersectX, intersectY);
		}
	}
}

export class Polygon {
	points;
	segments;
	numPoints;

	constructor(points) {
		this.points = points;
		this.numPoints = this.points.length;
		this.segments = new Array(this.numPoints);

		for (let point = 0; point < this.points.length; point++) {
			let currentPoint = this.points[point % this.points.length];
			let nextPoint = this.points[(point + 1) % this.points.length];

			let currentSegment = new LineSegment(currentPoint, nextPoint);
			this.segments[point] = currentSegment;
		}
	}

	intersects(cross) {
		let intersects = [];

		for (let seg of this.segments) {
			let intersect = LineSegment.intersect(seg, cross);
			if (intersect != undefined) {
				intersects.push(intersect);
			}
		}

		return intersects;
	}
}
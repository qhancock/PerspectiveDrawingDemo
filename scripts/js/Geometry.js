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

	translate(dx, dy) {
		this.x += dx;
		this.y += dy;
	}

	getRelativePoint(dx, dy) {
		return new Point(this.x + dx, this.y + dy);
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
		let distToStart = Point.distance(this.start, point);
		let distToEnd = Point.distance(this.end, point);

		return Math.pow((distToStart + distToEnd), 2) == this.segSq();
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

	translate(dx, dy) {
		this.start.translate(dx, dy);
		this.end.translate(dx, dy);
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

	constructor(points) {
		this.points = points;
		this.numPoints = this.points.length;
	}

	getEdges() {
		let edges = new Array(this.numPoints);

		for (let point = 0; point < this.points.length; point++) {
			let currentPoint = this.points[point % this.points.length];
			let nextPoint = this.points[(point + 1) % this.points.length];

			let currentSegment = new LineSegment(currentPoint, nextPoint);
			edges[point] = currentSegment;
		}

		return edges;
	}

	translate(dx, dy) {
		for(let point of this.points) {
			point.translate(dx, dy);
		}
	}

	intersects(cross) {
		let intersects = [];

		for (let seg of this.getEdges()) {
			let intersect = LineSegment.intersect(seg, cross);
			if (intersect != undefined) {
				intersects.push(intersect);
			}
		}

		return intersects;
	}

	onEdge(point) {
		for(let edge of this.getEdges()) {
			if(edge.contains(point)) {
				return true;
			}
		}
		return false;
	}

	contains(point) {

		let farthestRightPoint;

		for(let point of this.points) {
			if(farthestRightPoint==null || point.x > farthestRightPoint.x) {
				farthestRightPoint = point;
			}
		}

		let exitPoint = new Point(farthestRightPoint.x+1, point.y);

		let exiter = new LineSegment(point, exitPoint);
		let passPoints = this.intersects(exiter);
		let passes = passPoints.length;
		let startedIn = passes%2 == 1;

		return startedIn;

	}

}

export class Square extends Polygon {
	side;
	center;

	constructor(center, side) {

		let half = side/2;
		let points = [];
		points.push(center.getRelativePoint(-half, half));
		points.push(center.getRelativePoint(-half, -half));
		points.push(center.getRelativePoint(half, -half));
		points.push(center.getRelativePoint(half, half));

		super(points);
		
		this.side = side;
		this.center = center;
	}

	translate(dx, dy) {
		super.translate(dx, dy);
		this.center.translate(dx, dy);
	}
	
	contains(point) {
		return point.x>this.points[1].x && point.x<this.points[3].x && point.y>this.points[1].y && point.y<this.points[3].y;
	}
}
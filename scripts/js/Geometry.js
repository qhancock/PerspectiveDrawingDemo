class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distanceTo(other) {
        let xDiff = Math.abs(this.x - other.x);
        let yDiff = Math.abs(this.y - other.y);
        return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    }
}
class LineSegment {
    start;
    end;
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    length() {
        return this.start.distanceTo(this.end);
    }
}

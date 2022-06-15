class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static distanceBetween(a, b) {
        let xDiff = Math.abs(a.x - b.x);
        let yDiff = Math.abs(a.y - b.y);
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
        return Point.distanceBetween(this.start, this.end);
    }
}
class Quad {
    points;
    constructor(points) {
        this.points = points;
    }
}

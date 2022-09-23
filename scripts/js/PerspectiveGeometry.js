import * as Geometry from "./Geometry.js";
import { face } from "./OnePointPerspective.js";

function computedVertexRayScalar(sideLength, vp, faceVertex) {
	let sideFovRatio = 2/Math.PI * Math.atan(sideLength/(Geometry.Point.distance(faceVertex, vp)));
	return 1 - sideFovRatio;
}

function computedComputedVertexRayScalar(sideLength, vp, faceVertices) {

	let scalar = 0;
	for(let faceVertex of faceVertices) {
		scalar+=computedVertexRayScalar(sideLength, vp, faceVertex);
	}
	return scalar/faceVertices.length;
}

export function getComputedVertex(sideLength, vp, faceVertex, scalar=undefined, adjustmentRatio = 1) {
	
	if(!scalar) {
		scalar = computedVertexRayScalar(sideLength, vp, faceVertex)
		scalar*=adjustmentRatio
	}

	return vp.getRelativePoint(scalar*Geometry.Point.dx(vp, faceVertex), scalar*Geometry.Point.dy(vp, faceVertex));

}

export default function getComputedVertices(sideLength, vp, faceVertices, adjustmentRatio=1, useUnique=false, adjustmentBump=0) {

	let scalar;
	if(!useUnique) {
		scalar = computedComputedVertexRayScalar(sideLength, vp, faceVertices);
		scalar*=adjustmentRatio;
	}

	let computedVertices = [];

	for(let faceVertex of faceVertices) {
		if(useUnique) {
			scalar = computedVertexRayScalar(sideLength, vp, faceVertex)
		}
		computedVertices.push(getComputedVertex(sideLength, vp, faceVertex, scalar));
	}

	return computedVertices;
}

export class FigureEdge extends Geometry.LineSegment {

	guide;
	xray = false;
	vpID;
	front = false;

	constructor(edge, VP, vpID) {
		super(edge.start, edge.end);

		if(VP == undefined) {
			return;
		}

		this.vpID = vpID;

		if(Geometry.Point.distSq(edge.start, VP) < Geometry.Point.distSq(edge.end, VP)) {
			this.guide = new Geometry.LineSegment(edge.start, VP);
		} else {
			this.guide = new Geometry.LineSegment(edge.end, VP);
		}
	}

	hasGuide() {
		return this.guide!=undefined;
	}

}

export class FigureFace extends Geometry.Polygon {

	figureEdges;
	visible = true;

	//precondition: the passed edges must form a polygon
	constructor(figureEdges) {
		let uniquePoints = [];
		uniquePoints.push(figureEdges[0].start)

		let collectPointChain = function(startPoint) {
			for(let edge of figureEdges) {
				if(edge.start.equals(startPoint)) {
					uniquePoints.push(edge.end)
				} else if(edge.end.equals(startPoint)) {
					uniquePoints.push(edge.start)
				}
				figureEdges.splice(figureEdges.indexOf(edge), 1)
				if(edge.start.equals(startPoint)) {
					collectPointChain(edge.end)
				} else if(edge.end.equals(startPoint)) {
					collectPointChain(edge.start)
				}
			}
		}
		
		super(uniquePoints);
		this.figureEdges = figureEdges;
	}

	getEdges() {
		return this.figureEdges;
	}

}
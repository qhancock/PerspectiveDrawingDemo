import * as Geometry from "./Geometry.js";
import * as PerspectiveGeometry from "./PerspectiveGeometry.js"
import getComputedVertex from "./PerspectiveGeometry.js";

var VPS = [undefined, undefined, undefined, undefined];
export var centerPoint;
var sideLength;

export function reset() {
	let viewer = globalThis.viewer;
	let portRadius = (viewer.getWidth() < viewer.getHeight() ? viewer.getWidth() : viewer.getHeight()) * (1/2);

	//top right
	VPS[1] = viewer.getCenter().getRelativePoint(Math.cos(Math.PI/6) * portRadius, -Math.sin(Math.PI/6) * portRadius).getRelativePoint(0, -portRadius/5)
	
	//top left
	VPS[2] = viewer.getCenter().getRelativePoint(Math.cos(5 * Math.PI/6) * portRadius, -Math.sin(5 * Math.PI/6) * portRadius).getRelativePoint(0, -portRadius/5)
	
	//bottom
	VPS[3] = viewer.getCenter().getRelativePoint(Math.cos(3 * Math.PI/2) * portRadius, -Math.sin(3 * Math.PI/2) * portRadius).getRelativePoint(0, -portRadius/5)

	sideLength = Math.sqrt(viewer.getArea())/12;
	centerPoint = viewer.getCenter().getRelativePoint(0, -portRadius/5);
}

function getFrontPoints() {
	let frontPoints = [undefined]

	for (let vp of VPS.slice(1)) {
		frontPoints.push(PerspectiveGeometry.getComputedVertex(sideLength, vp, centerPoint, undefined, .85))
	}

	return frontPoints
}

function getFrontSegs(frontPoints) {
	let frontSegs = [undefined]

	if(!frontPoints) {
		frontPoints = getFrontPoints()
	} 

	for (let vp = 1; vp<=3; vp++) {
		frontSegs.push(new Geometry.LineSegment(centerPoint, (frontPoints[vp])))
	}
	for (let seg = 1; seg<=3; seg++) {
		frontSegs[seg] = new PerspectiveGeometry.FigureEdge(frontSegs[seg], VPS[seg], seg)
	}

	return frontSegs
}

function getOuterData(frontPoints) {
	if(!frontPoints) {
		frontPoints = getFrontPoints()
	}

	let outerPoints = [undefined]
	let outerSegSets = [undefined]

	for(let vp = 0; vp<3; vp++) {
		let outerSegSet = []
		let crossLine1 = new Geometry.LineSegment(VPS[(vp+1) % 3 + 1], frontPoints[(vp+2) % 3 + 1]);
		let crossLine2 = new Geometry.LineSegment(VPS[(vp+2) % 3 + 1], frontPoints[(vp+1) % 3 + 1]);

		console.log(crossLine1, crossLine2)

		outerPoints.push(Geometry.LineSegment.intersect(crossLine1, crossLine2));

		let crossSeg1 = new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(frontPoints[(vp+2) % 3 + 1], outerPoints[vp+1]), VPS[(vp+1)%3 + 1], (vp+1)%3 + 1)
		let crossSeg2 = new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(frontPoints[(vp+1) % 3 + 1], outerPoints[vp+1]), VPS[(vp+2)%3 + 1], (vp+2)%3 + 1)
		outerSegSet = [crossSeg1, crossSeg2];
		outerSegSets.push(outerSegSet);
	}

	return {
		"outerPoints" : outerPoints,
		"outerSegSets" : outerSegSets
	}
}

function getBackData(outerData) {
	if (!outerData) {
		outerData = getOuterData();
	}

	let	backBottomCrossConnect1 = new Geometry.LineSegment(outerData.outerPoints[1], VPS[1]);
	let backBottomCrossConnect2 = new Geometry.LineSegment(outerData.outerPoints[2], VPS[2]);

	let backPoint = Geometry.LineSegment.intersect(backBottomCrossConnect1, backBottomCrossConnect2);

	let backEdges = [undefined]

	for(let vp = 1; vp<=3; vp++) {
		let backSeg = new Geometry.LineSegment(outerData.outerPoints[vp], backPoint);
		let backEdge = new PerspectiveGeometry.FigureEdge(backSeg, VPS[vp], vp)
		backEdges.push(backEdge);
	}

	return {
		"backPoint" : backPoint,
		"backEdges" : backEdges
	}
}

export function getViewerData() {
	let x = getFrontSegs().slice(1)
	let outerSegSets = getOuterData().outerSegSets;
	let backData = getBackData().backEdges;
	for(let i = 1; i<=3; i++) {
		let set = outerSegSets[i]
		for(let seg of set) {
			x.push(seg)
		}
		x.push(backData[i]);
	}

	return x
}
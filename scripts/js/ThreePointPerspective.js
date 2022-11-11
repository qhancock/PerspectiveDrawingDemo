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

		// console.log(crossLine1, crossLine2)

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

function getFaces(frontSegs, outerSegSets, backEdges) {

	let frontPoints;
	if(!frontSegs) {
		frontPoints = getFrontPoints()
		frontSegs = getFrontSegs(frontPoints);
	}

	let outerData
	if(!outerSegSets) {
		if(!frontPoints) {
			frontPoints = getFrontPoints()
		}
		outerData = getOuterData(frontPoints)
		outerSegSets = outerData.outerSegSets
	}

	if(!backEdges){
		if(!outerData) {
			outerData = getOuterData(frontPoints)
		}
		backEdges = getBackData(outerData).backEdges;
	}

	let frontRight = new PerspectiveGeometry.FigureFace([frontSegs[3], frontSegs[1], outerSegSets[2][1], outerSegSets[2][0]]);
	let frontLeft = new PerspectiveGeometry.FigureFace([frontSegs[3], frontSegs[2], outerSegSets[1][1], outerSegSets[1][0]]);
	let frontTop = new PerspectiveGeometry.FigureFace([frontSegs[1], frontSegs[2], outerSegSets[3][1], outerSegSets[3][0]]);
	let backRight = new PerspectiveGeometry.FigureFace([backEdges[3], backEdges[2], outerSegSets[2][0], outerSegSets[3][1]]);
	let backLeft = new PerspectiveGeometry.FigureFace([backEdges[3], backEdges[1], outerSegSets[3][0], outerSegSets[1][1]]);
	let backBottom = new PerspectiveGeometry.FigureFace([backEdges[1], backEdges[2], outerSegSets[1][0], outerSegSets[2][1]]);
	
	return {
		"frontRight" : frontRight,
		"frontLeft" : frontLeft,
		"frontTop": frontTop,
		"backRight" : backRight,
		"backLeft" : backLeft,
		"backBottom" : backBottom
	}
}

function setFaceVisibility(frontPoints, faces) {
	let l_bound = new Geometry.LineSegment(VPS[2], VPS[3])
	let r_bound = new Geometry.LineSegment(VPS[3], VPS[1])
	let t_bound = new Geometry.LineSegment(VPS[1], VPS[2])

	if(!frontPoints) {
		frontPoints = getFrontPoints()
	}
	if(!faces) {
		faces = getFaces()
	}

	faces["backRight"].visible = false
	faces["backLeft"].visible = false
	faces["backBottom"].visible = false

	if(t_bound.yDist(centerPoint)>0) {
		faces["frontTop"].visible = false;
	}
	if(t_bound.yDist(frontPoints[3])>0) {
		faces["backBottom"].visible = true;
	}

	if(r_bound.yDist(centerPoint)<0) {
		faces["frontRight"].visible = false;
	}
	if(r_bound.yDist(frontPoints[2])<0) {
		faces["backLeft"].visible = true;
	}

	if(l_bound.yDist(centerPoint)<0) {
		faces["frontLeft"].visible = false;
	}
	if(l_bound.yDist(frontPoints[1])<0) {
		faces["backRight"].visible = true;
	}

	return faces
}

export function getViewerData() {
	let frontPoints = getFrontPoints()
	let frontSegs = getFrontSegs(frontPoints)
	let outerData = getOuterData(frontPoints)
	let backData = getBackData(outerData)
	let figureFaces = getFaces(frontSegs, outerData.outerSegSets, backData.backEdges)
	figureFaces = setFaceVisibility(frontPoints, figureFaces)

	console.log(figureFaces)

	let viewerData = []
	for(let figureFace in figureFaces) {
		let currentFigureFace = figureFaces[figureFace];
		if (currentFigureFace.visible) {
			for(let figureEdge of currentFigureFace.figureEdges) {
				let presence = viewerData.indexOf(figureEdge)
				if(presence==-1) {
					viewerData.push(figureEdge);
				} else {
					viewerData[presence].front = true
				}
			}
		}
	}
	for(let figureFace in figureFaces) {
		let currentFigureFace = figureFaces[figureFace];
		if (!currentFigureFace.visible) {
			for(let figureEdge of currentFigureFace.figureEdges) {
				if(viewerData.indexOf(figureEdge)==-1) {
					figureEdge.xray = true
					viewerData.push(figureEdge);
				}
			}
		}
	}

	return viewerData
}
import * as Geometry from "./Geometry.js";
import * as PerspectiveGeometry from "./PerspectiveGeometry.js"
import getComputedVertices from "./PerspectiveGeometry.js";

var VP1, VP2;
export var centerSeg;

export function reset() {
	let viewer = globalThis.viewer;

	VP1 = viewer.getCenter().getRelativePoint(-viewer.getWidth()/3, -viewer.getHeight()/6);
	VP2 = VP1.getRelativePoint((2/3) * viewer.getWidth(), 0);

	// VP1 = viewer.getCenter();
	// VP2 = viewer.getCenter().getRelativePoint(50, 50);

	// VP1 = viewer.getCenter().getRelativePoint(-viewer.getWidth()/3, -viewer.getHeight()/3);
	// VP2 = viewer.getCenter().getRelativePoint(viewer.getWidth()/3, viewer.getHeight()/3);

	let sideLength = Math.sqrt(viewer.getArea())/10;
	let segCenter = viewer.getCenter().getRelativePoint(0, (1/6)*viewer.getHeight());
	let centerSegTop = segCenter.getRelativePoint(0, -sideLength/2);
	let centerSegBottom = segCenter.getRelativePoint(0, sideLength/2);
	centerSeg = new Geometry.LineSegment(centerSegTop, centerSegBottom);
}

function getCenterSegTop() {
	return centerSeg.start;
}
function getCenterSegBottom() {
	return centerSeg.end;
}

function getVP1computedVertices() {
	let VP1computedVertices = getComputedVertices(centerSeg.length(), VP1, [centerSeg.start, centerSeg.end], 0.9625);

	return {
		"top" : VP1computedVertices[0],
		"bottom" : VP1computedVertices[1]
	}

}

function getVP2computedVertices() {
	let VP2computedVertices = getComputedVertices(centerSeg.length(), VP2, [centerSeg.start, centerSeg.end], 0.9625);

	return {
		"top" : VP2computedVertices[0],
		"bottom" : VP2computedVertices[1]
	}

}

function getBackVertices(VP1computedVertices, VP2computedVertices) {
	let VP1bottomCrossConnect = new Geometry.LineSegment(VP1, VP2computedVertices["bottom"]);
	let VP1topCrossConnect = new Geometry.LineSegment(VP1, VP2computedVertices["top"]);
	let VP2bottomCrossConnect = new Geometry.LineSegment(VP2, VP1computedVertices["bottom"]);
	let VP2topCrossConnect = new Geometry.LineSegment(VP2, VP1computedVertices["top"]);

	let bottomCrossVertex = Geometry.LineSegment.intersect(VP1bottomCrossConnect, VP2bottomCrossConnect);
	let topCrossVertex = Geometry.LineSegment.intersect(VP1topCrossConnect, VP2topCrossConnect);

	return {
		"top" : topCrossVertex,
		"bottom" : bottomCrossVertex
	}
}

function getFigureEdges() {

	let VP1computedVertices = getVP1computedVertices();
	let VP2computedVertices = getVP2computedVertices();
	let backVertices = getBackVertices(VP1computedVertices, VP2computedVertices);

	return {

		"centerSeg": new PerspectiveGeometry.FigureEdge(centerSeg),
		"backSeg": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(backVertices.top, backVertices.bottom)),

		"VP1ofCenterFTop": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(getCenterSegTop(), VP1computedVertices.top), VP1, 1),
		"VP1ofCenterFBottom": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(getCenterSegBottom(), VP1computedVertices.bottom), VP1, 1),
		"VP1ofCenter": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(VP1computedVertices.top, VP1computedVertices.bottom)),
		"VP1ofCenterBTop": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(backVertices.top, VP1computedVertices.top), VP2, 2),
		"VP1ofCenterBBottom": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(backVertices.bottom, VP1computedVertices.bottom), VP2, 2),

		"VP2ofCenterFTop": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(getCenterSegTop(), VP2computedVertices.top), VP2, 2),
		"VP2ofCenterFBottom": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(getCenterSegBottom(), VP2computedVertices.bottom), VP2, 2),
		"VP2ofCenter": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(VP2computedVertices.top, VP2computedVertices.bottom)),
		"VP2ofCenterBTop": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(backVertices.top, VP2computedVertices.top), VP1, 1),
		"VP2ofCenterBBottom": new PerspectiveGeometry.FigureEdge(new Geometry.LineSegment(backVertices.bottom, VP2computedVertices.bottom), VP1, 1)

	}

}

function getFaces(figureEdges) {

	return {
		"topFace" : new PerspectiveGeometry.FigureFace([figureEdges.VP1ofCenterBTop, figureEdges.VP2ofCenterBTop, figureEdges.VP2ofCenterFTop, figureEdges.VP1ofCenterFTop]),
		"VP1ofCenterB" : new PerspectiveGeometry.FigureFace([figureEdges.VP1ofCenterBTop, figureEdges.backSeg, figureEdges.VP1ofCenterBBottom, figureEdges.VP1ofCenter]),
		"VP2ofCenterB" : new PerspectiveGeometry.FigureFace([figureEdges.VP2ofCenterBTop, figureEdges.VP2ofCenter, figureEdges.VP2ofCenterBBottom, figureEdges.backSeg]),
		"VP2ofCenterF" : new PerspectiveGeometry.FigureFace([figureEdges.VP2ofCenterFTop, figureEdges.VP2ofCenter, figureEdges.VP2ofCenterFBottom, figureEdges.centerSeg]),
		"VP1ofCenterF" : new PerspectiveGeometry.FigureFace([figureEdges.VP1ofCenterFTop, figureEdges.centerSeg, figureEdges.VP1ofCenterFBottom, figureEdges.VP1ofCenter]),
		"bottomFace" : new PerspectiveGeometry.FigureFace([figureEdges.VP1ofCenterBBottom, figureEdges.VP2ofCenterBBottom, figureEdges.VP2ofCenterFBottom, figureEdges.VP1ofCenterFBottom]),
	}
}

function setFacesVisibility(figureEdges, figureFaces) {

	if (centerSeg.start.x <= VP1.x) {
		figureFaces.VP1ofCenterF.visible = false;
	}
	if (centerSeg.start.x >= VP2.x) {
		figureFaces.VP2ofCenterF.visible = false;
	}

	if(figureEdges.VP2ofCenter.start.x >= VP1.x) {
		figureFaces.VP2ofCenterB.visible = false;
	}

	if(figureEdges.VP1ofCenter.start.x <= VP2.x) {
		figureFaces.VP1ofCenterB.visible = false;
	}

	if(getCenterSegTop().y < VP1.y || getCenterSegTop().y < VP2.y) {
		figureFaces.topFace.visible = false;
	}

	if(getCenterSegBottom().y > VP1.y || getCenterSegBottom().y > VP2.y) {
		figureFaces.bottomFace.visible = false;
	}
	
}

export function getViewerData() {

	let figureEdges = getFigureEdges()
	let figureFaces = getFaces(figureEdges);

	setFacesVisibility(figureEdges, figureFaces)

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

	return viewerData;
}
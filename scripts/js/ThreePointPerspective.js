import * as Geometry from "./Geometry.js";
import getComputedVertices from "./PerspectiveGeometry.js";

var VP1, VP2;
export var centerPoint;

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
	let centerPointTop = segCenter.getRelativePoint(0, -sideLength/2);
	let centerPointBottom = segCenter.getRelativePoint(0, sideLength/2);
	centerPoint = new Geometry.LineSegment(centerPointTop, centerPointBottom);
}

function getVP1computedVertices() {
	let VP1computedVertices = getComputedVertices(centerPoint.length(), VP1, [centerPoint.start, centerPoint.end], 0.9625);

	return {
		"top" : VP1computedVertices[0],
		"bottom" : VP1computedVertices[1]
	}
}

function getVP2computedVertices() {
	let VP2computedVertices = getComputedVertices(centerPoint.length(), VP2, [centerPoint.start, centerPoint.end], 0.9625);

	return {
		"top" : VP2computedVertices[0],
		"bottom" : VP2computedVertices[1]
	}
}

function getPosteriorVertices(VP1computedVertices, VP2computedVertices) {
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

function getFaces() {

	let VP1computedVertices = getVP1computedVertices();
	let VP2computedVertices = getVP2computedVertices();
	let posteriorVertices = getPosteriorVertices(VP1computedVertices, VP2computedVertices);

	let VP1ofCenterA = new Geometry.Polygon([centerPoint.start, centerPoint.end, VP1computedVertices.bottom, VP1computedVertices.top]);
	let VP2ofCenterA = new Geometry.Polygon([centerPoint.start, centerPoint.end, VP2computedVertices.bottom, VP2computedVertices.top]);
	let VP1ofCenterP = new Geometry.Polygon([VP1computedVertices.top, VP1computedVertices.bottom, posteriorVertices.bottom, posteriorVertices.top]);
	let VP2ofCenterP = new Geometry.Polygon([VP2computedVertices.top, VP2computedVertices.bottom, posteriorVertices.bottom, posteriorVertices.top]);
	let topFace = new Geometry.Polygon([centerPoint.start, VP1computedVertices.top, posteriorVertices.top, VP2computedVertices.top]);
	let bottomFace = new Geometry.Polygon([centerPoint.end, VP1computedVertices.bottom, posteriorVertices.bottom, VP2computedVertices.bottom]);

	return {
		"VP1ofCenterA" : VP1ofCenterA,
		"VP2ofCenterA" : VP2ofCenterA,
		"VP1ofCenterP" : VP1ofCenterP,
		"VP2ofCenterP" : VP2ofCenterP,
		"topFace" : topFace,
		"bottomFace" : bottomFace
	}
}

function getFacesVisibility() {
	let faces = getFaces();

	
}

export function getViewerData() {

	let faces = getFaces();

	let viewerData = {
		"edges" : (function() {
			let allEdges = [];
			for(let face in faces) {
				for(let edge of faces[face].getEdges()) {
					allEdges.push(edge);
				}
			}
			return allEdges;
		})(),
		"xrayEdges" : null,
		"guides" : null,
		"xrayGuides" : null
	}

	// console.log(viewerData);
	return viewerData;
}
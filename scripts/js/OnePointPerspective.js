import * as Geometry from "./Geometry.js";
import getComputedVertices, {FigureEdge, FigureFace} from "./PerspectiveGeometry.js";

var VP;
export var face;

export function reset() {
	VP = globalThis.viewer.getCenter().getRelativePoint(0, -globalThis.viewer.getHeight()/6);
	let faceSide = Math.sqrt(globalThis.viewer.getArea())/10;
	let faceCenter = globalThis.viewer.getCenter().getRelativePoint(100, globalThis.viewer.getHeight()/6);
	face = new Geometry.Square(faceCenter, faceSide);
}

export function getViewerData() {

	let nonFaceEdges = [];

	let backFace = getBackFace();

	for(let backEdge of backFace.getEdges()) {
		nonFaceEdges.push(backEdge);
	}
	for(let depthEdge of getCubeDepthEdges(backFace)) {
		nonFaceEdges.push(depthEdge);
	}

	let viewerData = [];

	let faceEdges = face.getEdges();
	for(let faceEdge of faceEdges) {
		let figureEdge = new FigureEdge(faceEdge)
		figureEdge.front = true;
		viewerData.push(figureEdge);
	}

	for(let edge of nonFaceEdges) {
		edge.xray = face.contains(edge.start)||face.contains(edge.end);
		viewerData.push(edge);
	}

	return viewerData;

}

function getBackFace() {
	let backFacePoints = getComputedVertices(face.side, VP, face.points);
	return new Geometry.Polygon(backFacePoints);
}

function getCubeDepthEdges(backFace) {
	let cubeDepthEdges = [];

	for(let vIndex in face.points) {
		let edge = new Geometry.LineSegment(face.points[vIndex], backFace.points[vIndex]);
		let figureEdge = new FigureEdge(edge, VP, 1);

		cubeDepthEdges.push(figureEdge);
	}

	return cubeDepthEdges;
}
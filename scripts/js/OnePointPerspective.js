import { LineSegment, Point, Square, Polygon } from "./Geometry.js";
import { getViewer } from "./PerspectiveDrawingDemo.js";

var vp;
export var face;

export function reset() {
	vp = getViewer().getCenter().getRelativePoint(0, -getViewer().getHeight()/6);
	let faceSide = Math.sqrt(getViewer().getArea())/10;
	let faceCenter = getViewer().getCenter().getRelativePoint(100, getViewer().getHeight()/6);
	face = new Square(faceCenter, faceSide);
}

export function getViewerData() {

	let nonFaceEdges = [];

	for(let backEdge of getBackFace().getEdges()) {
		nonFaceEdges.push(backEdge);
	}
	for(let depthEdge of getCubeDepthEdges()) {
		nonFaceEdges.push(depthEdge);
	}

	let edges = face.getEdges();
	let xrayEdges = [];

	for(let edge of nonFaceEdges) {

		let xray = face.contains(edge.start)||face.contains(edge.end);

		if(xray) {
			xrayEdges.push(edge);
		} else {
			edges.push(edge);
		}
	}

	let guides = [];
	let xrayGuides = [];

	for(let guide of getGuides()) {
		if(face.contains(guide.start)||face.contains(guide.end)) {
			xrayGuides.push(guide);
		} else {
			guides.push(guide);
		}
	}

	let viewerData = {
		"edges" : edges,
		"xrayEdges" : xrayEdges,
		"guides" : guides,
		"xrayGuides" : xrayGuides 
	}

	return viewerData;

}

function backVertexRayScalar(faceVertex) {
	let sideFovRatio = 2/Math.PI * Math.atan(face.side/(Point.distance(face.center, vp)+50));
	return 1 - sideFovRatio;
}
function backVertex(faceVertex) {
	let scalar = backVertexRayScalar(face.center);
	return vp.getRelativePoint(scalar*Point.dx(vp, faceVertex), scalar*Point.dy(vp, faceVertex));
}
function getBackFace() {
	let backFacePoints = [];

	for(let faceVertex of face.points) {
		backFacePoints.push(backVertex(faceVertex));
	}

	return new Polygon(backFacePoints);
}
function getCubeDepthEdges() {
	let cubeDepthSegments = [];

	for(let vIndex in face.points) {
		cubeDepthSegments.push(new LineSegment(face.points[vIndex], getBackFace().points[vIndex]));
	}

	return cubeDepthSegments;
}
function getGuides() {
	let guideSegments = [];

	for(let vIndex in getBackFace().points) {
		guideSegments.push(new LineSegment(getBackFace().points[vIndex], vp));
	}

	return guideSegments;
}
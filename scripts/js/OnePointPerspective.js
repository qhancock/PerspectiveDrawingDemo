import { LineSegment, Point, Square, Polygon } from "./Geometry.js";
import { viewer } from "./PerspectiveDrawingDemo.js";

var vp;
var face;
var backFace;

export function reset() {
	vp = viewer.getCenter().getRelativePoint(0, -viewer.getHeight()/6);
	let faceSide = Math.sqrt(viewer.getArea())/10;
	let faceCenter = viewer.getCenter().getRelativePoint(-200, viewer.getHeight()/6);
	face = new Square(faceCenter, faceSide);
	computeBackFace();
}

export function getViewerData() {

	let nonFaceEdges = [];

	for(let depthEdge of getCubeDepthEdges()) {
		nonFaceEdges.push(depthEdge);
	}
	for(let backEdge of backFace.edges) {
		nonFaceEdges.push(backEdge);
	}

	let edges = face.edges;
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
	let sideFovRatio = 2/Math.PI * Math.atan(face.side/Point.distance(face.center, vp));
	return 1 - sideFovRatio;
}
function backVertex(faceVertex) {
	let scalar = backVertexRayScalar(face.center);
	return vp.getRelativePoint(scalar*Point.dx(vp, faceVertex), scalar*Point.dy(vp, faceVertex));
}
function computeBackFace() {
	let backFacePoints = [];

	for(let faceVertex of face.points) {
		backFacePoints.push(backVertex(faceVertex));
	}

	backFace = new Polygon(backFacePoints);
}
function getCubeDepthEdges() {
	let cubeDepthSegments = [];

	for(let vIndex in face.points) {
		cubeDepthSegments.push(new LineSegment(face.points[vIndex], backFace.points[vIndex]));
	}

	return cubeDepthSegments;
}
function getGuides() {
	let guideSegments = [];

	for(let vIndex in backFace.points) {
		guideSegments.push(new LineSegment(backFace.points[vIndex], vp));
	}

	return guideSegments;
}
import * as Geometry from "./Geometry.js";
import * as PerspectiveGeometry from "./PerspectiveGeometry.js"
import getComputedVertices from "./PerspectiveGeometry.js";

var VP1, VP2, VP3;
export var centerPoint;
var sideLength;

export function reset() {
	let viewer = globalThis.viewer;

	VP1 = viewer.getCenter().getRelativePoint(-viewer.getWidth()/3, -viewer.getHeight()/6);
	VP2 = VP1.getRelativePoint((2/3) * viewer.getWidth(), 0);
	VP3 = viewer.getCenter().getRelativePoint(0, viewer.getHeight()/3)

	sideLength = Math.sqrt(viewer.getArea())/10;
	centerPoint = viewer.getCenter();
}

export function getViewerData() {
	return []
}
import { Point } from "./Geometry.js";
import { getViewerData as onePointPerspectiveViewerData, reset as onePointReset, face as onePointFace } from "./OnePointPerspective.js";

export class Viewer {

	activePerspective;
	guides;
	xray;
	canvasElement;
	canvas;

	onePointViewerData;
	twoPointViewerData;
	threePointViewerData;

	edgeColor = 0x000000;
	xrayEdgeColor = 0x8a8a8a;
	guideColor = 0x66cdaa;
	xrayGuideColor = 0xabd1c4;

	mouseDragging;

	constructor(canvasElement) {
		this.canvasElement = canvasElement;
		this.canvas = canvasElement.getContext("2d");

		this.canvasElement.width = canvasElement.clientWidth;
		this.canvasElement.height = canvasElement.clientHeight;

		let thisViewer = this;
		this.canvasElement.addEventListener("mousedown", function() {thisViewer.mouseDragging = true});
		this.canvasElement.addEventListener("mouseup", function() {thisViewer.mouseDragging = false})
		this.canvasElement.addEventListener("mouseout", function() {thisViewer.mouseDragging = false});
		this.canvasElement.addEventListener("mousemove", function() {
			if(thisViewer.mouseDragging) {
				let dragEvent = arguments[0];
				thisViewer.moveActiveHandle(dragEvent.movementX, dragEvent.movementY);
			}
		});
	}

	clear() {
		this.canvas.clearRect(0, 0, this.getWidth(), this.getHeight());
	}

	getWidth() {
		return this.canvasElement.width;
	}

	getHeight() {
		return this.canvasElement.height;
	}
	
	getArea() {
		return (this.getHeight() * this.getWidth());
	}
	
	getCenter() {
		return new Point(this.getWidth() / 2, this.getHeight() / 2);
	}

	requestNewViewerData(perspective) {

		switch (perspective) {
			case 1: {
				this.onePointViewerData = onePointPerspectiveViewerData();
				break;
			}
			case 2: {
				// this.twoPointViewerData = twoPointPerspectiveViewerData();
				break;
			}
			case 3: {
				// this.threePointViewerData = threePointPerspectiveViewerData();
				break;
			}
		}
	}
	
	getActiveViewerData() {
		switch (this.activePerspective) {
			case 1: {
				return this.onePointViewerData;
			}
			case 2: {
				return this.twoPointViewerData;
			}
			case 3: {
				return this.threePointViewerData;
			}
		}
	}
	
	drawData(viewerData) {
		
		this.clear();
		
		for (let edge of viewerData.edges) {
			this.drawLine(edge, this.edgeColor);
		}
		if (this.guides) {
			for (let guide of viewerData.guides) {
				this.drawLine(guide, this.guideColor);
			}
		}
		if (this.xray) {
			for (let xrayEdge of viewerData.xrayEdges) {
				this.drawLine(xrayEdge, this.xrayEdgeColor);
			}
		}
		if (this.xray && this.guides) {
			for (let xrayGuide of viewerData.xrayGuides) {
				this.drawLine(xrayGuide, this.xrayGuideColor);
			}
		}
	}

	drawLine(lineSegment, color) {

		this.canvas.strokeStyle = new Number(color).toString();

		this.canvas.beginPath();
		this.canvas.moveTo(lineSegment.start.x, lineSegment.start.y);
		this.canvas.lineTo(lineSegment.end.x, lineSegment.end.y);
		this.canvas.stroke();

	}

	drawPolygon(polygon, color) {
		for (let seg of polygon.segments) {
			this.drawLine(seg, color);
		}
	}


	moveActiveHandle(dx, dy) {
		switch (this.activePerspective) {
			case 1: {
				onePointFace.translate(dx, dy);
				break;
			}
			case 2: {
				// this.twoPointFaceHandle.translate(dx, dy);
				break;
			}
			case 3: {
				// this.threePointFaceHandle.translate(dx, dy);
				break;
			}
		}
		this.requestNewViewerData(this.activePerspective);
		this.drawData(this.getActiveViewerData());
	}

	setPerspective(perspective) {

		//guard clause exits if no change
		if (perspective == this.activePerspective) {
			return;
		}
		this.activePerspective = perspective;
		this.drawData(this.getActiveViewerData());

	}

	toggleGuides(on) {

		//guard clause exits if no change
		if (on == this.guides) {
			return;
		}
		this.guides = on;

		this.drawData(this.getActiveViewerData());
	}

	toggleXray(on) {

		//guard clause exits if no change
		if (on == this.xray) {
			return;
		}
		this.xray = on;

		this.drawData(this.getActiveViewerData());
	}
}
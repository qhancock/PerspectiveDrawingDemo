import { Point } from "./Geometry.js";
import { getViewerData as onePointPerspectiveViewerData, reset as onePointReset, face as onePointHandle, face } from "./OnePointPerspective.js";
import { getViewerData as twoPointPerspectiveViewerData, reset as twoPointReset, centerSeg as twoPointHandle } from "./TwoPointPerspective.js";
import { getViewerData as threePointPerspectiveViewerData, reset as threePointReset, centerPoint as threePointHandle} from "./ThreePointPerspective.js";

export class Viewer {

	activePerspective;
	xray;
	canvasElement;
	canvas;

	getViewerData = [undefined, onePointPerspectiveViewerData, twoPointPerspectiveViewerData, threePointPerspectiveViewerData]
	resetFunctions = [undefined, onePointReset, twoPointReset, threePointReset]
	viewerData = []

	guides = [
		[false],
		[false, false],
		[false, false, false]
	]

	XRAY_COLOR = "#000000"
	GUIDE_COLORS = ["#ff8c00", "#69f5ff", "#dc6aff"];
	XRAY_GUIDE_COLORS = ["#ff8c00", "#69f5ff", "#dc6aff"];

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
		this.viewerData[perspective] = this.getViewerData[perspective]();
	}
	
	getActiveViewerData() {
		return this.viewerData[this.activePerspective]
	}

	guidesActive(perspective, vpID) {
		return this.guides[perspective-1][vpID-1]
	}
	
	drawFigureEdges(viewerData) {

		console.log(viewerData)
		this.clear();
		
		let xrayGuides = [];
		let xrayGuidedEdges = [];
		let xrayEdges = [];
		let guides = [];
		let edges = [];
		let guidedEdges = [];

		for(let figureEdge of viewerData) {

			if(figureEdge.hasGuide() && figureEdge.xray) {
				xrayGuides.push(figureEdge);
				xrayGuidedEdges.push(figureEdge)
			}
			if (figureEdge.xray) {
				xrayEdges.push(figureEdge);
			}
			if (figureEdge.hasGuide()) {
				guides.push(figureEdge);
				guidedEdges.push(figureEdge);
			}
			edges.push(figureEdge);
		}

		if (this.xray) {
			for(let figureEdge of xrayGuides) {
				if(this.guidesActive(this.activePerspective, figureEdge.vpID)) {
					this.drawXrayGuide(figureEdge);
				}
			}
			for(let figureEdge of xrayGuidedEdges) {
				if(this.guidesActive(this.activePerspective, figureEdge.vpID)) {
					this.drawXrayGuidedEdge(figureEdge);
				}
			}
			for(let figureEdge of xrayEdges) {
				if(!this.guidesActive(this.activePerspective, figureEdge.vpID)) {
					this.drawXrayEdge(figureEdge);
				}
			}
		}
		for(let figureEdge of guides) {
			if(this.guidesActive(this.activePerspective, figureEdge.vpID) && !figureEdge.xray) {
				this.drawGuide(figureEdge);
			}
		}
		for(let figureEdge of edges) {
			if((!figureEdge.hasGuide || !this.guidesActive(this.activePerspective, figureEdge.vpID)) && !figureEdge.xray && !figureEdge.front){
				this.drawEdge(figureEdge);
			}
		}
		for (let figureEdge of guidedEdges) {
			if(this.guidesActive(this.activePerspective, figureEdge.vpID) && !figureEdge.xray && !figureEdge.front) {
				this.drawGuidedEdge(figureEdge);
			}
		}
		for(let figureEdge of edges) {
			if((!figureEdge.hasGuide || !this.guidesActive(this.activePerspective, figureEdge.vpID)) && !figureEdge.xray && figureEdge.front){
				this.drawEdge(figureEdge);
			}
		}
		for (let figureEdge of guidedEdges) {
			if(this.guidesActive(this.activePerspective, figureEdge.vpID) && !figureEdge.xray && figureEdge.front) {
				this.drawGuidedEdge(figureEdge);
			}
		}
	}

	drawEdge(figureEdge) {
		this.drawSegment(figureEdge);
	}
	drawGuidedEdge(figureEdge) {
		this.drawSegment(figureEdge)
		this.drawSegment(figureEdge, this.GUIDE_COLORS[figureEdge.vpID-1], true, false);
	}
	drawXrayEdge(figureEdge) {
		this.drawSegment(figureEdge, this.XRAY_COLOR, false, true);
	}
	drawXrayGuidedEdge(figureEdge) {
		this.drawXrayEdge(figureEdge);
		this.drawSegment(figureEdge, this.XRAY_GUIDE_COLORS[figureEdge.vpID-1], true, true);
	}
	drawGuide(figureEdge) {
		this.drawXrayEdge(figureEdge.guide);
		this.drawSegment(figureEdge.guide, this.GUIDE_COLORS[figureEdge.vpID-1], true, true);
	}
	drawXrayGuide(figureEdge) {
		this.drawSegment(figureEdge.guide, this.XRAY_COLOR, false, true);
		this.drawSegment(figureEdge.guide, this.XRAY_GUIDE_COLORS[figureEdge.vpID-1], true, true);
	}

	drawSegment(lineSegment, color = "#000000", guide = false, dotted = false) {
		this.canvas.beginPath();

		this.canvas.strokeStyle = color;
		this.canvas.lineWidth = 5;
		if(guide) {
			this.canvas.lineWidth = 3;
		}
		if(dotted) {
			this.canvas.setLineDash([5, 10]);
		} else {
			this.canvas.setLineDash([]);
		}
		this.canvas.lineCap = "round";
		this.canvas.moveTo(lineSegment.start.x, lineSegment.start.y);
		this.canvas.lineTo(lineSegment.end.x, lineSegment.end.y);
		this.canvas.stroke();
		this.canvas.closePath();
	}

	moveActiveHandle(dx, dy) {
		switch (this.activePerspective) {
			case 1: {
				onePointHandle.translate(dx, dy);
				break;
			}
			case 2: {
				twoPointHandle.translate(dx, dy);
				break;
			}
			case 3: {
				threePointHandle.translate(dx, dy);
				break;
			}
		}
		this.requestNewViewerData(this.activePerspective);
		this.drawFigureEdges(this.getActiveViewerData());
	}

	setPerspective(perspective) {

		//guard clause exits if no change
		if (perspective == this.activePerspective) {
			return;
		}
		this.activePerspective = perspective;
		this.drawFigureEdges(this.getActiveViewerData());

	}

	toggleGuides(perspective, vp) {

		this.guides[perspective-1][vp] = !this.guides[perspective-1][vp]
		this.drawFigureEdges(this.getActiveViewerData());
	
	}

	toggleXray(on) {

		//guard clause exits if no change
		if (on == this.xray) {
			return;
		}
		this.xray = on;

		this.drawFigureEdges(this.getActiveViewerData());
	}

	reset(perspective = this.activePerspective) {
		this.resetFunctions[perspective]();
		this.requestNewViewerData(perspective)
		if(this.activePerspective == perspective) {
			this.drawFigureEdges(this.getActiveViewerData())
		}
	}
}

globalThis.viewer = new Viewer($("#viewer")[0]);
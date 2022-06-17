export class Viewer {

	activePerspective;
	guides;
	xray;
	canvasElement;
	canvas;

	guideColor = 0x66cdaa;
	
	constructor(canvasElement) {
		this.canvasElement = canvasElement;
		this.canvas = canvasElement.getContext("2d");
	}

	clear() {
		this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
	}

	drawLine(lineSegment, color) { 

		this.canvas.strokeStyle = new Number(color).toString();

		this.canvas.moveTo(lineSegment.start.x, lineSegment.start.y);
		this.canvas.lineTo(lineSegment.end.x, lineSegment.end.y);
		this.canvas.stroke();

	}

	drawGuide(lineSegment) {
		this.canvas.setLineDash([5]);
		this.drawLine(lineSegment, this.guideColor);
		this.canvas.setLineDash([]);
	}

	drawPolygon(polygon, color) {
		for(let seg of polygon.segments) {
			this.drawLine(seg, color);
		}
	}

	setPerspective(perspective) {
	
		//guard clause exits if no change
		if (perspective == this.activePerspective) {
			return;
		}
		this.activePerspective = perspective;
	
	}
	
	toggleGuides(on) {
	
		//guard clause exits if no change
		if(on == this.guides) {
			return;
		}
		this.guides = !this.guides;
	
	}
	
	toggleXray(on) {
	
		//guard clause exits if no change
		if(on == this.xray) {
			return;
		}
		this.xray = !this.xray;
		
	}
}
import { Viewer } from "./Viewer.js";
import {reset as onePointReset} from "./OnePointPerspective.js";
import { initOptions, perspectiveButtons, guidesToggleButtons, xrayToggleButtons } from "./Options.js";

initOptions();
onePointReset();

var viewer = getViewer();
export function getViewer() {
	if(!viewer) {
		let viewerElement = document.getElementById("viewer");
		viewer = new Viewer(viewerElement);
	}
	return viewer;
}

let initialPerspective = 1;
perspectiveButtons.select(perspectiveButtons.buttons[initialPerspective]);
viewer.requestNewViewerData(initialPerspective);
viewer.setPerspective(initialPerspective);

guidesToggleButtons.select(guidesToggleButtons.buttons[false?0:1]);
viewer.toggleGuides(false);

xrayToggleButtons.select(xrayToggleButtons.buttons[false?0:1]);
viewer.toggleXray(false);

viewer.drawData(viewer.getActiveViewerData());
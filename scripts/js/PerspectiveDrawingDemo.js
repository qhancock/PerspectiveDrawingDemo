import { initOptions } from "./Options.js";
import { Viewer } from "./Viewer.js";
import { perspectiveButtons, guidesToggleButtons, xrayToggleButtons } from "./Options.js";
import { reset as resetOnePointPerspective } from "./OnePointPerspective.js";


var canvasElement = document.getElementById("viewer");
export var viewer = new Viewer(canvasElement);

initOptions();
resetOnePointPerspective();

let initialPerspective = 1;
perspectiveButtons.select(perspectiveButtons.buttons[initialPerspective]);
viewer.requestNewViewerData(initialPerspective);
viewer.setPerspective(initialPerspective);

guidesToggleButtons.select(guidesToggleButtons.buttons[false?0:1]);
viewer.toggleGuides(false);

xrayToggleButtons.select(xrayToggleButtons.buttons[false?0:1]);
viewer.toggleXray(false);

viewer.drawData(viewer.activeViewerData);
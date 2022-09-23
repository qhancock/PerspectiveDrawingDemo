import {reset as onePointReset} from "./OnePointPerspective.js";
import {reset as twoPointReset} from "./TwoPointPerspective.js";
import {reset as threePointReset} from "./ThreePointPerspective.js";

// initializes options buttons
import "./Options.js";

// initializes viewer
import "./Viewer.js"

onePointReset();
twoPointReset();
threePointReset();

let initialPerspective = 1;
globalThis.perspectiveButtons.select(globalThis.perspectiveButtons.buttons[initialPerspective-1]);
viewer.requestNewViewerData(initialPerspective);
viewer.setPerspective(initialPerspective);

viewer.requestNewViewerData(2);
viewer.requestNewViewerData(3);

xrayToggleButtons.select(xrayToggleButtons.buttons[false?0:1]);
viewer.toggleXray(false);
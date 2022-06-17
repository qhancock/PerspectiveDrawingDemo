import { initOptions } from "./Options.js";
import { Viewer } from "./Viewer.js";

initOptions();

var canvasElement = document.getElementById("viewer");
export var viewer = new Viewer(canvasElement);
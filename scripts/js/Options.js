import { getViewer } from "./PerspectiveDrawingDemo.js";

export const numPerspectives = 3;
export var perspectiveButtons;
export var guidesToggleButtons;
export var xrayToggleButtons;

class OptionButtonSet {
	selectedButton;
	buttons;

	constructor(buttons) {
		this.buttons = buttons;

		let thisSet = this;

		for (let button of buttons) {
			if (button != null) {
				button.addEventListener("click", function () { thisSet.select(this) });
			}
		}
	}

	select(selectedButton) {
		if (this.selectedButton == selectedButton) {
			return;
		}
		if (this.selectedButton != null) {
			this.setDeselectedButtonAttributes(this.selectedButton);
		}

		this.selectedButton = selectedButton;

		this.setSelectedButtonAttributes(this.selectedButton);
	}

	setSelectedButtonAttributes(button) {
		button.style.border = "4px solid black";
		button.style.fontWeight = "500";
	}
	setDeselectedButtonAttributes(button) {
		button.style.border = "2px solid black";
		button.style.fontWeight = "300";
	}

}

//initialize perspective button array
export function initOptions() {

	//intialize perspective options
	let perspectiveButtonList = new Array(4);
	for (let persp = 1; persp <= numPerspectives; persp++) {
		perspectiveButtonList[persp] = document.getElementById(persp + "PP");
		perspectiveButtonList[persp].addEventListener('click', function () { getViewer().setPerspective(persp) });
	}
	perspectiveButtons = new OptionButtonSet(perspectiveButtonList);

	//initialize guides options
	let guidesOn = document.getElementById("guides_on");
	let guidesOff = document.getElementById("guides_off");

	guidesOn?.addEventListener("click", function () { getViewer().toggleGuides(true) });
	guidesOff?.addEventListener("click", function () { getViewer().toggleGuides(false) });

	guidesToggleButtons = new OptionButtonSet([guidesOn, guidesOff]);

	//initialize xray options
	let xrayOn = document.getElementById("xray_on") ;
	let xrayOff = document.getElementById("xray_off") ;

	xrayOn?.addEventListener("click", function() {getViewer().toggleXray(true)});
	xrayOff?.addEventListener("click", function() {getViewer().toggleXray(false)});

	xrayToggleButtons = new OptionButtonSet([xrayOn, xrayOff]);
}

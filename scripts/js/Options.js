import { viewer } from "./PerspectiveDrawingDemo.js";

export const numPerspectives = 3;
export var perspectiveButtons;
export var guidesToggleButtons;
export var xrayToggleButtons;

export class OptionButtonSet {
	selectedButton;
	buttons;

	constructor(buttons) {
		this.buttons = buttons;

		let thisSet = this;

		for (let button of buttons) {
			if (button != null) {
				button.addEventListener("click", function () { thisSet.select(this) }, false);
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
		perspectiveButtonList[persp].addEventListener('click', function () { viewer.setPerspective(persp) });
	}
	perspectiveButtons = new OptionButtonSet(perspectiveButtonList);
	perspectiveButtons.select(perspectiveButtons.buttons[1]);

	//initialize guides options
	let guidesOn = document.getElementById("guides_on") ;
	guidesOn.addEventListener("click", function () { viewer.toggleGuides(true) });
	let guidesOff = document.getElementById("guides_off") ;
	guidesOff.addEventListener("click", function () { viewer.toggleGuides(false) });
	guidesToggleButtons = new OptionButtonSet([guidesOn, guidesOff]);
	guidesToggleButtons.select(guidesOn);


	//initialize xray options
	let xrayOn = document.getElementById("xray_on") ;
	let xrayOff = document.getElementById("xray_off") ;
	xrayToggleButtons = new OptionButtonSet([xrayOn, xrayOff]);
	xrayToggleButtons.select(xrayOn);

}

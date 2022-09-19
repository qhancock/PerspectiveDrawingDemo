
function setSelectedButtonAttributes(button) {
	button.style.border = "4px solid black";
	button.style.fontWeight = "500";
}

function setDeselectedButtonAttributes(button) {
	button.style.border = "2px solid black";
	button.style.fontWeight = "300";
}

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
			setDeselectedButtonAttributes(this.selectedButton);
		}

		this.selectedButton = selectedButton;

		setSelectedButtonAttributes(this.selectedButton);
	}

}

//intialize perspective options
globalThis.perspectiveButtons = new OptionButtonSet(
	$("#perspective_buttons button").toArray()
);

globalThis.guideButtonSets = $("#guide_buttons span:not(#guide_buttons span:first-of-type)").toArray()

for (let buttonIndex in globalThis.perspectiveButtons.buttons) {

	globalThis.perspectiveButtons.buttons[buttonIndex].addEventListener(
		"click", function() {

			for (let guideSet of globalThis.guideButtonSets) {
				//hides the set if it doesn't match the perspective mode
				guideSet.hidden = !guideSet.id.startsWith(String(parseInt(buttonIndex)+1))
			}

			$("#" + (parseInt(buttonIndex)+1) + "P_guides").get(0).hidden = false
			globalThis.viewer.setPerspective(parseInt(buttonIndex)+1);
		}
	);

}

//initialize xray options

$("#xray_buttons button").on(
	"click", function() {
		globalThis.viewer.toggleXray(this.id == "on")
	}
)


//initializes guide button options

$("#guide_buttons button").on(
	"click", function() {

		let toggledBorderStyle = "4px solid black"
		let toggled = this.style.border == toggledBorderStyle

		if(toggled) {
			this.style.border = 2 + toggledBorderStyle.substring(1)
		} else {
			this.style.border = toggledBorderStyle
		}

		globalThis.viewer.toggleGuides(

			//perspective number (parent span's id's first character)
			parseInt(this.parentElement.id.charAt(0)),

			//button number
			Array.from(this.parentNode.children).indexOf(this)
		)
	}
)

globalThis.xrayToggleButtons = new OptionButtonSet(
	$("#xray_buttons button").toArray()
);

$("#reset_button").on(
	"click", function() {
		globalThis.viewer.reset()
	}
)
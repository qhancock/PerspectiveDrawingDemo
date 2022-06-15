const numPerspectives = 3;
var perspectiveButtons: OptionButtonSet;
var guidesToggleButtons: OptionButtonSet;
var xrayToggleButtons: OptionButtonSet;

class OptionButtonSet {
	selectedButton: HTMLButtonElement;
	buttons: HTMLButtonElement[];

	constructor(buttons: HTMLButtonElement[]) {
		this.buttons = buttons;

		let thisSet: OptionButtonSet = this;

		for(let button of buttons) {
			if(button!=null){
				button.addEventListener("click", function(){thisSet.select(this)}, false);
			}
		}
	}

	public select(selectedButton: HTMLButtonElement): void {
		if(this.selectedButton==selectedButton) {
			return;
		}
		if(this.selectedButton!=null){
			this.setDeselectedButtonAttributes(this.selectedButton);
		}

		this.selectedButton = selectedButton;

		this.setSelectedButtonAttributes(this.selectedButton);
	}

	private setSelectedButtonAttributes(button: HTMLButtonElement): void {
		button.style.border = "4px solid black";
		button.style.fontWeight = "500";
	}
	private setDeselectedButtonAttributes(button: HTMLButtonElement): void {
		button.style.border = "2px solid black";
		button.style.fontWeight = "300";
	}

}

initOptions();

//initialize perspective button array
function initOptions(): void {
	
	//intialize perspective options
	let perspectiveButtonList: HTMLButtonElement[] = new Array(4);
	for(let persp = 1; persp<=numPerspectives; persp++) {
		perspectiveButtonList[persp] = document.getElementById(persp + "PP") as HTMLButtonElement;
		// todo add event listener(s)
	}
	perspectiveButtons = new OptionButtonSet(perspectiveButtonList);
	perspectiveButtons.select(perspectiveButtons.buttons[1]);
	
	//initialize guides options
	let guidesOn: HTMLButtonElement = document.getElementById("guides_on") as HTMLButtonElement;
	let guidesOff: HTMLButtonElement = document.getElementById("guides_off") as HTMLButtonElement;
	guidesToggleButtons = new OptionButtonSet([guidesOn, guidesOff]);
	guidesToggleButtons.select(guidesOn);

	//initialize xray options
	let xrayOn: HTMLButtonElement = document.getElementById("xray_on") as HTMLButtonElement;
	let xrayOff: HTMLButtonElement = document.getElementById("xray_off") as HTMLButtonElement;
	xrayToggleButtons = new OptionButtonSet([xrayOn, xrayOff]);
	xrayToggleButtons.select(xrayOn);
	
}

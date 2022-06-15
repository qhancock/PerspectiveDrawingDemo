const numPerspectives = 3;
var perspectiveButtons;
var guidesToggleButtons;
var xrayToggleButtons;
class OptionButtonSet {
    selectedButton;
    buttons;
    constructor(buttons) {
        this.buttons = buttons;
        let thisSet = this;
        for (let button of buttons) {
            if (button != null) {
                button.addEventListener("click", function () { thisSet.select(this); }, false);
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
initOptions();
//initialize perspective button array
function initOptions() {
    //intialize perspective options
    let perspectiveButtonList = new Array(4);
    for (let persp = 1; persp <= numPerspectives; persp++) {
        perspectiveButtonList[persp] = document.getElementById(persp + "PP");
        // todo add event listener(s)
    }
    perspectiveButtons = new OptionButtonSet(perspectiveButtonList);
    perspectiveButtons.select(perspectiveButtons.buttons[1]);
    //initialize guides options
    let guidesOn = document.getElementById("guides_on");
    let guidesOff = document.getElementById("guides_off");
    guidesToggleButtons = new OptionButtonSet([guidesOn, guidesOff]);
    guidesToggleButtons.select(guidesOn);
    //initialize xray options
    let xrayOn = document.getElementById("xray_on");
    let xrayOff = document.getElementById("xray_off");
    xrayToggleButtons = new OptionButtonSet([xrayOn, xrayOff]);
    xrayToggleButtons.select(xrayOn);
}

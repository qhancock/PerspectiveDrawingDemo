const numPerspectives = 3;
var selectedPerspective = 1;
var perspectiveButtons = new HTMLButtonElement[numPerspectives];
initOptions();
//initialize perspective button array
function initOptions() {
    for (let persp = 1; persp <= 3; persp++) {
        perspectiveButtons[persp] = document.getElementById(persp + "PP");
        perspectiveButtons[persp].addEventListener("click", function () { setPerspective(persp); });
    }
}
function setPerspective(perspective) {
    //guard clause exits if no change
    if (perspective == selectedPerspective) {
        return;
    }
    console.log(perspective);
}
function toggleGuides(on) {
}
function toggleXRay(on) {
}

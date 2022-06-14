const numPerspectives = 3;
var selectedPerspective = 1;
var perspectiveButtons: HTMLButtonElement[] = new HTMLButtonElement[numPerspectives];
initOptions();

//initialize perspective button array
function initOptions(): void {
	
	for (let persp = 1; persp <= 3; persp++) {
		perspectiveButtons[persp] = document.getElementById(persp + "PP") as HTMLButtonElement;
		perspectiveButtons[persp].addEventListener("click", function(){setPerspective(persp)});
	}

}

function setPerspective(perspective: number): void {
	//guard clause exits if no change
	if (perspective == selectedPerspective) {
		return;
	}

	console.log(perspective);

}
function toggleGuides(on: boolean): void {

}
function toggleXRay(on: boolean): void {

}
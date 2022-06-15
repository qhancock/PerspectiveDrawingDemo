var activePerspective: number;
var guides: boolean;
var xray: boolean;

function setPerspective(perspective: number): void {

	//guard clause exits if no change
	if (perspective == activePerspective) {
		return;
	}
	activePerspective = perspective;

}
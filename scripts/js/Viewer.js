var activePerspective;
var guides;
var xray;
function setPerspective(perspective) {
    //guard clause exits if no change
    if (perspective == activePerspective) {
        return;
    }
    activePerspective = perspective;
}

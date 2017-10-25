
//Create the default carousel
let d = new Carousel({
container: document.getElementsByClassName("carousel")[0],
numPics: 3})
d.init();

//create a non-default carousel
let e = new Carousel({
  container: document.getElementsByClassName("carousel")[1],
  numPics: 3,
  initPicIndex: 2});
e.addPaginationInteractions("click", "anim-select-top", "anim-deselect-top");
e.addLeftButtonInteraction("click", "anim-select-right", "anim-deselect-left");
e.addRightButtonInteraction();
e.addCustomInteraction({
  DOMHook: document.getElementsByClassName("magicButton")[0],
  eventType: "click",
  entranceAnim: "anim-select-right",
  exitAnim: "anim-deselect-right",
  newPicIdFn: goRandom
});
//init carousel functions
//// init carousel
function goRandom(currPicId, numPics) {return Math.floor(Math.random()*numPics)}

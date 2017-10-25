
//Create the default carousel
let d = new Carousel(document.getElementsByClassName("carousel")[0], 3)
// let d = new Carousel({
//   amountOfPics: 3,
//   startOnPic: 0
// })
d.init();

//create a non-default carousel
let e = new Carousel(document.getElementsByClassName("carousel")[1], 3, 2);
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

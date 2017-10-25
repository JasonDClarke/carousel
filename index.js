
//Create the default carousel
let d = new Carousel(3, 0)
d.init();

//create a non-default carousel
let e = new Carousel(3,1, [], {
  paginationButton: 'paginationButton2',
  leftButton: 'leftButton2',
  rightButton: 'rightButton2',
  selected: 'selected2',
  carouselImage: 'carouselImage2'
});
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
e.addInteractionListeners();
//init carousel functions
//// init carousel
function goRandom(currPicId, numPics) {return Math.floor(Math.random()*numPics)}


let carouselInteractionConfig = {
  DOMHook: null,
  eventType: null,
  entranceAnim: null,
  exitAnim: null,
  newPicIdFn: null
}

//// init carousel
function Carousel(numPics, initPicId, carouselInteractions) {
  this.numPics = numPics;
  this.DOMPics = getDOMPics(numPics);
  this.currPicId = initPicId;
  this.carouselInteractions = addInteractions(carouselInteractions);
}



let c = new Carousel(3, 0, [new LeftButtonInteraction, new RightButtonInteraction,
new PaginationInteraction(0), new PaginationInteraction(1), new PaginationInteraction(2)]);


//init carousel functions
function getDOMPics(numPics) {
  let DOMPics =[];
  for (var i=0; i<numPics; i++) {
    DOMPics[i] = document.getElementsByClassName('carouselImage')[i];
  }
  return DOMPics;
}

function addInteractions(carouselInteractions) {
  return carouselInteractions.map((item)=>CarouselInteraction(item));
}
/////


///constructing interactions
////
function CarouselInteraction(carouselInteractionConfig) {
  let x = carouselInteractionConfig;
  return x.DOMHook.addEventListener(
    x.eventType,
    slideTransition.bind(this, x.entranceAnim,x.exitAnim, x.newPicIdFn));
}

function slideTransition(entranceAnim, exitAnim, newPicIdFn) {
  if (newPicIdFn(c.currPicId, c.numPics) === c.currPicId) {
    console.log("returned as already right image");
    return;
  }

  let prevPicId = c.currPicId;
  let newPicId = newPicIdFn(c.currPicId, c.numPics);
  moveCssClass(c.DOMPics[prevPicId], c.DOMPics[newPicId], "selected");
  runAnimationClass(c.DOMPics[newPicId], entranceAnim);
  runAnimationClass(c.DOMPics[prevPicId], exitAnim);

  c.currPicId = newPicId;
}

function runAnimationClass(htmlEl, animClass) {
  htmlEl.classList.add(animClass);
  htmlEl.addEventListener("animationend", function i() {
    htmlEl.classList.remove(animClass);
    htmlEl.removeEventListener("animationend", i);
  })
}

function moveCssClass(a, b, cssClass) {
  a.classList.remove(cssClass);
  b.classList.add(cssClass);
}

/// newPicIdFns
function goRight(a, numPics) {return (a-1+numPics)%numPics};
function goLeft(a, numPics) {return (a+1)%numPics};

function LeftButtonInteraction() {
  this.DOMHook = document.getElementsByClassName('leftButton')[0],
  this.eventType = "click",
  this.entranceAnim = "anim-select-top",
  this.exitAnim = "anim-deselect-left",
  this.newPicIdFn = goLeft
}

function RightButtonInteraction() {
  this.DOMHook = document.getElementsByClassName('rightButton')[0],
  this.eventType = "click",
  this.entranceAnim = "anim-select-bottom",
  this.exitAnim = "anim-deselect-right",
  this.newPicIdFn = goRight
}

function PaginationInteraction(i) {
  this.DOMHook = document.getElementsByClassName('idButton')[i],
  this.eventType = "click",
  this.entranceAnim = "anim-select-top",
  this.exitAnim = "anim-deselect-right",
  this.newPicIdFn = ()=>i
}

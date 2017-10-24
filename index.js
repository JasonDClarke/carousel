
//Create the default carousel
let c = new Carousel(3)
c.init();

//init carousel functions
//// init carousel
function Carousel(numPics, initPicId, carouselInteractions) {
  this.numPics = numPics;
  this.DOMPics = getDOMPics(numPics);
  this.currPicId = initPicId || 0;
  this.carouselInteractionConfigs = carouselInteractions || [];
  this.addInteractionListeners = function(carouselInteractions){
      this.carouselInteractionConfigs.forEach(function(item) {
      CarouselInteraction(item)
    });
  };

  this.addPaginationInteractions = function(eventType, entranceAnim, exitAnim) {
    for (let i=0; i<numPics; i++) {
      let interactionConfig = {
        DOMHook: document.getElementsByClassName('paginationButton')[i],
        eventType: eventType || "click",
        entranceAnim: entranceAnim || "anim-select-right",
        exitAnim: exitAnim || "anim-deselect-right",
        newPicIdFn: ()=>i
      }
      this.carouselInteractionConfigs.push(interactionConfig);
    }
  }

  this.addLeftButtonInteraction = function(eventType, entranceAnim, exitAnim, newPicIdFn) {
    let interactionConfig = {
      DOMHook: document.getElementsByClassName('leftButton')[0],
      eventType: eventType || "click",
      entranceAnim: entranceAnim || "anim-select-left",
      exitAnim: exitAnim || "anim-deselect-left",
      newPicIdFn: newPicIdFn || goLeft
    }
    this.carouselInteractionConfigs.push(interactionConfig);
  }

  this.addRightButtonInteraction = function(eventType, entranceAnim, exitAnim, newPicIdFn) {
    let interactionConfig = {
      DOMHook: document.getElementsByClassName('rightButton')[0],
      eventType: eventType || "click",
      entranceAnim: entranceAnim || "anim-select-right",
      exitAnim: exitAnim || "anim-deselect-right",
      newPicIdFn: newPicIdFn || goRight
    }
    this.carouselInteractionConfigs.push(interactionConfig);
  }

  this.addCustomInteraction = function(carouselInteractionConfig) {
    this.carouselInteractionConfigs.push(carouselInteractionConfig);
  }

  this.init = function() {
    this.addPaginationInteractions()
    this.addLeftButtonInteraction()
    this.addRightButtonInteraction()
    this.addInteractionListeners()
  }
}

function getDOMPics(numPics) {
  let DOMPics =[];
  for (var i=0; i<numPics; i++) {
    DOMPics[i] = document.getElementsByClassName('carouselImage')[i];
  }
  return DOMPics;
}


///constructing interactions
////
function CarouselInteraction(carouselInteractionConfig) {
  let x = carouselInteractionConfig;
  return x.DOMHook.addEventListener(
    x.eventType,
    slideTransition.bind(this, x.entranceAnim,x.exitAnim, x.newPicIdFn));
}

function slideTransition(entranceAnim, exitAnim, newPicIdFn) {
  let newPicId = newPicIdFn(c.currPicId, c.numPics);
  if (newPicId === c.currPicId) {
    console.log("returned as already right image");
    return;
  }

  let prevPicId = c.currPicId;
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
function goRight(currPicId, numPics) {return (currPicId-1+numPics)%numPics};
function goLeft(currPicId, numPics) {return (currPicId+1)%numPics};
function goRandom(currPicId, numPics) {return Math.floor(Math.random()*numPics)}

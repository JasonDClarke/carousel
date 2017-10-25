(function() {
Carousel = function Carousel(numPics, initPicId, carouselInteractions, customHooks) {
  const c = this;
  c.numPics = numPics;
  c.currPicId = initPicId || 0;
  c.carouselInteractionConfigs = carouselInteractions || [];
  c.hooks = customHooks || {
    paginationButton: 'paginationButton',
    leftButton: 'leftButton',
    rightButton: 'rightButton',
    selected: 'selected',
    carouselImage: 'carouselImage'
  };
  c.DOMPics = getDOMPics(numPics);

  c.init = function() {
    c.addPaginationInteractions()
    c.addLeftButtonInteraction()
    c.addRightButtonInteraction()
    c.addInteractionListeners()
  }

  c.addInteractionListeners = function(carouselInteractions){
      c.carouselInteractionConfigs.forEach(function(item) {
      addInteractionListener(item)
    });
  };

  c.addPaginationInteractions = function(eventType, entranceAnim, exitAnim) {
    for (let i=0; i<numPics; i++) {
      let interactionConfig = {
        DOMHook: document.getElementsByClassName(c.hooks.paginationButton)[i],
        eventType: eventType || "click",
        entranceAnim: entranceAnim || "anim-select-right",
        exitAnim: exitAnim || "anim-deselect-right",
        newPicIdFn: ()=>i
      }
      c.carouselInteractionConfigs.push(interactionConfig);
    }
  }

  c.addLeftButtonInteraction = function(eventType, entranceAnim, exitAnim, newPicIdFn) {
    let interactionConfig = {
      DOMHook: document.getElementsByClassName(c.hooks.leftButton)[0],
      eventType: eventType || "click",
      entranceAnim: entranceAnim || "anim-select-left",
      exitAnim: exitAnim || "anim-deselect-left",
      newPicIdFn: newPicIdFn || goLeft
    }
    c.carouselInteractionConfigs.push(interactionConfig);
  }

  c.addRightButtonInteraction = function(eventType, entranceAnim, exitAnim, newPicIdFn) {
    let interactionConfig = {
      DOMHook: document.getElementsByClassName(c.hooks.rightButton)[0],
      eventType: eventType || "click",
      entranceAnim: entranceAnim || "anim-select-right",
      exitAnim: exitAnim || "anim-deselect-right",
      newPicIdFn: newPicIdFn || goRight
    }
    c.carouselInteractionConfigs.push(interactionConfig);
  }

  c.addCustomInteraction = function(carouselInteractionConfig) {
    c.carouselInteractionConfigs.push(carouselInteractionConfig);
  }


  function getDOMPics(numPics) {
    let DOMPics =[];
    for (var i=0; i<numPics; i++) {
      DOMPics[i] = document.getElementsByClassName(c.hooks.carouselImage)[i];
    }
    return DOMPics;
  }

///constructing interactions
////
function addInteractionListener(carouselInteractionConfig) {
  let x = carouselInteractionConfig;
  return x.DOMHook.addEventListener(
    x.eventType,
    slideTransition.bind(c, x.entranceAnim,x.exitAnim, x.newPicIdFn));
}

function slideTransition(entranceAnim, exitAnim, newPicIdFn) {
  let newPicId = newPicIdFn(c.currPicId, c.numPics);
  if (newPicId === c.currPicId) {
    console.log("returned as already right image");
    return;
  }

  let prevPicId = c.currPicId;
  moveCssClass(c.DOMPics[prevPicId], c.DOMPics[newPicId], c.hooks.selected);
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

}

return Carousel
})();

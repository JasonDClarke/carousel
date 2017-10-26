;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.Carousel = factory()
}(this, function() { 'use strict';

  return function(customConfig) {

  let defaultConfig = {
    //required
    containerSel: null,
    //
    initPicIndex: 0,
    swipableInit: true,
    paginationInit: true,
    buttonInit: true,
    pagination: {
      className: 'paginationButton',
      eventType: "click",
      entranceAnim: "anim-select-right",
      exitAnim: "anim-deselect-right"
      // newPicIdFn: '()=>i'
    },
    leftButton: {
      className: 'leftButton',
      eventType: "click",
      entranceAnim: "anim-select-left",
      exitAnim: "anim-deselect-left",
      newPicIdFn: 'goLeft'
    },
    rightButton: {
      className: 'rightButton',
      eventType: "click",
      entranceAnim: "anim-select-right",
      exitAnim: "anim-deselect-right",
      newPicIdFn: 'goRight'
    },
    swipeLeft: {
        className: "carouselContainer",
        eventType: "swipeRight",
        entranceAnim: "anim-select-left",
        exitAnim: "anim-deselect-left",
        newPicIdFn: 'goLeft'
    },
    swipeRight: {
        className: "carouselContainer",
        eventType: "swipeLeft",
        entranceAnim: "anim-select-right",
        exitAnim: "anim-deselect-right",
        newPicIdFn: 'goRight'
    }
  }

  let config=defaultConfig;
  if (customConfig) {
  merge(config, customConfig);
  }

  //Properties

  const container = document.querySelector(config.containerSel);
  const numPics = container.getElementsByClassName(config.pagination.className).length;
  const DOMPics = getDOMPics(numPics, container);

  //STATE
  let picIndexState = config.initPicIndex;

  init();

  function init() {
    assignClassToSelectedImage(config.initPicIndex)
    if (config.paginationInit) {
    addPaginationListeners(config.pagination)
    }
    if (config.buttonInit) {
    addListener(config.leftButton)
    addListener(config.rightButton)
    }
    if (config.swipableInit) {
    addSwipeListener(config.swipeLeft)
    addSwipeListener(config.swipeRight)
    }
    if (config.customListeners) {
    addCustomListeners(config.customListeners)
    }
  }

  function assignClassToSelectedImage(initPicIndex) {
    container.getElementsByClassName('carouselImage')[initPicIndex].classList.add("selected");
  }

  function addPaginationListeners(paginationConfig) {
    let x = paginationConfig;
    let el;
    let newPicIdFn;
    for (let i=0; i<numPics; i++) {
      el = container.getElementsByClassName(config.pagination.className)[i];
      newPicIdFn = ()=>i;
      el.addEventListener(
        x.eventType,
        slideTransition.bind(null, x.entranceAnim, x.exitAnim, newPicIdFn));
    }
  }

  function addCustomListeners(customListenersConfig) {
    customListenersConfig.forEach(function(customListenerConfig) {
      if (customListenerConfig.eventType.includes("swipe")) {
      addSwipeListener(customListenerConfig)
      } else {
      addListener(customListenerConfig)
      }
    });
  }

  function getDOMPics(numPics, container) {
    let DOMPics =[];
    for (var i=0; i<numPics; i++) {
      DOMPics[i] = container.getElementsByClassName('carouselImage')[i];
    }
    return DOMPics;
  }

  ///constructing listeners
  function addListener(carouselListenerConfig) {
    let x = carouselListenerConfig;
    let el = container.getElementsByClassName(x.className)[0];
    let newPicIdFn = getIndexFunction(x.newPicIdFn)
    let callback = slideTransition.bind(null, x.entranceAnim,x.exitAnim, newPicIdFn)
    return el.addEventListener(x.eventType, callback);
  }

  function addSwipeListener(carouselListenerConfig) {
    let x = carouselListenerConfig;
    let el = container.getElementsByClassName(x.className)[0];
    let newPicIdFn = getIndexFunction(x.newPicIdFn);
    let callback = slideTransition.bind(null, x.entranceAnim,x.exitAnim, newPicIdFn)
    return addSwipe(x.eventType, el, callback);
  }

  function slideTransition(entranceAnim, exitAnim, newPicIdFn) {
    let newPicId = newPicIdFn(picIndexState, numPics);
    if (newPicId === picIndexState) {
      console.log("returned as already right image");
      return;
    }

    let prevPicId = picIndexState;
    moveCssClass(DOMPics[prevPicId], DOMPics[newPicId], 'selected');
    runAnimationClass(DOMPics[newPicId], entranceAnim);
    runAnimationClass(DOMPics[prevPicId], exitAnim);

    picIndexState = newPicId;
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

  function merge(defaultConfig, customConfig) {
    if (!customConfig.containerSel) {
      console.log("you must include a containerSel key")
    }
    config.containerSel = customConfig.containerSel;
    config.initPicIndex= customConfig.initPicIndex || defaultConfig.initPicIndex;
    config.swipableInit= customConfig.swipableInit !== false;
    config.paginationInit= customConfig.paginationInit !== false;
    config.buttonInit= customConfig.buttonInit !== false;
    if (customConfig.pagination) {
    Object.assign(config.pagination, customConfig.pagination)
    }
    if (customConfig.leftButton) {
    Object.assign(config.leftButton, customConfig.leftButton)
    }
    if (customConfig.rightButton) {
    Object.assign(config.rightButton, customConfig.rightButton)
    }
    if (customConfig.customListeners) {
      config.customListeners = customConfig.customListeners
    }
  }
  /// newPicIdFns
  function getIndexFunction(string) {
    let indexFunctions =  {
      goLeft: (currPicId, numPics)=>(currPicId-1+numPics)%numPics,
      goRight: (currPicId, numPics)=>(currPicId+1)%numPics,
      goRandom: (currPicId, numPics)=>Math.floor(Math.random()*numPics)
    }
    return indexFunctions[string];
  }

  function addSwipe(swipeType, htmlEl, callback) {
    let touch = {
      startX : 0,
      startY : 0,
      endX : 0,
      endY : 0
    }

    htmlEl.addEventListener('touchstart', function(event) {
        touch.startX = event.changedTouches[0].screenX;
        touch.startY = event.changedTouches[0].screenY;
    }, false);

    htmlEl.addEventListener('touchend', function(event) {
      touch.endX = event.changedTouches[0].screenX;
      touch.endY = event.changedTouches[0].screenY;
      if (isSwipeType(swipeType, touch)) {
        callback();
      }
    }, false);
  }

  function isSwipeType(swipeType, touch) {
    let swipeTypeChecks = {
      swipeLeft: (touch)=>touch.endX<touch.startX,
      swipeRight: (touch)=>touch.endX>touch.startX,
      swipeUp: (touch)=>touch.endY<touch.startY,
      swipeDown: (touch)=>touch.endY>touch.startY
    }

    return swipeTypeChecks[swipeType](touch);
  }

  }

}))

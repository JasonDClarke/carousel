;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.Carousel = factory()
}(this, function() { 'use strict';

  return function(requiredConfig, customConfig) {

  let defaultConfig = {
    initPicIndex: 0,
    pagination: {
      className: 'paginationButton',
      eventType: "click",
      entranceAnim: "anim-select-right",
      exitAnim: "anim-deselect-right",
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
    }
  }

  let config=defaultConfig;
  if (customConfig) {
  merge(config, customConfig);
  }

  //STATE
  let picIndexState = config.initPicIndex;

  
  const DOMPics = getDOMPics(requiredConfig.numPics);

  init();

  function init() {
    assignClassToSelectedImage(config.initPicIndex)
    addPaginationListeners(config.pagination)
    addListener(config.leftButton)
    addListener(config.rightButton)
    if (config.customListeners) {
    addCustomListeners(config.customListeners)
    }
  }

  function assignClassToSelectedImage(initPicIndex) {
    requiredConfig.container.getElementsByClassName('carouselImage')[initPicIndex].classList.add("selected");
  }
  function addPaginationListeners(paginationConfig) {
    let x = paginationConfig;
    let el;
    let newPicIdFn;
    for (let i=0; i<requiredConfig.numPics; i++) {
      el = requiredConfig.container.getElementsByClassName(config.pagination.className)[i];
      newPicIdFn = ()=>i;
      el.addEventListener(
        x.eventType,
        slideTransition.bind(null, x.entranceAnim, x.exitAnim, newPicIdFn));
    }
  }

  function addCustomListeners(customListenersConfig) {
    customListenersConfig.forEach(function(customListenerConfig) {
      addListener(customListenerConfig)
    });
  }

  function getDOMPics(numPics) {
    let DOMPics =[];
    for (var i=0; i<numPics; i++) {
      DOMPics[i] = requiredConfig.container.getElementsByClassName('carouselImage')[i];
    }
    return DOMPics;
  }

  ///constructing listeners
  function addListener(carouselListenerConfig) {
    let x = carouselListenerConfig;
    let el = requiredConfig.container.getElementsByClassName(x.className)[0];
    let newPicIdFn = getIndexFunction(x.newPicIdFn)
    return el.addEventListener(
      x.eventType,
      slideTransition.bind(null, x.entranceAnim,x.exitAnim, newPicIdFn));
  }

  function slideTransition(entranceAnim, exitAnim, newPicIdFn) {
    let newPicId = newPicIdFn(picIndexState, requiredConfig.numPics);
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
    config.initPicIndex= customConfig.initPicIndex || defaultConfig.initPicIndex;
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
    if (string === "goLeft") {
      return goLeft;
    } else if (string === "goRight") {
      return goRight;
    } else if (string === "goRandom") {
      return goRandom;
    } else {
      console.log("error");
    }
  }

  function goRight(currPicId, numPics) {return (currPicId-1+numPics)%numPics};
  function goLeft(currPicId, numPics) {return (currPicId+1)%numPics};
  function goRandom(currPicId, numPics) {return Math.floor(Math.random()*numPics)}
  }

}))

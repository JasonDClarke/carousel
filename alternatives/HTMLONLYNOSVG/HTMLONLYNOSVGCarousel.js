;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.Carousel = factory()
}(this, function() { 'use strict';

  let defaultConfig = {
    //required
    containerSel: null, //selector of containing element in html, must be unique
    noMoveAnim: 'anim-noMove-wiggle',   //animation if current slide is selected again. css class
    init: {
      picIndex: 0, //the index of first image shown. 0-indexed
      pagination: true,//are touch listeners initialised?
      swipable: true,//are pagination listeners initialised? Also the html not included by render if false
      button: true,//are left/right buttons initialised? Also the html not included by render if false
    },
    pagination: {
      className: 'paginationButton', //class name of pagination buttons in HTML
      eventType: "click", //event occurs on [click] of pagination button
      entranceAnim: "anim-select-top", //animation of entering image. css class.
      exitAnim: "anim-deselect-bottom" //animation of exiting image. css class.
    },
    leftButton: { //describes event when clicking the left button
      className: 'leftButton',
      eventType: "click",
      entranceAnim: "anim-select-left",
      exitAnim: "anim-deselect-right",
      newPicIndexFn: 'goLeft' //function deciding what the index of the next image is
    },
    rightButton: {
      className: 'rightButton',
      eventType: "click",
      entranceAnim: "anim-select-right",
      exitAnim: "anim-deselect-left",
      newPicIndexFn: 'goRight'
    },
    swipeLeft: { //describes event when swiping the image left (ie touch)
        className: "carouselContainer",
        eventType: "swipeRight",
        entranceAnim: "anim-select-left",
        exitAnim: "anim-deselect-right",
        newPicIndexFn: 'goLeft'
    },
    swipeRight: {
        className: "carouselContainer",
        eventType: "swipeLeft",
        entranceAnim: "anim-select-right",
        exitAnim: "anim-deselect-left",
        newPicIndexFn: 'goRight'
    },
    customListeners: [] //takes an array of objects similar to eg the config.leftButton object
  }

  function start(customConfig) {

    let config=JSON.parse(JSON.stringify(defaultConfig)); //a copy made so original defaultconfig can be used for testing
    merge(config, customConfig);
    Object.freeze(config);

    let container = document.querySelector(config.containerSel);
    //STATE
    let picIndexState = config.init.picIndex;
    //
    //props
    const numPics = getNumPics(config, container)
    const DOMPics = getDOMPics(numPics, container)
    //
    init();

    function init() {
      assignClassToSelectedImage(config.init.picIndex, container)
      if (config.init.pagination) {
      addPaginationListeners(config.pagination)
      }
      if (config.init.button) {
      addListener(config.leftButton)
      addListener(config.rightButton)
      }
      if (config.init.swipable) {
      addListener(config.swipeLeft)
      addListener(config.swipeRight)
      }
      if (config.customListeners) {
      addCustomListeners(config.customListeners)
      }
    }

    function addPaginationListeners(paginationConfig) {
      let x = paginationConfig;
      let el;
      let newPicIndexFn;
      for (let i=0; i<numPics; i++) {
        el = container.getElementsByClassName(x.className)[i];
        newPicIndexFn = ()=>i;
        el.addEventListener(
          x.eventType,
          slideTransition.bind(null, x.entranceAnim, x.exitAnim, newPicIndexFn));
      }
    }

    function addCustomListeners(customListenersConfig) {
      customListenersConfig.forEach(function(customListenerConfig) {
        addListener(customListenerConfig)
      });
    }

    ///constructing listeners
    function addListener(carouselListenerConfig) {
      let x = carouselListenerConfig;
      let el = container.getElementsByClassName(x.className)[0];
      let newPicIndexFn = getIndexFunction(x.newPicIndexFn)
      let callback = slideTransition.bind(null, x.entranceAnim,x.exitAnim, newPicIndexFn)

      if (carouselListenerConfig.eventType.includes("swipe")) {
      return addSwipeListener(x.eventType, el, callback);
      } else {
      return el.addEventListener(x.eventType, callback);
      }
    }

    function slideTransition(entranceAnim, exitAnim, newPicIndexFn) {
      let newPicIndex = newPicIndexFn(picIndexState, numPics);
      if (newPicIndex === picIndexState) {
        runNoMoveAnim()
        return;
      }

      let prevPicIndex = picIndexState;
      moveCssClass(DOMPics[prevPicIndex], DOMPics[newPicIndex], 'selected');
      runAnimationClass(DOMPics[newPicIndex], entranceAnim);
      runAnimationClass(DOMPics[prevPicIndex], exitAnim);

      picIndexState = newPicIndex;
    }

    function runNoMoveAnim() {
    runAnimationClass(DOMPics[picIndexState], config.noMoveAnim);
    }
  }

  function merge(defaultObject, customObject) {
    //add custom keys
    for (var key in customObject) {
      if (!defaultObject.hasOwnProperty(key)) {
        defaultObject[key] = customObject[key]
      }
    }
    //overwrite keys
    for (var key in defaultObject) {
      if (defaultObject[key] !== Object(defaultObject[key]) &&
    customObject.hasOwnProperty(key)) {
        defaultObject[key] = customObject[key]
      }
      //look in next layer
      //checks if key has a nested object (dubious about the trustworthiness of this)
      else if (defaultObject[key] === Object(defaultObject[key])
    && customObject[key]) {
        merge(defaultObject[key], customObject[key])
      }
    }
  }

  function addSwipeListener(swipeType, htmlEl, callback) {
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

  function getIndexFunction(string) {
    let indexFunctions =  {
      goLeft: (currPicId, numPics)=>(currPicId-1+numPics)%numPics,
      goRight: (currPicId, numPics)=>(currPicId+1)%numPics,
      goRandom: (currPicId, numPics)=>Math.floor(Math.random()*numPics)
    }
    return indexFunctions[string];
  }

  function getNumPics(config, container) {
      return container.getElementsByClassName("carouselImage").length;
  }

  function getDOMPics(numPics, container) {
    let DOMPics =[];
    for (var i=0; i<numPics; i++) {
      DOMPics[i] = container.getElementsByClassName('carouselImage')[i];
    }
    return DOMPics;
  }

  function assignClassToSelectedImage(initPicIndex, container) {
    if (container.getElementsByClassName('carouselImage')[initPicIndex]) {
    container.getElementsByClassName('carouselImage')[initPicIndex].classList.add("selected");
    } else {
      console.error("Initial picture index does not exist!");
    }
  }

  return {
    start: start
    //testing
    ,
    __merge: merge,
    __addSwipeListener: addSwipeListener,
    __moveCssClass: moveCssClass,
    __defaultConfig: JSON.parse(JSON.stringify(defaultConfig))
    //
  }

}))

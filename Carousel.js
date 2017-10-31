// Business rules:


;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.Carousel = factory()
}(this, function() { 'use strict';

  return function(customConfig) {

  let defaultConfig = {
    //required
    containerSel: null,

    //optional
    renderFromJSHTMLTemplate: false, // if false, need to build own HTML template in the document.*1
    images: null,

    //SVG Frame
    SVGInit: false,
    thickness: 2,
    frame: 'square',


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
  let container = document.querySelector(config.containerSel);

  if (config.renderFromJSHTMLTemplate) {
    let carousel = buildCarousel(config.images, config.containerSel.slice(1))
    container.innerHTML = carousel
  }


  const numPics = container.getElementsByClassName("carouselImage").length;
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
    addListener(config.swipeLeft)
    addListener(config.swipeRight)
    }
    if (config.customListeners) {
    addCustomListeners(config.customListeners)
    }
    if (config.SVGInit) {
    SVGFrame(config.thickness, config.frame)
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
      addListener(customListenerConfig)
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

    if (carouselListenerConfig.eventType.includes("swipe")) {
    return addSwipeListener(x.eventType, el, callback);
    } else {
    return el.addEventListener(x.eventType, callback);
    }
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

  function merge(defaultObject, customObject) {
    //add custom keys
    for (var key in customObject) {
      if (!defaultObject.hasOwnProperty(key)) {
        defaultObject[key] = customObject[key]
      } else {
        console.log(customObject[key])
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
  /// newPicIdFns
  function getIndexFunction(string) {
    let indexFunctions =  {
      goLeft: (currPicId, numPics)=>(currPicId-1+numPics)%numPics,
      goRight: (currPicId, numPics)=>(currPicId+1)%numPics,
      goRandom: (currPicId, numPics)=>Math.floor(Math.random()*numPics)
    }
    return indexFunctions[string];
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

  function SVGFrame(thickness, type) {

    let path = container.querySelector("#path");
    let height = 60;
    let width = 60;
    let w = width,
        h = height,
        t = thickness;

    let outsideLine = `M0 0 V${height} H${width} V0 L0 0`

    let frames = {square: `M${t} ${t}
    H${w-t}
    V${h-t}
    H${t}
    L${t} ${t}`,
    elliptical: `M${w/2} ${t}
    A${w/2-t} ${h/2-t} 0, 0, 1,  ${w-t} ${h/2}
    A${w/2-t} ${h/2-t} 0, 0, 1,  ${w/2} ${h-t}
    A${w/2-t} ${h/2-t} 0, 0, 1,  ${t} ${h/2}
    A${w/2-t} ${h/2-t} 0, 0, 1,  ${w/2} ${t}`,
    chevron: `M${t} ${t}
    L${w/2} ${2*t}
    L${w-t} ${t}
    L${w-2*t} ${h/2}
    L${w-t} ${h-t}
    L${w/2} ${h-2*t}
    L${t} ${h-t}
    L${2*t} ${h/2}
    L${t} ${t}`,
    curly: `M${t} ${t}
    C${3*t} ${3*t}, ${w-3*t} ${3*t}, ${w-t} ${t}
    C${w-3*t} ${3*t}, ${w-3*t} ${h-3*t} ${w-t} ${h-t}
    C${w-3*t} ${h-3*t}, ${3*t} ${h-3*t} ${t} ${h-t}
    C${3*t} ${h-3*t}, ${3*t} ${3*t}, ${t} ${t}`,
    wavy: `M${3*t} ${3*t}
    Q${5*t} ${t} ${w/2-t} ${3*t}
    Q${w/2} ${3.1*t} ${w/2+t} ${3*t}
    Q${w-5*t} ${t} ${w-3*t} ${3*t}

    Q${w-t} ${5*t} ${w-3*t} ${h/2-t}
    Q${w-3.1*t} ${h/2} ${w-3*t} ${h/2+t}
    Q${w-t} ${h-5*t} ${w-3*t} ${h-3*t}

    Q${w-5*t} ${h-t} ${w/2+t} ${h-3*t}
    Q${w/2} ${h-3.1*t} ${w/2-t} ${h-3*t}
    Q${5*t} ${h-t} ${3*t} ${h-3*t}

    Q${t} ${h-5*t} ${3*t} ${h/2+t}
    Q${3.1*t} ${h/2} ${3*t} ${h/2-t}
    Q${t} ${5*t} ${3*t} ${3*t}
    `
    }

    path.setAttribute('d', `
    ${outsideLine}
    ${frames[type]}
    `);
  };

  function buildCarousel(images, id) {
    const noSlides = images.length
    let imageHTML = ``;
    for (let i=0; i<noSlides; i++) {
      imageHTML+=`<img class="carouselImage" src="${images[i]}"/>`
    }

    let paginationHTML = ``;
    if (config.paginationInit) {
      for (let i=1; i<= noSlides; i++) {
        paginationHTML+= `<button class="paginationButton">${i}</button>`
      }
    }

    let leftButton = ``;
    let rightButton= ``;

    if (config.buttonInit) {
      leftButton = `<button class="leftButton"> &lt; </button>`;
      rightButton = `<button class="rightButton"> &gt; </button>`
    }

    let carousel = `
      <div class="carouselContainer">
        ${imageHTML}
      </div>
      <div class="buttons">
        ${leftButton}
        ${paginationHTML}
        ${rightButton}
      </div>
    `;
    return carousel;
  }

  }



}))



//*1

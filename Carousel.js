;(function (global = window, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.Carousel = factory()
}(this, function() { 'use strict';

  let defaultConfig = {
    //required
    containerSel: null, //selector of containing element in html, must be unique

    //optional below:
    renderFromJSHTMLTemplate: false, // if false, need to build own HTML template in the document.*1
    images: null, //include image srces in array. Only required when JS template used,
    //when renderFromJSHTMLTemplate false, image srces collected from html

    noMoveAnim: 'anim-noMove-wiggle',   //animation if current slide is selected again. css class
    init: {
      picIndex: 0, //the index of first image shown. 0-indexed
      pagination: true,//are touch listeners initialised?
      swipable: true,//are pagination listeners initialised? Also the html not included by render if false
      button: true,//are left/right buttons initialised? Also the html not included by render if false
      SVGFrame: false//no frame if false. Also the not included by render if false
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
        eventType: "swipeLeft",
        entranceAnim: "anim-select-right",
        exitAnim: "anim-deselect-left",
        newPicIndexFn: 'goRight'
    },
    swipeRight: {
        className: "carouselContainer",
        eventType: "swipeRight",
        entranceAnim: "anim-select-left",
        exitAnim: "anim-deselect-right",
        newPicIndexFn: 'goLeft'
    },
    SVGFrame: {
      thickness: 2, //vary thickness of frame, no effect for custom frames
      frame: 'square', //type of SVG frame
      customFrame: null, //takes an SVG path. Need to define "hole" in 100*100 square. Hole is stretched to match
    },
    customListeners: [] //takes an array of objects similar to eg the config.leftButton object
    //html must be added manually ie not using renderFromJSHTMLTemplate
  }

  function start(customConfig, id) {
    //if id is given the container selector name is generated from the id
    if (id) {customConfig.containerSel = `#carousel${id}`};

    let config=getDefaults(); //a copy made so original defaultconfig can be used for testing
    merge(config, customConfig);
    Object.freeze(config);

    let container = document.querySelector(config.containerSel);
    if (config.renderFromJSHTMLTemplate) {
      let carouselHTML = buildCarousel(config)
      container.innerHTML = carouselHTML
    }

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
      if (config.init.SVGFrame) {
      SVGFrame(config.SVGFrame, container)
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

  function setDefaults(customConfig) {
    merge(defaultConfig, customConfig);
  }

  function getDefaults() {
    return JSON.parse(JSON.stringify(defaultConfig));
  }
  //id is just for syntactic sugar as a shorthand for putting the container selector
  function render(customConfig, id) {
    type({renderFromJSHTMLTemplate: true}, customConfig, id)
  }

  function noPagination(customConfig, id) {
    type({init: {pagination: false},
          renderFromJSHTMLTemplate: true}, customConfig, id)
  }

  function justSlides(customConfig, id) {
    type({init: {
        pagination: false,
        button: false
      },
      renderFromJSHTMLTemplate: true
    }, customConfig, id)
  }

  function type(typeConfig, customConfig, id) {
    typeConfig = JSON.parse(JSON.stringify(typeConfig));
    if (customConfig) {
    merge(typeConfig, customConfig);
    }
    start(typeConfig, id);
  }

  function SVGFrame(configSVGFrame, container) {
    let thickness = configSVGFrame.thickness,
        type      = configSVGFrame.frame;

    let path = container.querySelector(".path");
    let height = 100;
    let width = 100;
    let w = width,
        h = height,
        t = thickness;

    let outsideLine = `M0 0 V${height} H${width} V0 L0 0`

    let frames = {
      square: `M${t} ${t}
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
        Q${t} ${5*t} ${3*t} ${3*t}`,
      custom: configSVGFrame.customFrame
    }

    path.setAttribute('d', `
    ${outsideLine}
    ${frames[type]}
    `);
  };

  function buildCarousel(config) {
    let carouselContainerStyles = [
      `position: relative;`,
      `overflow: hidden;`
    ].join("");

    let svgStyles = [
      `position: absolute;`,
      `top: 0;`,
      `z-index: 2;`,
      `width: 100%;`,
      `height: 100%;`
    ].join("");

    let carouselImageStyles = [
      `position: absolute;`,
      `width: 100%;`,
      `height: 100%;`
    ].join("");

    const noSlides = config.images.length
    let imageHTML = ``;
    let paginationHTML = ``;
    let leftButton = ``;
    let rightButton= ``;
    let svg = ``;

    for (let i=0; i<noSlides; i++) {
      imageHTML+=`<img class="carouselImage" src="${config.images[i]}"
      style="${carouselImageStyles}"/>`
    }

    if (config.init.pagination) {
      for (let i=1; i<= noSlides; i++) {
        paginationHTML+= `<button class="paginationButton">${i}</button>`
      }
    }

    if (config.init.button) {
      leftButton = `<button class="leftButton"> &lt; </button>`;
      rightButton = `<button class="rightButton"> &gt; </button>`
    }

    if (config.init.SVGFrame) {
      svg = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style="${svgStyles}">
        <path class="path" fill-rule="even-odd"/>
        </svg>`
    }

    let carousel = `
      <div class="carouselContainer" style="${carouselContainerStyles}">
        ${svg}
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
    start: start,
    setDefaults: setDefaults,
    getDefaults: getDefaults,
    render: render,
    noPagination: noPagination,
    justSlides: justSlides,
    type: type
    //testing
    ,
    __merge: merge,
    __buildCarousel: buildCarousel,
    __addSwipeListener: addSwipeListener,
    __moveCssClass: moveCssClass,
    __defaultConfig: getDefaults()
    //
  }

}))

//Builds something like
// <div id="containerSel">
//  <div class="carouselContainer" style="position: relative;overflow: hidden;">
//    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position: absolute;top: 0;z-index: 2;width: 100%;height: 100%;">
//     <path class="path" fill-rule="even-odd" d="
//         M0 0 V100 H100 V0 L0 0
//           M2 2
//               H98
//               V98
//               H2
//               L2 2">
//     </path>
//   </svg>
//   <img class="carouselImage" src="" />
//   <img class="carouselImage" src="" />
//   <img class="carouselImage" src="" />
// </div>
// <div class="buttons">
//   <button class="leftButton"> &lt; </button>
//   <button class="paginationButton">1</button><button class="paginationButton">2</button><button class="paginationButton">3</button>
//   <button class="rightButton"> &gt; </button>
// </div>
//</div>

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function () {
  var global = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var factory = arguments[1];

  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Carousel = factory();
})(undefined, function () {
  'use strict';

  var defaultConfig = {
    containerSel: null, //selector of containing element in html, must be unique

    //optional below:
    renderFromJSHTMLTemplate: false, // if false, need to build own HTML template in the document.*1
    images: null, //include image srces in array. Only required when JS template used,
    //when renderFromJSHTMLTemplate false, image srces collected from html

    noMoveAnim: 'anim-noMove-wiggle', //animation if current slide is selected again. css class
    init: {
      picIndex: 0, //the index of first image shown. 0-indexed
      pagination: true, //are touch listeners initialised?
      swipable: true, //are pagination listeners initialised? Also the html not included by render if false
      button: true, //are left/right buttons initialised? Also the html not included by render if false
      SVGFrame: false //no frame if false. Also the not included by render if false
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
      customFrame: null //takes an SVG path. Need to define "hole" in 100*100 square. Hole is stretched to match
    },
    customListeners: [] //takes an array of objects similar to eg the config.leftButton object
    //html must be added manually ie not using renderFromJSHTMLTemplate
  };

  function start(customConfig) {
    //create config
    var config = copy(defaultConfig); //a copy made so original defaultconfig can be used for testing
    merge(config, customConfig);
    Object.freeze(config);
    //hook to carousel, build carousel if needed
    var container = document.querySelector(config.containerSel);
    if (config.renderFromJSHTMLTemplate) {
      var carouselHTML = buildCarousel(config);
      container.innerHTML = carouselHTML;
    }
    //STATE
    var picIndexState = config.init.picIndex;
    //
    //props
    var numPics = getNumPics(config, container);
    var DOMPics = getDOMPics(numPics, container);
    //
    init();

    function init() {
      assignClassToSelectedImage(config.init.picIndex, container);
      if (config.init.pagination) {
        addPaginationListeners(config.pagination);
      }
      if (config.init.button) {
        addListener(config.leftButton);
        addListener(config.rightButton);
      }
      if (config.init.swipable) {
        addListener(config.swipeLeft);
        addListener(config.swipeRight);
      }
      if (config.customListeners) {
        addCustomListeners(config.customListeners);
      }
      if (config.init.SVGFrame) {
        SVGFrame(config.SVGFrame, container);
      }
    }

    function addPaginationListeners(paginationConfig) {
      var x = paginationConfig;
      var el = void 0;
      var newPicIndexFn = void 0;

      var _loop = function _loop(i) {
        el = container.getElementsByClassName(x.className)[i];
        newPicIndexFn = function newPicIndexFn() {
          return i;
        };
        el.addEventListener(x.eventType, slideTransition.bind(null, x.entranceAnim, x.exitAnim, newPicIndexFn));
      };

      for (var i = 0; i < numPics; i++) {
        _loop(i);
      }
    }

    function addCustomListeners(customListenersConfig) {
      customListenersConfig.forEach(function (customListenerConfig) {
        addListener(customListenerConfig);
      });
    }

    ///constructing listeners
    function addListener(carouselListenerConfig) {
      var x = carouselListenerConfig;
      var el = container.getElementsByClassName(x.className)[0];
      var newPicIndexFn = getIndexFunction(x.newPicIndexFn);
      var callback = slideTransition.bind(null, x.entranceAnim, x.exitAnim, newPicIndexFn);

      if (carouselListenerConfig.eventType.includes("swipe")) {
        return addSwipeListener(x.eventType, el, callback);
      } else {
        return el.addEventListener(x.eventType, callback);
      }
    }

    function slideTransition(entranceAnim, exitAnim, newPicIndexFn) {
      var newPicIndex = newPicIndexFn(picIndexState, numPics);
      if (newPicIndex === picIndexState) {
        runNoMoveAnim();
        return;
      }

      var prevPicIndex = picIndexState;
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

  function copy(object) {
    return JSON.parse(JSON.stringify(object));
  }

  function render(customConfig) {
    type({ renderFromJSHTMLTemplate: true }, customConfig);
  }

  function type(typeConfig, customConfig) {
    typeConfig = copy(typeConfig);
    if (customConfig) {
      merge(typeConfig, customConfig);
    }
    start(typeConfig);
  }

  function SVGFrame(configSVGFrame, container) {
    var thickness = configSVGFrame.thickness,
        type = configSVGFrame.frame;

    var path = container.querySelector(".path");
    var height = 100;
    var width = 100;
    var w = width,
        h = height,
        t = thickness;

    var outsideLine = 'M0 0 V' + height + ' H' + width + ' V0 L0 0';

    var frames = {
      square: 'M' + t + ' ' + t + '\n        H' + (w - t) + '\n        V' + (h - t) + '\n        H' + t + '\n        L' + t + ' ' + t,
      elliptical: 'M' + w / 2 + ' ' + t + '\n        A' + (w / 2 - t) + ' ' + (h / 2 - t) + ' 0, 0, 1,  ' + (w - t) + ' ' + h / 2 + '\n        A' + (w / 2 - t) + ' ' + (h / 2 - t) + ' 0, 0, 1,  ' + w / 2 + ' ' + (h - t) + '\n        A' + (w / 2 - t) + ' ' + (h / 2 - t) + ' 0, 0, 1,  ' + t + ' ' + h / 2 + '\n        A' + (w / 2 - t) + ' ' + (h / 2 - t) + ' 0, 0, 1,  ' + w / 2 + ' ' + t,
      chevron: 'M' + t + ' ' + t + '\n        L' + w / 2 + ' ' + 2 * t + '\n        L' + (w - t) + ' ' + t + '\n        L' + (w - 2 * t) + ' ' + h / 2 + '\n        L' + (w - t) + ' ' + (h - t) + '\n        L' + w / 2 + ' ' + (h - 2 * t) + '\n        L' + t + ' ' + (h - t) + '\n        L' + 2 * t + ' ' + h / 2 + '\n        L' + t + ' ' + t,
      curly: 'M' + t + ' ' + t + '\n        C' + 3 * t + ' ' + 3 * t + ', ' + (w - 3 * t) + ' ' + 3 * t + ', ' + (w - t) + ' ' + t + '\n        C' + (w - 3 * t) + ' ' + 3 * t + ', ' + (w - 3 * t) + ' ' + (h - 3 * t) + ' ' + (w - t) + ' ' + (h - t) + '\n        C' + (w - 3 * t) + ' ' + (h - 3 * t) + ', ' + 3 * t + ' ' + (h - 3 * t) + ' ' + t + ' ' + (h - t) + '\n        C' + 3 * t + ' ' + (h - 3 * t) + ', ' + 3 * t + ' ' + 3 * t + ', ' + t + ' ' + t,
      wavy: 'M' + 3 * t + ' ' + 3 * t + '\n        Q' + 5 * t + ' ' + t + ' ' + (w / 2 - t) + ' ' + 3 * t + '\n        Q' + w / 2 + ' ' + 3.1 * t + ' ' + (w / 2 + t) + ' ' + 3 * t + '\n        Q' + (w - 5 * t) + ' ' + t + ' ' + (w - 3 * t) + ' ' + 3 * t + '\n\n        Q' + (w - t) + ' ' + 5 * t + ' ' + (w - 3 * t) + ' ' + (h / 2 - t) + '\n        Q' + (w - 3.1 * t) + ' ' + h / 2 + ' ' + (w - 3 * t) + ' ' + (h / 2 + t) + '\n        Q' + (w - t) + ' ' + (h - 5 * t) + ' ' + (w - 3 * t) + ' ' + (h - 3 * t) + '\n\n        Q' + (w - 5 * t) + ' ' + (h - t) + ' ' + (w / 2 + t) + ' ' + (h - 3 * t) + '\n        Q' + w / 2 + ' ' + (h - 3.1 * t) + ' ' + (w / 2 - t) + ' ' + (h - 3 * t) + '\n        Q' + 5 * t + ' ' + (h - t) + ' ' + 3 * t + ' ' + (h - 3 * t) + '\n\n        Q' + t + ' ' + (h - 5 * t) + ' ' + 3 * t + ' ' + (h / 2 + t) + '\n        Q' + 3.1 * t + ' ' + h / 2 + ' ' + 3 * t + ' ' + (h / 2 - t) + '\n        Q' + t + ' ' + 5 * t + ' ' + 3 * t + ' ' + 3 * t,
      custom: configSVGFrame.customFrame
    };

    path.setAttribute('d', '\n    ' + outsideLine + '\n    ' + frames[type] + '\n    ');
  };

  function buildCarousel(config) {
    var carouselContainerStyles = ['position: relative;', 'overflow: hidden;'].join("");

    var svgStyles = ['position: absolute;', 'top: 0;', 'z-index: 2;', 'width: 100%;', 'height: 100%;'].join("");

    var carouselImageStyles = ['position: absolute;', 'width: 100%;', 'height: 100%;'].join("");

    var noSlides = config.images.length;
    var imageHTML = '';
    var paginationHTML = '';
    var leftButton = '';
    var rightButton = '';
    var svg = '';

    for (var i = 0; i < noSlides; i++) {
      imageHTML += '<img class="carouselImage" src="' + config.images[i] + '"\n      style="' + carouselImageStyles + '"/>';
    }

    if (config.init.pagination) {
      for (var _i = 1; _i <= noSlides; _i++) {
        paginationHTML += '<button class="paginationButton">' + _i + '</button>';
      }
    }

    if (config.init.button) {
      leftButton = '<button class="leftButton"> &lt; </button>';
      rightButton = '<button class="rightButton"> &gt; </button>';
    }

    if (config.init.SVGFrame) {
      svg = '<svg viewBox="0 0 100 100" preserveAspectRatio="none"\n      style="' + svgStyles + '">\n        <path class="path" fill-rule="even-odd"/>\n        </svg>';
    }

    var carousel = '\n      <div class="carouselContainer" style="' + carouselContainerStyles + '">\n        ' + svg + '\n        ' + imageHTML + '\n      </div>\n      <div class="buttons">\n        ' + leftButton + '\n        ' + paginationHTML + '\n        ' + rightButton + '\n      </div>\n    ';
    return carousel;
  }

  function merge(defaultObject, customObject) {
    //add custom keys
    for (var key in customObject) {
      if (!defaultObject.hasOwnProperty(key)) {
        defaultObject[key] = customObject[key];
      }
    }
    //overwrite keys
    for (var key in defaultObject) {
      if (defaultObject[key] !== Object(defaultObject[key]) && customObject.hasOwnProperty(key)) {
        defaultObject[key] = customObject[key];
      }
      //look in next layer
      //checks if key has a nested object (dubious about the trustworthiness of this)
      else if (defaultObject[key] === Object(defaultObject[key]) && customObject[key]) {
          merge(defaultObject[key], customObject[key]);
        }
    }
  }

  function addSwipeListener(swipeType, htmlEl, callback) {
    var touch = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    };

    htmlEl.addEventListener('touchstart', function (event) {
      touch.startX = event.changedTouches[0].screenX;
      touch.startY = event.changedTouches[0].screenY;
    }, false);

    htmlEl.addEventListener('touchend', function (event) {
      touch.endX = event.changedTouches[0].screenX;
      touch.endY = event.changedTouches[0].screenY;
      if (isSwipeType(swipeType, touch)) {
        callback();
      }
    }, false);
  }

  function isSwipeType(swipeType, touch) {
    var swipeTypeChecks = {
      swipeLeft: function swipeLeft(touch) {
        return touch.endX < touch.startX;
      },
      swipeRight: function swipeRight(touch) {
        return touch.endX > touch.startX;
      },
      swipeUp: function swipeUp(touch) {
        return touch.endY < touch.startY;
      },
      swipeDown: function swipeDown(touch) {
        return touch.endY > touch.startY;
      }
    };
    return swipeTypeChecks[swipeType](touch);
  }

  function runAnimationClass(htmlEl, animClass) {
    htmlEl.classList.add(animClass);
    htmlEl.addEventListener("animationend", function i() {
      htmlEl.classList.remove(animClass);
      htmlEl.removeEventListener("animationend", i);
    });
  }

  function moveCssClass(a, b, cssClass) {
    a.classList.remove(cssClass);
    b.classList.add(cssClass);
  }

  function getIndexFunction(string) {
    var indexFunctions = {
      goLeft: function goLeft(currPicId, numPics) {
        return (currPicId - 1 + numPics) % numPics;
      },
      goRight: function goRight(currPicId, numPics) {
        return (currPicId + 1) % numPics;
      },
      goRandom: function goRandom(currPicId, numPics) {
        return Math.floor(Math.random() * numPics);
      }
    };
    return indexFunctions[string];
  }

  function getNumPics(config, container) {
    return container.getElementsByClassName("carouselImage").length;
  }

  function getDOMPics(numPics, container) {
    var DOMPics = [];
    for (var i = 0; i < numPics; i++) {
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
    getDefaults: copy(defaultConfig),
    render: render,
    type: type
    //testing

    , __merge: merge,
    __buildCarousel: buildCarousel,
    __addSwipeListener: addSwipeListener,
    __moveCssClass: moveCssClass,
    __defaultConfig: copy(defaultConfig)
    //
  };
});
//# sourceMappingURL=Carousel.js.map

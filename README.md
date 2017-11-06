# Carousel Module

A configurable carousel allowing multiple slide transitions and custom image frames.

## Quickstart

1. link in the css file css/Carousel.css

2. in html body: 

<div id ="carousel1"></div>

3. In JS:

```
new Carousel.render({id:1, images: ["image1.jpg", "image2.jpg"]});
```

### Prerequisites

None! Build versions use es6 and sass.

### Essential files

es5/Carousel.js

css/Carousel.css

css/extraAnimations.css if extra animations are required


## Running the tests

open specRunner.html in chrome.

The above tests the carousel when the template is rendered by javascript. It also tests some helper functions in Carousel.js

open specRunner--CarouselInHTML.html in chrome

This tests that event listeners are added to the html already provided when template is written in html and not rendered by javascript.


## Methods

The Carousel is controlled by a config object. See below for the default config object. Only the values you wish to change
from the default need to be included in any custom configurations.

In all cases the containerSel key must be given so that it is know where to build the carousel.


```
new Carousel.start(configObject)
```

Builds a Carousel based on the config object passed in combined with default values.
If renderFromJSHTMLTemplate is set to false, a HTML template must be provided.
If renderFromJSHTMLTemplate is set to true, a div with the given container selector will be filled with
the carousel HTML.


```
new Carousel.render(configObject)
```

As above, but renderFromJSHTMLTemplate is automatically set to true.


```
Carousel.getDefault()
```

Shows the current default config object.


```
Carousel.setDefault(configObject) 
```

Overwrites the default config object with values in the passed configObject.

Any keys not included in the configObject remain set to the previous default.


## Controls

The Carousel is controlled by a config object. Below is the default config object. Only the values you wish to change
from the default need to be included in any custom configurations.


```
let defaultConfig = {
    //required: containerSel
    containerSel: null, //selector of containing element in html, must be unique

    //optional below:
    renderFromJSHTMLTemplate: false, // if false, need to build own HTML template in the document.
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

```

## Example HTML template


```
<div id="containerSel">
  <div class="carouselContainer" style="position: relative;overflow: hidden;">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position: absolute;top: 0;z-index: 2;width: 100%;height: 100%;">
      <path class="path" fill-rule="even-odd"></path>
    </svg>
    <img class="carouselImage" src="image1.jpg" />
    <img class="carouselImage" src="image2.jpg" />
    <img class="carouselImage" src="image3.jpg" />
  </div>
  <div class="buttons">
    <button class="leftButton"> &lt; </button>
    <button class="paginationButton">1</button>
    <button class="paginationButton">2</button>
    <button class="paginationButton">3</button>
    <button class="rightButton"> &gt; </button>
  </div>
</div>
```


## Acknowledgments

*Alejandro Cargnelutti

# Carousel Module

A configurable carousel allowing multiple slide transitions and custom image frames.

## Quickstart

1. Link the css file css/Carousel.css into your html file.

2. In html body: a continer div with an id selector. This is where your carousel will live.

```
<div id ="carousel1"></div>
```

3. Link to es5/Carousel.min.js and your own js file, index.js.

4. In index.js:

```
new Carousel.render({containerSel:"carousel1", images: ["image1.jpg", "image2.jpg"]});
```

### Prerequisites

None! Prebuild versions use es6 and sass.

To examine prebuild code see Carousel.js and Carousel.scss in root folder.


## Running the Tests

Open specRunner.html in a browser.

The above tests the carousel when the template is rendered by javascript. It also tests some helper functions in Carousel.js

open specRunner--CarouselInHTML.html in a browser.

This tests that event listeners are added to the html already provided when template is written in html and not rendered by javascript.

## Styling the Carousel

The css already is given is important to the functioning of the carousel, with these exceptions.
To change the size of the carousel the width and height of the carousel container can be altered.
The SVG frame is coloured translucent black by default. This can be changed.
Further stylings can be added to modify the carousel.


## Methods

The Carousel is controlled by a config object. See below for the default config object. Only the values you wish to change
from the default need to be included in any custom configurations.

In all cases the containerSel key must be given so that it is known where to build the carousel.


```
new Carousel.start(configObject)
```

Builds a Carousel based on the config object passed in combined with default values.
If renderFromJSHTMLTemplate is set to false, a HTML template must be provided.

### Example HTML template


```
<div id="containerSel">
  <div class="carouselContainer" style="position: relative;overflow: hidden;">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
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


```
new Carousel.type(typeObject, configObject)
```

This allows you to create a carousel 'type' with the typeObject. In this way you could create many similar carousels,
with for example the same set of images.
See example/example2


## Available animations

These entrance animations are available:

```
anim-select-top
anim-select-right
anim-select-bottom
anim-select-left
anim-select-bigShrink (extraAnimations.css)

```

These exit animations are available:

```
anim-deselect-top
anim-deselect-right
anim-deselect-bottom
anim-deselect-left
anim-deselect-shrink (extraAnimations.css)
```

These animations are available for when the current slide is selected:

```
anim-noMove-wiggle
anim-noMove-hop (extraAnimations.css)
```

Animations are accessed from css by class name. It is possible to define your own animations.
For safety, make sure that the "left" attribute of the .carouselImage class is explicitly set throughout the animation. This
attribute is used to hide the images when they are not displayed.

## Choices for choosing next image (newPicIndexFn)

```
goLeft
goRight
goRandom
```

## choices for SVG Frame


```
square
elliptical
chevron
curly
wavy
custom
```

A custom frame is defined using a custom path. The image is assumed to be a 100*100 square for the purpose of defining the path.
This square is then stretched to match the size of the image. To define a custom frame, enter the SVG path that defines a "hole"
that shows the image. See example/example.js

## Controls

The Carousel is controlled by a config object. Below is the default config object. Only the values you wish to change
from the default need to be included in any custom configurations.


```
let defaultConfig = {
    //required: containerSel
    containerSel: null, //selector of containing element in html, must be unique

    //optional below:
    renderFromJSHTMLTemplate: false, // if false, need to build own HTML template in the document.
    images: null,                    //include image srces in array. Only required when JS template used,
                                     //when renderFromJSHTMLTemplate false, image srces collected from html

    noMoveAnim: 'anim-noMove-wiggle',//animation if current slide is selected again. css class
    init: {
      picIndex: 0,       //the index of first image shown. 0-indexed
      pagination: true,  //are pagination listeners initialised? Also, associated html not included by render if false
      swipable: true,    //are touch listeners initialised?
      button: true,      //are left/right buttons initialised? Also, associated html not included by render if false
      SVGFrame: false    //no frame if false. Also, associated html not included by render if false
    },
    pagination: {
      className: 'paginationButton',  //class name of pagination buttons in HTML
      eventType: "click",             //event occurs on [click] of pagination button
      entranceAnim: "anim-select-top",//animation of entering image. A css classname.
      exitAnim: "anim-deselect-bottom"//animation of exiting image. A css classname.
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
      thickness: 2,      //vary thickness of frame, no effect for custom frames
      frame: 'square',   //type of SVG frame
      customFrame: null, //takes an SVG path. Need to define "hole" in 100*100 square. Hole is stretched to match
    },
    customListeners: [] //takes an array of objects similar to eg the config.leftButton object
                        //html must be added manually ie not using renderFromJSHTMLTemplate
  }

```


## Acknowledgments

*Alejandro Cargnelutti

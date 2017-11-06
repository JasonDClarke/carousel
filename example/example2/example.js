let typeConfig = {
  renderFromJSHTMLTemplate: true,
  images: ['350150.png', '350150.png', '350150.png', '350150.png']
}

new Carousel.type(typeConfig, {
  noMoveAnim: 'anim-noMove-wiggle',   //animation if current slide is selected again. css class
  init: {SVGFrame: true},//no frame if false. Also the not included by render if false
  SVGFrame: {
    frame: 'curly',
    thickness: 4 //type of SVG frame
  }
}, 1);

new Carousel.type(typeConfig, {
  pagination: {
    className: 'paginationButton', //class name of pagination buttons in HTML
    eventType: "click", //event occurs on [click] of pagination button
    entranceAnim: "anim-select-right", //animation of entering image. css class.
    exitAnim: "anim-deselect-left"
  }
}, 2);

new Carousel.type(typeConfig, {
  leftButton: { //describes event when clicking the left button
    className: 'leftButton',
    eventType: "mouseover",
    entranceAnim: "anim-select-bigShrink",
    exitAnim: "anim-deselect-left",
    newPicIndexFn: 'goRandom' //function deciding what the index of the next image is
  },
  rightButton: { //describes event when clicking the left button
    className: 'rightButton',
    eventType: "mouseover",
    entranceAnim: "anim-select-bigShrink",
    exitAnim: "anim-deselect-right",
    newPicIndexFn: 'goRandom' //function deciding what the index of the next image is
  }
}, 3);

new Carousel.type(typeConfig, {
  swipeLeft: { //describes event when swiping the image left (ie touch)
      className: "carouselContainer",
      eventType: "swipeUp",
      entranceAnim: "anim-select-bottom",
      exitAnim: "anim-deselect-top",
      newPicIndexFn: 'goLeft'
  },
  swipeRight: { //describes event when swiping the image left (ie touch)
      className: "carouselContainer",
      eventType: "swipeDown",
      entranceAnim: "anim-select-top",
      exitAnim: "anim-deselect-bottom",
      newPicIndexFn: 'goRight'
  }
}, 4);
new Carousel.type(typeConfig, {
  init: {pagination: false}
}, 5);

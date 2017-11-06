new Carousel.start({
  containerSel: "#carousel1",
  init: {SVGFrame: true},
  noMoveAnim: 'anim-noMove-hop',
  pagination: {
    className: 'paginationButton', //class name of pagination buttons in HTML
    eventType: "click", //event occurs on [click] of pagination button
    entranceAnim: "anim-select-top", //animation of entering image. css class.
    exitAnim: "anim-deselect-bottom" //animation of exiting image. css class.
  },
  SVGFrame: {
    frame: "custom",
    customFrame: `M2 2
    H98
    L50 98
    H2
    L50 2`
  },
  customListeners: [{
      className: "magicButton",
      eventType: "click",
      entranceAnim: "anim-select-bigShrink",
      exitAnim: "anim-deselect-shrink",
      newPicIndexFn: 'goRandom'
  }]
})

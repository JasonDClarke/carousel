new Carousel.start({
  containerSel: "#carousel1",
  noMoveAnim: 'anim-noMove-hop',
  pagination: {
    className: 'paginationButton', //class name of pagination buttons in HTML
    eventType: "click", //event occurs on [click] of pagination button
    entranceAnim: "anim-select-top", //animation of entering image. css class.
    exitAnim: "anim-deselect-bottom" //animation of exiting image. css class.
  },
  customListeners: [{
      className: "magicButton",
      eventType: "click",
      entranceAnim: "anim-select-bigShrink",
      exitAnim: "anim-deselect-shrink",
      newPicIndexFn: 'goRandom'
  }]
})

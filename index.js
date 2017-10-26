
//Create the default carousel
new Carousel(
  {
    containerSel: "#basicCarousel",
    paginationInit: false
  }
)

//create a non-default carousel
new Carousel(
  {
    containerSel: "#curlyCarousel",
    initPicIndex: 2,
    pagination: {
      entranceAnim: "anim-select-top"
    },
    customListeners: [{
        className: "magicButton",
        eventType: "click",
        entranceAnim: "anim-select-right",
        exitAnim: "anim-deselect-right",
        newPicIdFn: 'goRandom'
    }
  ]
  }
);

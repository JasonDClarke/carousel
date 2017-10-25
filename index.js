
//Create the default carousel
new Carousel(
  {
    container: document.getElementsByClassName("carousel")[0],
    numPics: 3
  }
)

//create a non-default carousel
new Carousel(
  {
    container: document.getElementsByClassName("carousel")[1],
    numPics: 3
  },
  {
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
    }]
  }
);

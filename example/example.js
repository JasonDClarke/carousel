Carousel.setDefaults({init: {SVGFrame: true}})
new Carousel.start(
{
  containerSel: "#dog",
  renderFromJSHTMLTemplate: true,
  images: ["http://media.timeout.com/blogimages/wp-content/uploads/2013/01/tumblr_lw7h7q5JKc1r3pgwbo1_500.jpeg",
  "https://metrouk2.files.wordpress.com/2017/01/512513451.jpg?quality=80&strip=all",
  "https://metrouk2.files.wordpress.com/2016/04/11951840_382970415232674_1167170684506797359_n.jpg?quality=80&strip=all"
],
// init: {SVGFrame: true},
noMoveAnim: 'anim-noMove-hop',
pagination: {
  className: 'paginationButton', //class name of pagination buttons in HTML
  eventType: "click", //event occurs on [click] of pagination button
  entranceAnim: "anim-select-top", //animation of entering image. css class.
  exitAnim: "anim-deselect-bottom" //animation of exiting image. css class.
}
}
)

//Create the default carousel
new Carousel.start(
  {
    containerSel: "#basicCarousel",
    // init: {SVGFrame: true},
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
  }
)



//create a non-default carousel
// new Carousel(
//   {
//     containerSel: "#curlyCarousel",
//     initPicIndex: 2,
//     SVGInit: true,
//     frame: "square",
//     width: 50,
//     pagination: {
//       entranceAnim: "anim-select-top"
//     },
//     customListeners: [{
//         className: "magicButton",
//         eventType: "click",
//         entranceAnim: "anim-select-bigShrink",
//         exitAnim: "anim-deselect-shrink",
//         newPicIdFn: 'goRandom'
//     }
//   ]
//   }
// );

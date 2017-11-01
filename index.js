//Create the default carousel
new Carousel(
  {
    containerSel: "#basicCarousel",
    paginationInit: true,
    swipableInit: true,
    SVGInit: true,
    frame: "custom",
    customFrame: `M2 2
    H98
    L50 98
    H2
    L50 2`
  }
)

// new Carousel(
// {
//   containerSel: "#dog",
//   renderFromJSHTMLTemplate: true,
//   images: ["http://media.timeout.com/blogimages/wp-content/uploads/2013/01/tumblr_lw7h7q5JKc1r3pgwbo1_500.jpeg",
//   "https://metrouk2.files.wordpress.com/2017/01/512513451.jpg?quality=80&strip=all",
//   "https://metrouk2.files.wordpress.com/2016/04/11951840_382970415232674_1167170684506797359_n.jpg?quality=80&strip=all"
// ],
// paginationInit: false,
// buttonInit: false
// }
// )

//create a non-default carousel
new Carousel(
  {
    containerSel: "#curlyCarousel",
    initPicIndex: 2,
    SVGInit: true,
    frame: "square",
    width: 50,
    pagination: {
      entranceAnim: "anim-select-top"
    },
    customListeners: [{
        className: "magicButton",
        eventType: "click",
        entranceAnim: "anim-select-bigShrink",
        exitAnim: "anim-deselect-shrink",
        newPicIdFn: 'goRandom'
    }
  ]
  }
);

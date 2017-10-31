// let path = document.getElementById("path");
// let height = 60;
// let width = 60;
// let thickness = 2;
// let w = width,
//     h = height,
//     t = thickness;
//
// let outsideLine = `M0 0 V${height} H${width} V0 L0 0`
// let squareFrame = `M${t} ${t}
// H${w-t}
// V${h-t}
// H${t}
// L${t} ${t}`
//
// let ellipticalFrame = `M${w/2} ${t}
// A${w/2-t} ${h/2-t} 0, 0, 1,  ${w-t} ${h/2}
// A${w/2-t} ${h/2-t} 0, 0, 1,  ${w/2} ${h-t}
// A${w/2-t} ${h/2-t} 0, 0, 1,  ${t} ${h/2}
// A${w/2-t} ${h/2-t} 0, 0, 1,  ${w/2} ${t}`
//
// let chevronFrame = `M${t} ${t}
// L${w/2} ${2*t}
// L${w-t} ${t}
// L${w-2*t} ${h/2}
// L${w-t} ${h-t}
// L${w/2} ${h-2*t}
// L${t} ${h-t}
// L${2*t} ${h/2}
// L${t} ${t}`
//
// let curlyFrame = `M${t} ${t}
// C${3*t} ${3*t}, ${w-3*t} ${3*t}, ${w-t} ${t}
// C${w-3*t} ${3*t}, ${w-3*t} ${h-3*t} ${w-t} ${h-t}
// C${w-3*t} ${h-3*t}, ${3*t} ${h-3*t} ${t} ${h-t}
// C${3*t} ${h-3*t}, ${3*t} ${3*t}, ${t} ${t}
// `
//
// let wavyFrame = `M${3*t} ${3*t}
// Q${5*t} ${t} ${w/2-t} ${3*t}
// Q${w/2} ${3.1*t} ${w/2+t} ${3*t}
// Q${w-5*t} ${t} ${w-3*t} ${3*t}
//
// Q${w-t} ${5*t} ${w-3*t} ${h/2-t}
// Q${w-3.1*t} ${h/2} ${w-3*t} ${h/2+t}
// Q${w-t} ${h-5*t} ${w-3*t} ${h-3*t}
//
// Q${w-5*t} ${h-t} ${w/2+t} ${h-3*t}
// Q${w/2} ${h-3.1*t} ${w/2-t} ${h-3*t}
// Q${5*t} ${h-t} ${3*t} ${h-3*t}
//
// Q${t} ${h-5*t} ${3*t} ${h/2+t}
// Q${3.1*t} ${h/2} ${3*t} ${h/2-t}
// Q${t} ${5*t} ${3*t} ${3*t}
// `
//
//
// path.setAttribute('d', `
// ${outsideLine}
// ${wavyFrame}
// `);




//Create the default carousel
new Carousel(
  {
    containerSel: "#basicCarousel",
    paginationInit: false,
    swipableInit: false,
    SVGInit: true,
    frame: "curly"
  }
)

new Carousel(
{
  containerSel: "#dog",
  renderFromJSHTMLTemplate: true,
  images: ["http://media.timeout.com/blogimages/wp-content/uploads/2013/01/tumblr_lw7h7q5JKc1r3pgwbo1_500.jpeg",
  "https://metrouk2.files.wordpress.com/2017/01/512513451.jpg?quality=80&strip=all",
  "https://metrouk2.files.wordpress.com/2016/04/11951840_382970415232674_1167170684506797359_n.jpg?quality=80&strip=all"
]
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

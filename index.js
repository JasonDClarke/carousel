
//Create the default carousel
let d = new Carousel({
container: document.getElementsByClassName("carousel")[0],
numPics: 3})
d.init();

//create a non-default carousel
let e = new Carousel({
  container: document.getElementsByClassName("carousel")[1],
  numPics: 3,
  initPicIndex: 2
});
e.init();

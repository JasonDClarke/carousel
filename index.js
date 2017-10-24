// let carousel = {
//   DOMPics: [],
//   numPics: 0,
//   currPicId: 0
// }
//
// let carouselInteraction = {
//   DOMHook: null,
//
// }


let DOMPics =[];
let numPics = 3;
for (var i=0; i<numPics; i++) {
  DOMPics[i] = document.getElementsByClassName('carouselImage')[i];
}

let idButton = [];
for (var i=0; i<numPics; i++) {
  idButton[i] = document.getElementsByClassName('idButton')[i];
}

let leftButton = document.getElementsByClassName('leftButton')[0];
let rightButton = document.getElementsByClassName('rightButton')[0];

let currPicId = 0;

function slideTransition(entranceAnim, exitAnim, newPicIdFn) {
  if (newPicIdFn(currPicId) === currPicId) {
    console.log("returned as already right image");
    return;
  }

  let prevPicId = currPicId;
  let newPicId = newPicIdFn(currPicId);
  moveCssClass(DOMPics[prevPicId], DOMPics[newPicId], "selected");
  runAnimationClass(DOMPics[newPicId], entranceAnim);
  runAnimationClass(DOMPics[prevPicId], exitAnim);

  currPicId = newPicId;
}

function runAnimationClass(htmlEl, animClass) {
  htmlEl.classList.add(animClass);
  htmlEl.addEventListener("animationend", function i() {
    htmlEl.classList.remove(animClass);
    htmlEl.removeEventListener("animationend", i);
  })
}

function goRight(a) {return (a-1+numPics)%numPics};
function goLeft(a) {return (a+1)%numPics};

function moveCssClass(a, b, cssClass) {
  a.classList.remove(cssClass);
  b.classList.add(cssClass);
}





rightButton.addEventListener("click", slideTransition.bind(this, "anim-select-bottom",
"anim-deselect-right", goRight));

leftButton.addEventListener("click", slideTransition.bind(this, "anim-select-top",
"anim-deselect-left", goLeft));

for (let i=0; i<numPics; i++) {
  idButton[i].addEventListener("click",
    slideTransition.bind(this, "anim-select-top",
"anim-deselect-left", ()=>i));
}

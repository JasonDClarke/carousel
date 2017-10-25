Quick start:

let c = new Carousel({
container: document.getElementsByClassName("carousel")[0],
numPics: 3,
initPicIndex: 2});

c.init();

The Carousel constructor:
The Carousel function takes an object containing:
container: html element containing the carousel (required)
numPics: number of pictures (required),
initPicIndex: the index of the picture initially shown (optional, defaults to 0)

The constructor does not add any event listeners.



The init method quickly hooks event listeners.
init does 3 things
// initialises default left button listener,
 which hooks to "leftButton" in HTML by default.

// initialises default right button listener,
 which hooks to "rightButton" in HTML by default.

// initialises defaultpagination listener,
 which hooks to "paginationButton" in HTML by default.

c.init();

4 custom methods allow more granular control:

1.
c.addPaginationInteractions(eventType, entranceAnim, exitAnim);

All 3 arguments are optional.
EventType defaults to "click".
entranceAnim defaults to "anim-select-right"
exitAnim defaults to "anim-deselect-right"
This adds to each pagination button an animation when the event occurs.
entranceAnim is the animation class applied to the entering image.
exitAnim is the animation class applied to the leaving image.

2.
c.addRightButtonInteraction(eventType, entranceAnim, exitAnim, newPicIdFn)

First 3 arguments do as above and are optional.

The last argument is also optional. It gives control of how the next picture
is selected. See section 4 for details.

3.
c.addLeftButtonInteraction(eventType, entranceAnim, exitAnim, newPicIdFn)

First 3 arguments do as above and are optional, except that
entranceAnim defaults to "anim-select-left"
exitAnim defaults to "anim-deselect-left"



4.
c.addCustomInteraction(interactionConfig);
to add a custom interaction/event listener enter an object of this form.
All fields are required.

example:
{
DOMHook: document.getElementsByClassName("nameOfClass")[0],
eventType: "hover"
entranceAnim: "anim-select-top",
exitAnim: "anim-deselect-right",
newPicIdFn: (currPicIndex, numPics)=>Math.floor(Math.random()*numPics)
}

DOMHook is the hook by which you access a html element.
eventType gives the type of event (e.g. "click, "hover")
entranceAnim and exitAnim are as above.
newPicIdFn is a function, optionally taking the current picture index and the
number of pictures as arguments, that returns the new picture index.
The function takes in whole numbers from 0 to numPics-1 and must always return
a value from 0 to numPics-1.
The function given returns a random image.



<div class="carouselContainer">
  <img class="selected carouselImage" src="#" />
  <img class="carouselImage" src="#" />
  <img class="carouselImage" src="#" />
</div>


<button class="leftButton"> &lt; </button>
<button class="paginationButton">0</button>
<button class="paginationButton">1</button>
<button class="paginationButton">2</button>
<button class="rightButton"> &gt; </button>

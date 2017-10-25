Quick start:

js // initialises a Carousel with five pictures and no event listeners.
let c = new Carousel(5);
c.init();

The Carousel constructor
Carousel(numPics, initPicIndex, carouselInteractions, customHooks);
The first argument is required and signifies the number of pictures.

The other arguments are optional.
The second argument is the index of the first picture to be shown.
This picture must have the class "selected" in the HTML. It defaults to 0.

The third argument can be used to edit the hooks used to access the html.
By default these hooks are used.


WARNING: this will break default behaviour. See below for more discussion.



Init quickly hooks event listeners.
init does 3 things
// initialises left button listener which hooks to "leftButton" in HTML by default
// initialises right button listener which hooks to "rightButton" in HTML by default
// initialises pagination listener which hooks to "paginationButton" in HTML by default
c.init();

4 custom methods allow more granular control:

1.
c.addPaginationInteractions(eventType, entranceAnim, exitAnim);

All 3 arguments are optional.
EventType defaults to "click".
entranceAnim defaults to "anim-select-right"
exitAnim defaults to "anim-deselect-right"
This adds to each pagination button an animation when the event occurs.
entranceAnim is the animation applied to the entering image.
exitAnim is the animation applied to the leaving image.

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

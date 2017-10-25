;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.Carousel = factory()
}(this, function() { 'use strict';

  return function(config) {
    const c = this;

    // all config inputs
    c.container = config.container
    c.numPics = config.numPics;
    c.currPicId = config.initPicIndex || 0;
    //

    c.carouselInteractionConfigs = [];
    c.DOMPics = getDOMPics(c.numPics);

    //add "selected" class to currPic
    c.container.getElementsByClassName('carouselImage')[c.currPicId].classList.add("selected");

    c.init = function() {
      c.addPaginationInteractions()
      c.addLeftButtonInteraction()
      c.addRightButtonInteraction()
    }

    c.addPaginationInteractions = function(eventType, entranceAnim, exitAnim) {
      for (let i=0; i<c.numPics; i++) {
        let interactionConfig = {
          DOMHook: c.container.getElementsByClassName('paginationButton')[i],
          eventType: eventType || "click",
          entranceAnim: entranceAnim || "anim-select-right",
          exitAnim: exitAnim || "anim-deselect-right",
          newPicIdFn: ()=>i
        }
        c.carouselInteractionConfigs.push(interactionConfig);
        addInteractionListener(interactionConfig)
      }
    }

    c.addLeftButtonInteraction = function(eventType, entranceAnim, exitAnim, newPicIdFn) {
      let interactionConfig = {
        DOMHook: c.container.getElementsByClassName('leftButton')[0],
        eventType: eventType || "click",
        entranceAnim: entranceAnim || "anim-select-left",
        exitAnim: exitAnim || "anim-deselect-left",
        newPicIdFn: newPicIdFn || goLeft
      }
      c.carouselInteractionConfigs.push(interactionConfig);
      addInteractionListener(interactionConfig)
    }

    c.addRightButtonInteraction = function(eventType, entranceAnim, exitAnim, newPicIdFn) {
      let interactionConfig = {
        DOMHook: c.container.getElementsByClassName('rightButton')[0],
        eventType: eventType || "click",
        entranceAnim: entranceAnim || "anim-select-right",
        exitAnim: exitAnim || "anim-deselect-right",
        newPicIdFn: newPicIdFn || goRight
      }
      c.carouselInteractionConfigs.push(interactionConfig);
      addInteractionListener(interactionConfig)
    }

    c.addCustomInteraction = function(interactionConfig) {
      c.carouselInteractionConfigs.push(interactionConfig);
      addInteractionListener(interactionConfig)
    }


    function getDOMPics(numPics) {
      let DOMPics =[];
      for (var i=0; i<numPics; i++) {
        DOMPics[i] = c.container.getElementsByClassName('carouselImage')[i];
      }
      return DOMPics;
    }

  ///constructing interactions
  ////
  function addInteractionListener(carouselInteractionConfig) {
    let x = carouselInteractionConfig;
    return x.DOMHook.addEventListener(
      x.eventType,
      slideTransition.bind(c, x.entranceAnim,x.exitAnim, x.newPicIdFn));
  }

  function slideTransition(entranceAnim, exitAnim, newPicIdFn) {
    let newPicId = newPicIdFn(c.currPicId, c.numPics);
    if (newPicId === c.currPicId) {
      console.log("returned as already right image");
      return;
    }

    let prevPicId = c.currPicId;
    moveCssClass(c.DOMPics[prevPicId], c.DOMPics[newPicId], 'selected');
    runAnimationClass(c.DOMPics[newPicId], entranceAnim);
    runAnimationClass(c.DOMPics[prevPicId], exitAnim);

    c.currPicId = newPicId;
  }

  function runAnimationClass(htmlEl, animClass) {
    htmlEl.classList.add(animClass);
    htmlEl.addEventListener("animationend", function i() {
      htmlEl.classList.remove(animClass);
      htmlEl.removeEventListener("animationend", i);
    })
  }

  function moveCssClass(a, b, cssClass) {
    a.classList.remove(cssClass);
    b.classList.add(cssClass);
  }

  /// newPicIdFns
  function goRight(currPicId, numPics) {return (currPicId-1+numPics)%numPics};
  function goLeft(currPicId, numPics) {return (currPicId+1)%numPics};
  }

}))

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.addSwipeListener = factory()
}(this, function() { 'use strict';
return function addSwipeListener(swipeType, htmlEl, callback) {
  let touch = {
    startX : 0,
    startY : 0,
    endX : 0,
    endY : 0
  }

  htmlEl.addEventListener('touchstart', function(event) {
      touch.startX = event.changedTouches[0].screenX;
      touch.startY = event.changedTouches[0].screenY;
  }, false);

  htmlEl.addEventListener('touchend', function(event) {
    touch.endX = event.changedTouches[0].screenX;
    touch.endY = event.changedTouches[0].screenY;
    if (isSwipeType(swipeType, touch)) {
      callback();
    }
  }, false);
}

function isSwipeType(swipeType, touch) {
  let swipeTypeChecks = {
    swipeLeft: (touch)=>touch.endX<touch.startX,
    swipeRight: (touch)=>touch.endX>touch.startX,
    swipeUp: (touch)=>touch.endY<touch.startY,
    swipeDown: (touch)=>touch.endY>touch.startY
  }

  return swipeTypeChecks[swipeType](touch);
  }
}));

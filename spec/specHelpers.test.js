// let buildCarousel = Carousel.__buildCarousel;
// let SVGFrame = Carousel.__SVGFrame;
let addSwipeListener = Carousel.__addSwipeListener;
// let isSwipeType = Carousel.__isSwipeType;
// let runAnimationClass = Carousel.__runAnimationClass;
let moveCssClass = Carousel.__moveCssClass;

describe("Helper functions", function() {
  describe("moveCssClass", function() {
    it("should move a css class from one class to another", function() {
      affix("div.example");
      affix("main");
      let a = document.querySelector("div.example");
      let b = document.querySelector("main");
      moveCssClass(a, b, "example");
      expect(a.classList).not.toContain("example")
      expect(b.classList).toContain("example")
    })
  });

  describe("addSwipeListener", function() {
    it("should add listener on touch start and touch end", function() {
      affix("div");
      let div = document.querySelector("div");
      let callback = function() {};
      spyOn(div, 'addEventListener');
      addSwipeListener('left', div, callback);
      expect(div.addEventListener.calls.count()).toEqual(2);
    })
  })
});

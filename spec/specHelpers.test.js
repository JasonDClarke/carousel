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

  describe("Merge function", function() {
    let obj1, obj2;
    let merge = Carousel.__merge;
    it("should successfully merge objects nested one deep", function() {
      obj1 = {a:1, b:2, c:3};
      obj2 = {c:4, d:5, e:6};
      merge(obj1, obj2);
      expect(obj1).toEqual({a:1, b:2, c:4, d:5, e:6});
    });

    it("should notice and merge undefined and null values", function() {
      obj1 = {a:1, b:null, c:3};
      obj2 = {c:4, d:undefined, e:null};
      merge(obj1, obj2);
      expect(obj1).toEqual({a:1, b: null, c:4, d:undefined, e:null});

      obj1 = {a:1, b:null, c:3};
      obj2 = {c:undefined, d:undefined, e:null};
      merge(obj1, obj2);
      expect(obj1).toEqual({a:1, b: null, c:undefined, d:undefined, e:null});
    });


    it("should merge objects nested to any depth", function() {
      obj1 = {a: {b: {c: {d: 4}}}};
      obj2 = {a: {b: {e: {f: 6}}}};
      merge(obj1, obj2);
      expect(obj1).toEqual(
        {a: {b: {c: {d: 4},
                 e: {f: 6}
      }}}
      )
    });

    it ("should merge successfully with empty objects", function() {
      obj1 ={a:"hello"};
      obj2 ={};
      merge(obj1, obj2);
      expect(obj1).toEqual({a:"hello"});
      obj1 ={};
      obj2 ={b: "goodbye"};
      merge(obj1, obj2);
      expect(obj1).toEqual({b: "goodbye"});
    })
  });
});

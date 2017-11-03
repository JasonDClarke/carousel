describe("Carousel rendering (using renderFromJSHTMLTemplate)", function() {

  afterEach(function() {
    let carousel = document.getElementById("carousel");
    carousel.innerHTML = ``;
  })

  it("should build carousel HTML when configured to", function() {
    let test = new Carousel.start(
      {
        containerSel: "#carousel",
        renderFromJSHTMLTemplate: true,
        images: ["./spec/testImage.jpg", "./spec/testImage.jpg"],
      }
    )
    let carousel = document.getElementById("carousel");
    expect(carousel.querySelectorAll(".paginationButton").length).toBe(2);
    expect(carousel.querySelectorAll(".carouselImage").length).toBe(2);
    expect(carousel.querySelector(".leftButton")).toExist();
    expect(carousel.querySelector(".rightButton")).toExist();
    expect(carousel.querySelector(".carouselContainer")).toExist();
    expect(carousel.querySelector(".selected")).toExist();
    expect(carousel.querySelector(".path")).toBeFalsy();
  });

  it("should build a frame when configured to", function() {
    let test = new Carousel.start(
      {
        containerSel: "#carousel",
        renderFromJSHTMLTemplate: true,
        images: ["./spec/testImage.jpg", "./spec/testImage.jpg"],
        init: {SVGFrame: true}
      }
    )
    let carousel = document.getElementById("carousel");
    expect(carousel.querySelector(".path")).toExist();
  });

  describe("default values", function() {
    it("should produce default frame when frame initialised", function() {
      let test = new Carousel.start(
        {
          containerSel: "#carousel",
          renderFromJSHTMLTemplate: true,
          images: ["./spec/testImage.jpg", "./spec/testImage.jpg"],
          init: {SVGFrame: true}
        }
      )
      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".path")).toExist();
      expect(typeof carousel.querySelector(".path").getAttribute("d")).toBe("string");
      expect(carousel.querySelector(".path").getAttribute("d"))
      .toContain(`M0 0 V100 H100 V0 L0 0`);
    });

    it("should show first image by default", function() {
      let test = new Carousel.start(
        {
          containerSel: "#carousel",
          renderFromJSHTMLTemplate: true,
          images: ["./spec/testImage.jpg", "./spec/testImage.jpg"],
          SVGInit: true
        }
      )
      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".carouselImage").classList).toContain("selected");
      expect(carousel.querySelectorAll(".carouselImage")[1].classList).not.toContain("selected");
    })
  })



  describe("build configs", function() {
    it("should not build image elements when no images are entered", function() {
      let test = new Carousel.start(
        {
          containerSel: "#carousel",
          renderFromJSHTMLTemplate: true,
          images: []
        }
      )
      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".buttons")).toExist();
      expect(carousel.querySelector(".carouselImage")).toBeFalsy();
      })


    it("should not build frame when not configured to", function() {
      let test = new Carousel.start(
        {
          containerSel: "#carousel",
          renderFromJSHTMLTemplate: true,
          images: ["./spec/testImage.jpg"],
        }
      )
      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".carouselImage")).toExist();
      expect(carousel.querySelector("svg")).toBeFalsy();
    });

    it("should not build pagination elements when not configured to", function() {
      let test = new Carousel.start(
        {
          containerSel: "#carousel",
          renderFromJSHTMLTemplate: true,
          images: ["./spec/testImage.jpg"],
          init: {pagination: false}
        }
      )
      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".carouselImage")).toExist();
      expect(carousel.querySelector(".paginationButton")).toBeFalsy();
    });

    it("should not build button elements when not configured to", function() {
      let test = new Carousel.start(
        {
          containerSel: "#carousel",
          renderFromJSHTMLTemplate: true,
          images: [],
          init: {button: false}
        }
      )
      expect(document.getElementById("carousel").querySelector(".leftButton")).toBeFalsy();
    });
  });

  describe("event listeners added", function() {
    let container;
    let defaultConfig = Carousel.__defaultConfig;
    let merge = Carousel.__merge;
    beforeEach(function() {
      container = document.getElementById("carousel");
      merge(defaultConfig,
        {
          containerSel: "#carousel",
          renderFromJSHTMLTemplate: false,
          images: ["./spec/testImage.jpg"]
       })
      container.innerHTML = Carousel.__buildCarousel(defaultConfig)
    })

    it("should add event listeners to appropriate parts of the carousel",
     function() {
      let leftButton = container.querySelector(".leftButton");
      let rightButton = container.querySelector(".rightButton");
      let paginationButton0 = container.querySelector(".paginationButton");
      let carouselContainer = container.querySelector(".carouselContainer");
      spyOn(leftButton, 'addEventListener');
      spyOn(rightButton, 'addEventListener');
      spyOn(paginationButton0, 'addEventListener');
      spyOn(carouselContainer, 'addEventListener')
      let test = new Carousel.start(
        {
          containerSel: "#carousel",
          renderFromJSHTMLTemplate: false,
          images: ["./spec/testImage.jpg"]
        }
      )
      expect(leftButton.addEventListener).toHaveBeenCalled();
      expect(rightButton.addEventListener).toHaveBeenCalled();
      expect(paginationButton0.addEventListener).toHaveBeenCalled();
      expect(carouselContainer.addEventListener).toHaveBeenCalled();
    })
  })
});

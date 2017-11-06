describe("Carousel rendering (using renderFromJSHTMLTemplate)", function() {
let defaultTestConfig = {
  containerSel: "#carousel",
  renderFromJSHTMLTemplate: true,
  images: ["./spec/testImage.jpg", "./spec/testImage.jpg"],
}


  afterEach(function() {
    let carousel = document.getElementById("carousel");
    carousel.innerHTML = ``;
  })

  it("should build carousel HTML when configured to", function() {
    new Carousel.start(defaultTestConfig)

    let carousel = document.getElementById("carousel");
    expect(carousel.querySelectorAll(".paginationButton").length).toBe(2);
    expect(carousel.querySelectorAll(".carouselImage").length).toBe(2);
    expect(carousel.querySelector(".leftButton")).toExist();
    expect(carousel.querySelector(".rightButton")).toExist();
    expect(carousel.querySelector(".carouselContainer")).toExist();
    expect(carousel.querySelector(".selected")).toExist();
    expect(carousel.querySelector(".path")).toBeFalsy();
  });

  it("should build an SVG frame when configured to", function() {
    let config = JSON.parse(JSON.stringify(defaultTestConfig));
    config.init = {SVGFrame: true};
    new Carousel.start(config);

    let carousel = document.getElementById("carousel");
    expect(carousel.querySelector(".path")).toExist();
  });

  describe("default values", function() {
    it("should produce a frame when frame initialised", function() {
      let config = JSON.parse(JSON.stringify(defaultTestConfig));
      config.init = {SVGFrame: true};
      new Carousel.start(config);

      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".path")).toExist();
      expect(typeof carousel.querySelector(".path").getAttribute("d")).toBe("string");
      expect(carousel.querySelector(".path").getAttribute("d"))
      .toContain(`M0 0 V100 H100 V0 L0 0`);
    });

    it("should show first image by default", function() {
      let test = new Carousel.start(defaultTestConfig)

      let carousel = document.getElementById("carousel");
      expect(carousel.querySelectorAll(".carouselImage")[0].classList).toContain("selected");
      expect(carousel.querySelectorAll(".carouselImage")[1].classList).not.toContain("selected");
    })
  })



  describe("build configs", function() {
    it("should not build image elements when no images are entered", function() {
      let config = JSON.parse(JSON.stringify(defaultTestConfig));
      config.images = [];
      new Carousel.start(config);

      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".buttons")).toExist();
      expect(carousel.querySelector(".carouselImage")).toBeFalsy();
      })


    it("should not build frame in default case when not configured to", function() {
      new Carousel.start(defaultTestConfig)
      
      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".carouselImage")).toExist();
      expect(carousel.querySelector("svg")).toBeFalsy();
    });

    it("should not build pagination elements when not configured to", function() {
      let config = JSON.parse(JSON.stringify(defaultTestConfig));
      config.init = {pagination: false};
      new Carousel.start(config);

      let carousel = document.getElementById("carousel");
      expect(carousel.querySelector(".carouselImage")).toExist();
      expect(carousel.querySelector(".paginationButton")).toBeFalsy();
    });

    it("should not build button elements when not configured to", function() {
      let config = JSON.parse(JSON.stringify(defaultTestConfig));
      config.init = {button: false};
      new Carousel.start(config)

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

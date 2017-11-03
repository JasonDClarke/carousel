describe("event listeners added", function() {

  it("should add event listeners to appropriate parts of the carousel",
   function() {
    container = document.getElementById("basicCarousel");
    let leftButton = container.querySelector(".leftButton");
    let rightButton = container.querySelector(".rightButton");
    let paginationButton0 = container.querySelector(".paginationButton");
    let carouselContainer = container.querySelector(".carouselContainer");
    spyOn(leftButton, 'addEventListener').and.callThrough();
    spyOn(rightButton, 'addEventListener').and.callThrough();
    spyOn(paginationButton0, 'addEventListener').and.callThrough();
    spyOn(carouselContainer, 'addEventListener').and.callThrough();
    let test = new Carousel.start(
      {
        containerSel: "#basicCarousel",
      }
    )
    expect(leftButton.addEventListener).toHaveBeenCalled();
    expect(rightButton.addEventListener).toHaveBeenCalled();
    expect(paginationButton0.addEventListener).toHaveBeenCalled();
    expect(carouselContainer.addEventListener).toHaveBeenCalled();
  })
})

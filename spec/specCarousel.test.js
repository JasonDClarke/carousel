describe("Carousel", function() {
  it("should build carousel HTML when configured to", function() {
    let test = new Carousel.start(
    {
      containerSel: "#carousel",
      renderFromJSHTMLTemplate: true,
      images: ["http://media.timeout.com/blogimages/wp-content/uploads/2013/01/tumblr_lw7h7q5JKc1r3pgwbo1_500.jpeg",
      "https://metrouk2.files.wordpress.com/2017/01/512513451.jpg?quality=80&strip=all",
      "https://metrouk2.files.wordpress.com/2016/04/11951840_382970415232674_1167170684506797359_n.jpg?quality=80&strip=all"
    ],
    SVGInit: true
    }
    )
    let carousel = document.getElementById("carousel");
    expect(document.getElementById("carousel").querySelector(".paginationButton")).toExist()
    console.log(carousel);
  });
});

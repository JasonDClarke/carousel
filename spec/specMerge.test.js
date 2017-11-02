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

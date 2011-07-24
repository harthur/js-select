var assert = require("assert"),
    fs = require("fs"),
    traverse = require("traverse")
    select = require("../index");

var people = {
   "george": {
       age : 35,
       movies: [{
          name: "Repo Man",
          stars: 5
      }]
   },
   "mary": {
       age: 15,
       movies: [{
           name: "Twilight",
           stars: 3
       },
       {
          name: "Trudy",
          stars: 2
       },
       {
          name: "The Fighter",
          stars: 4
       }]
   }
}
var people2 = traverse.clone(people);

assert.deepEqual(select(people, "*").nodes(), [{"george":{"age":35,"movies":[{"name":"Repo Man","stars":5}]},"mary":{"age":15,"movies":[{"name":"Twilight","stars":3},{"name":"Trudy","stars":2},{"name":"The Fighter","stars":4}]}},{"age":35,"movies":[{"name":"Repo Man","stars":5}]},35,[{"name":"Repo Man","stars":5}],{"name":"Repo Man","stars":5},"Repo Man",5,{"age":15,"movies":[{"name":"Twilight","stars":3},{"name":"Trudy","stars":2},{"name":"The Fighter","stars":4}]},15,[{"name":"Twilight","stars":3},{"name":"Trudy","stars":2},{"name":"The Fighter","stars":4}],{"name":"Twilight","stars":3},"Twilight",3,{"name":"Trudy","stars":2},"Trudy",2,{"name":"The Fighter","stars":4},"The Fighter",4]);
assert.deepEqual(select(people, ".george").nodes(), [{"age":35,"movies":[{"name":"Repo Man","stars":5}]}]);
assert.deepEqual(select(people, ".george .age").nodes(), [35]);
assert.deepEqual(select(people, ".george .name").nodes(), ["Repo Man"]);
assert.deepEqual(select(people, ".george *").nodes(), [35,[{"name":"Repo Man","stars":5}],{"name":"Repo Man","stars":5},"Repo Man",5])

assert.deepEqual(select(people, ".george > *").nodes(), [35,[{"name":"Repo Man","stars":5}]]);
assert.deepEqual(select(people, ".george > .name").nodes(), []);

assert.deepEqual(select(people, ":nth-child(2)").nodes(), [{"name":"Trudy","stars":2}]);
assert.deepEqual(select(people, ":nth-child(even)").nodes(), [{"name":"Repo Man","stars":5},{"name":"Twilight","stars":3},{"name":"The Fighter","stars":4}]);
assert.deepEqual(select(people, ":nth-child(odd)").nodes(), [{"name":"Trudy","stars":2}]);
assert.deepEqual(select(people, ":root").nodes(), [{"george":{"age":35,"movies":[{"name":"Repo Man","stars":5}]},"mary":{"age":15,"movies":[{"name":"Twilight","stars":3},{"name":"Trudy","stars":2},{"name":"The Fighter","stars":4}]}}]);


// invalid
assert.deepEqual(select(people, ".hmmm").nodes(), []);
assert.throws(function() {
   select(people, "afcjwiojwe9q28*C@!(# (!#R($R)))").nodes();
});

// modding
select(people, ".age").forEach(function(age) {
    this.update(age - 5);
})
assert.deepEqual(select(people, ".age").nodes(), [30, 10]);


// this.matches()
select(people2).forEach(function(node) {
   if (this.matches(".age")) {
      this.update(node + 10);
   }
});
assert.deepEqual(select(people2, ".age").nodes(), [45, 25])


// bigger stuff
var timeline = require("./timeline.json")

console.time("select time");
assert.equal(select(timeline, ".bug .id").nodes().length, 126);
assert.equal(select(timeline, ".id").nodes().length, 141);
assert.equal(select(timeline, ".comments .id").nodes().length, 115);
assert.equal(select(timeline, "*").nodes().length, 3281);
console.timeEnd("select time")

var sel = require("JSONSelect");

console.time("JSONSelect time")
assert.equal(sel.match(".bug .id", timeline).length, 126);
assert.equal(sel.match(".id", timeline).length, 141);
assert.equal(sel.match(".comments .id", timeline).length, 115);
assert.equal(sel.match("*", timeline).length, 3281);
console.timeEnd("JSONSelect time")

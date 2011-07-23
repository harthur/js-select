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
       }]
   }
}
var people2 = traverse.clone(people);


assert.deepEqual(select(people, "*").nodes(), [{"george":{"age":35,"movies":[{"name":"Repo Man","stars":5}]},"mary":{"age":15,"movies":[{"name":"Twilight","stars":3}]}},{"age":35,"movies":[{"name":"Repo Man","stars":5}]},35,[{"name":"Repo Man","stars":5}],{"name":"Repo Man","stars":5},"Repo Man",5,{"age":15,"movies":[{"name":"Twilight","stars":3}]},15,[{"name":"Twilight","stars":3}],{"name":"Twilight","stars":3},"Twilight",3]);
assert.deepEqual(select(people, ".george").nodes(), [{"age":35,"movies":[{"name":"Repo Man","stars":5}]}]);
assert.deepEqual(select(people, ".george .age").nodes(), [35]);
assert.deepEqual(select(people, ".george .name").nodes(), ["Repo Man"]);
assert.deepEqual(select(people, ".mary *").nodes(), [15,[{"name":"Twilight","stars":3}],{"name":"Twilight","stars":3},"Twilight",3])

assert.deepEqual(select(people, ".mary > *").nodes(), [15,[{"name":"Twilight","stars":3}]]);
assert.deepEqual(select(people, ".george > .name").nodes(), []);

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

var t1 = Date.now();
assert.deepEqual(select(timeline, ".bug .id").nodes().length, 126);
assert.deepEqual(select(timeline, ".id").nodes().length, 141);
assert.deepEqual(select(timeline, ".comments .id").nodes().length, 115);
var t2 = Date.now() - t1;

console.log(t2);

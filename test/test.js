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


assert.deepEqual(select(people).nodes("*"), [{"george":{"age":35,"movies":[{"name":"Repo Man","stars":5}]},"mary":{"age":15,"movies":[{"name":"Twilight","stars":3}]}},{"age":35,"movies":[{"name":"Repo Man","stars":5}]},35,[{"name":"Repo Man","stars":5}],{"name":"Repo Man","stars":5},"Repo Man",5,{"age":15,"movies":[{"name":"Twilight","stars":3}]},15,[{"name":"Twilight","stars":3}],{"name":"Twilight","stars":3},"Twilight",3]);
assert.deepEqual(select(people).nodes(".george"), [{"age":35,"movies":[{"name":"Repo Man","stars":5}]}]);
assert.deepEqual(select(people).nodes(".george .age"), [35]);
assert.deepEqual(select(people).nodes(".george .name"), ["Repo Man"]);
assert.deepEqual(select(people).nodes(".mary *"), [15,[{"name":"Twilight","stars":3}],{"name":"Twilight","stars":3},"Twilight",3])

// invalid
assert.deepEqual(select(people).nodes(".hmmm"), []);
assert.throws(function() {
   select.nodes("afcjwiojwe9q28*C@!(# (!#R($R)))", people);
});

// modding
select(people).forEach(".age", function(age) {
    this.update(age - 5);
})
assert.deepEqual(select(people).nodes(".age"), [30, 10]);


// this.matches()
select(people2).forEach(function(node) {
   if (this.matches(".age")) {
      this.update(node + 10);
   }
});
assert.deepEqual(select(people2).nodes(".age"), [45, 25])


// bigger stuff
var file = __dirname + "/timeline.json";
var timeline = JSON.parse(fs.readFileSync(file));

assert.deepEqual(select(timeline).nodes(".bug .id").length, 126);
assert.deepEqual(select(timeline).nodes(".id").length, 141);
assert.deepEqual(select(timeline).nodes(".comments .id").length, 115);

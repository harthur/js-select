# js-select

js-select uses [js-traverse](https://github.com/substack/js-traverse) to traverse and modify JavaScript object nodes that match [JSONSelect](http://jsonselect.org/) selectors:

```javascript
var people = {
   george: {
      age : 35,
      movie: "Repo Man"
   },
   mary: {
      age: 15,
      movie: "Twilight"
   }
}

select(people, ".age").forEach(function(age) {
   this.update(age - 5);
})

select(people, ".age").nodes();  // [30, 10]
```

See [js-traverse](https://github.com/substack/js-traverse) for all the things you can do to modify the node. The `forEach()` callback will get the same `this` context as the `forEach()` callback from [js-traverse](https://github.com/substack/js-traverse), plus a `this.matches()` which will test if the node matches a selector:

```javascript
select(obj).forEach(function(node) {
   if (this.matches(".mary > .movie")) {
      this.remove();
   }
}
```

# selectors

js-select supports the following [JSONSelect](http://jsonselect.org/) selectors:

```
*
type
.key
.ancestor .key
.parent > .key
.sibling ~ .key
:root
:nth-child(n)
:nth-child(even)
:nth-child(odd)
:nth-last-child(n)
:first-child
:last-child
:only-child
:has(selector)
:val("string")
:contains("substring")
```

See [details](http://jsonselect.org/#docs/overview) on each selector, and [try them](http://jsonselect.org/#tryit) out on the JSONSelect website.

# install

For [node](http://nodejs.org), install with [npm](http://npmjs.org):

```bash
npm install js-select
```

For the browser, download the select.js file or fetch the latest version from [npm](http://npmjs.org) and build a browser file using [browserify](https://github.com/substack/node-browserify):

```bash
npm install browserify -g
npm install js-select

browserify --require js-select --outfile select.js
```
this will build a browser file with `require('js-select')` available.

# propers

Huge thanks to [@substack](http://github.com/substack) for the ingenious [js-traverse](https://github.com/substack/js-traverse) and [@lloyd](https://github.com/lloyd) for the ingenious [JSONSelect spec](http://http://jsonselect.org/) and [selector parser](http://search.npmjs.org/#/JSONSelect).

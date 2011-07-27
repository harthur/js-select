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

select(people, ".age").nodes();     // [35, 15]

select(people, ".age").update(function(age) {
   return age - 5;
});

select(people, ".age").remove();
```

There's also a `forEach()` which gets a special `this` context. See [js-traverse](https://github.com/substack/js-traverse) for all the things you can do to modify and inspect the node with this context. In addition, js-select adds a `this.matches()` which will test if the node matches a selector:

```javascript
select(people).forEach(function(node) {
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
ancestor selector
parent > selector
sibling ~ selector
selector1, selector2
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
